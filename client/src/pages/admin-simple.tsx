import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Users, Settings, Activity, BarChart3, User, UserCheck, UserX, Eye, Edit, Trash2, Clock, MapPin, Star, AlertTriangle, MessageCircle, CheckCircle, Trash, TrendingUp, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { toast, toastAngola } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function AdminPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [location, navigate] = useLocation();
  const [selectedUser, setSelectedUser] = useState(null);
  const [settingsValues, setSettingsValues] = useState({});

  // Check if user is admin
  const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/admin/stats');
        return response.ok;
      } catch {
        return false;
      }
    },
    enabled: !!user,
  });

  // Admin stats - refresh every 5 seconds for real-time updates
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: !!isAdmin,
    refetchInterval: 5000, // Atualizar a cada 5 segundos
    refetchOnWindowFocus: true, // Atualizar quando a janela volta ao foco
  });

  // All users - refresh every 10 seconds for real-time updates
  const { data: users } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: !!isAdmin,
    refetchInterval: 10000, // Atualizar a cada 10 segundos
    refetchOnWindowFocus: true, // Atualizar quando a janela volta ao foco
  });

  // Admin logs
  const { data: logs } = useQuery({
    queryKey: ['/api/admin/logs'],
    enabled: !!isAdmin,
  });

  // Site settings
  const { data: settings } = useQuery({
    queryKey: ['/api/admin/settings'],
    enabled: !!isAdmin,
  });

  // Analytics data
  const { data: analyticsData } = useQuery({
    queryKey: ['/api/admin/analytics'],
    enabled: !!isAdmin,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Analytics
  const { data: analytics } = useQuery({
    queryKey: ['/api/admin/analytics'],
    enabled: !!isAdmin,
  });

  // Initialize settings values when data is loaded
  useEffect(() => {
    if (settings) {
      const initialValues = {};
      settings.forEach(setting => {
        initialValues[setting.key] = setting.value;
      });
      setSettingsValues(initialValues);
    }
  }, [settings]);

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      return await apiRequest(`/api/admin/users/${userId}/role`, 'PATCH', { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/logs'] });
      toastAngola.success({
        title: "Papel atualizado",
        description: "O papel do utilizador foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toastAngola.error({
        title: "Erro",
        description: "Não foi possível atualizar o papel do utilizador.",
      });
    },
  });

  // Update user status mutation
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      return await apiRequest(`/api/admin/users/${userId}/status`, 'PATCH', { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/logs'] });
      toastAngola.success({
        title: "Status atualizado",
        description: "O status do utilizador foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toastAngola.error({
        title: "Erro",
        description: "Não foi possível atualizar o status do utilizador.",
      });
    },
  });

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return await apiRequest(`/api/admin/settings/${key}`, 'PATCH', { value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toastAngola.success({
        title: "Definição atualizada",
        description: "A definição foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      toastAngola.error({
        title: "Erro",
        description: "Não foi possível atualizar a definição.",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await apiRequest(`/api/admin/users/${userId}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/logs'] });
      toast({
        title: "Utilizador eliminado",
        description: "O utilizador foi eliminado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível eliminar o utilizador.",
        variant: "destructive",
      });
    },
  });

  // Check if user is admin
  if (isAdminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              <Shield className="h-8 w-8 mx-auto mb-2" />
              Acesso Negado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Não tem permissões de administrador para aceder a esta página.
            </p>
            <div className="mt-4 text-center">
              <Button onClick={() => navigate('/')} variant="outline">
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter settings to only show essential ones
  const essentialSettings = settings?.filter(setting => 
    setting.key === 'maintenance_mode' || setting.key === 'registration_enabled' || setting.key === 'login_enabled'
  ) || [];

  // Maintenance page settings
  const maintenanceSettings = settings?.filter(setting => 
    setting.key === 'maintenance_title' || 
    setting.key === 'maintenance_description' || 
    setting.key === 'maintenance_status' ||
    setting.key === 'maintenance_contact_text'
  ) || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-red-600" />
          Painel de Administração
        </h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
        >
          Voltar ao Site
        </Button>
      </div>

      {/* Stats Cards - Optimized for Mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2 px-3 sm:px-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-700 flex items-center gap-1">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Total de Utilizadores</span>
              <span className="sm:hidden">Total</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3">
            <div className="text-lg sm:text-2xl font-bold text-blue-800">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2 px-3 sm:px-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-green-700 flex items-center gap-1">
              <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Utilizadores Activos</span>
              <span className="sm:hidden">Activos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3">
            <div className="text-lg sm:text-2xl font-bold text-green-800">{stats?.active || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2 px-3 sm:px-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-yellow-700 flex items-center gap-1">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Administradores</span>
              <span className="sm:hidden">Admins</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3">
            <div className="text-lg sm:text-2xl font-bold text-yellow-800">{stats?.admins || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2 px-3 sm:px-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-purple-700 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Novos Hoje</span>
              <span className="sm:hidden">Hoje</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3">
            <div className="text-lg sm:text-2xl font-bold text-purple-800">{stats?.newToday || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Utilizadores</TabsTrigger>
          <TabsTrigger value="logs">Registos</TabsTrigger>
          <TabsTrigger value="settings">Definições</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Utilizadores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Papel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Data de Registo</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.municipality}, {user.province}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('pt-AO')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={user.role}
                              onValueChange={(value) => updateUserRoleMutation.mutate({ userId: user.id, role: value })}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">user</SelectItem>
                                <SelectItem value="admin">admin</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteUserMutation.mutate(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registos de Actividade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Administrador</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(log.created_at).toLocaleString('pt-AO')}
                          </div>
                        </TableCell>
                        <TableCell>{log.admin_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab - SIMPLIFIED */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Definições Essenciais do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {essentialSettings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {setting.key === 'maintenance_mode' ? 'Modo de Manutenção' : 
                         setting.key === 'registration_enabled' ? 'Permitir Novos Registos' : 'Permitir Conexões'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {setting.key === 'maintenance_mode' 
                          ? 'Activar/desactivar modo de manutenção do site'
                          : setting.key === 'registration_enabled'
                          ? 'Permitir que novos utilizadores se registem'
                          : 'Permitir que utilizadores existentes se conectem'
                        }
                      </p>
                    </div>
                    <div className="ml-4">
                      <Select
                        value={setting.value}
                        onValueChange={(value) => updateSettingMutation.mutate({ key: setting.key, value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Activado</SelectItem>
                          <SelectItem value="false">Desactivado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Page Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuração da Página de Manutenção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor="maintenance-title">Título da Página</Label>
                  <Input
                    id="maintenance-title"
                    placeholder="Site em Manutenção"
                    value={maintenanceSettings.find(s => s.key === 'maintenance_title')?.value || 'Site em Manutenção'}
                    onChange={(e) => updateSettingMutation.mutate({ key: 'maintenance_title', value: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="maintenance-description">Descrição</Label>
                  <Textarea
                    id="maintenance-description"
                    placeholder="Estamos a trabalhar para melhorar a sua experiência no Jikulumessu. O site voltará em breve com novas funcionalidades e melhorias."
                    value={maintenanceSettings.find(s => s.key === 'maintenance_description')?.value || 'Estamos a trabalhar para melhorar a sua experiência no Jikulumessu. O site voltará em breve com novas funcionalidades e melhorias.'}
                    onChange={(e) => updateSettingMutation.mutate({ key: 'maintenance_description', value: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Status Message */}
                <div>
                  <Label htmlFor="maintenance-status">Mensagem de Status</Label>
                  <Input
                    id="maintenance-status"
                    placeholder="Voltaremos em breve"
                    value={maintenanceSettings.find(s => s.key === 'maintenance_status')?.value || 'Voltaremos em breve'}
                    onChange={(e) => updateSettingMutation.mutate({ key: 'maintenance_status', value: e.target.value })}
                  />
                </div>

                {/* Contact Text */}
                <div>
                  <Label htmlFor="maintenance-contact">Texto de Contacto</Label>
                  <Input
                    id="maintenance-contact"
                    placeholder="Precisa de ajuda urgente?"
                    value={maintenanceSettings.find(s => s.key === 'maintenance_contact_text')?.value || 'Precisa de ajuda urgente?'}
                    onChange={(e) => updateSettingMutation.mutate({ key: 'maintenance_contact_text', value: e.target.value })}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 <strong>Dica:</strong> Estas configurações são aplicadas imediatamente quando o modo de manutenção está ativado. 
                    Pode personalizar completamente a mensagem que os utilizadores veem durante a manutenção.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Crescimento de Utilizadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { date: '01/01', users: 0 },
                      { date: '02/01', users: 2 },
                      { date: '03/01', users: 5 },
                      { date: '04/01', users: 8 },
                      { date: '05/01', users: 12 },
                      { date: '06/01', users: 15 },
                      { date: '07/01', users: stats?.total || 0 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#dc2626" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Distribution by Role */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Distribuição por Papel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Utilizadores', value: (stats?.total || 0) - (stats?.admins || 0), fill: '#3b82f6' },
                          { name: 'Administradores', value: stats?.admins || 0, fill: '#dc2626' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#dc2626" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Resumo da Atividade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats?.total || 0}</div>
                  <div className="text-sm text-blue-800">Total de Utilizadores</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats?.active || 0}</div>
                  <div className="text-sm text-green-800">Utilizadores Ativos</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats?.newToday || 0}</div>
                  <div className="text-sm text-purple-800">Novos Hoje</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs?.slice(0, 5).map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">{log.action}</div>
                        <div className="text-sm text-gray-600">{log.details}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString('pt-PT')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}