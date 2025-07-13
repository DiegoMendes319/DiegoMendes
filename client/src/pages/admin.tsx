import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Users, Settings, Activity, BarChart3, User, UserCheck, UserX, Eye, Edit, Trash2, Clock, MapPin, Star, AlertTriangle, MessageCircle, CheckCircle, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function AdminPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [location, navigate] = useLocation();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [newSettingKey, setNewSettingKey] = useState("");
  const [newSettingValue, setNewSettingValue] = useState("");
  const [editingSettings, setEditingSettings] = useState({});
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

  // Admin stats
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: !!isAdmin,
  });

  // All users
  const { data: users } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: !!isAdmin,
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
      toast({
        title: "Papel atualizado",
        description: "O papel do utilizador foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o papel do utilizador.",
        variant: "destructive",
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
      toast({
        title: "Status atualizado",
        description: "O status do utilizador foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do utilizador.",
        variant: "destructive",
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

  // Update site setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return await apiRequest(`/api/admin/settings/${key}`, 'PATCH', { value });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/logs'] });
      
      // Update local state immediately
      setSettingsValues(prev => ({
        ...prev,
        [variables.key]: variables.value
      }));
      
      toast({
        title: "Definição atualizada",
        description: "A definição do site foi atualizada com sucesso.",
      });
      setIsSettingsDialogOpen(false);
      setNewSettingKey("");
      setNewSettingValue("");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a definição.",
        variant: "destructive",
      });
    },
  });



  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      navigate('/');
      toast({
        title: "Acesso negado",
        description: "Não tem permissões para aceder a esta página.",
        variant: "destructive",
      });
    }
  }, [isAdmin, isAdminLoading, navigate]);

  if (isAdminLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">A carregar painel administrativo...</p>
        </div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'admin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-PT');
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'update_user_role': return <UserCheck className="w-4 h-4" />;
      case 'update_user_status': return <UserX className="w-4 h-4" />;
      case 'update_site_setting': return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Função para obter descrição da definição - APENAS DEFINIÇÕES ESSENCIAIS
  const getSettingDescription = (key: string) => {
    const descriptions = {
      'site_title': 'O título principal do site que aparece no navegador e nos resultados de pesquisa',
      'site_description': 'Descrição breve do site para SEO e redes sociais',
      'maintenance_mode': 'Activar/desactivar modo de manutenção (true/false)',
      'registration_enabled': 'Permitir que novos utilizadores se registem (true/false)',
      'primary_color': 'Cor principal do site e elementos principais',
      'secondary_color': 'Cor secundária para elementos complementares',
    };
    return descriptions[key] || 'Definição personalizada do sistema';
  };

  // Função para obter exemplo da definição
  const getSettingExample = (key: string) => {
    const examples = {
      'site_title': 'Jikulumessu - Portal de Serviços',
      'site_description': 'Plataforma para conectar pessoas com prestadores de serviços em Angola',
      'contact_email': 'contacto@jikulumessu.ao',
      'contact_phone': '+244 900 000 000',
      'maintenance_mode': 'false',
      'max_upload_size': '10',
      'registration_enabled': 'true',
      'review_moderation': 'false',
      'welcome_message': 'Bem-vindo ao Jikulumessu! Encontre os melhores serviços aqui.',
      'terms_version': '1.0',
      'privacy_version': '1.0',
      'featured_services': 'limpeza, jardinagem, segurança, transporte',
      'social_facebook': 'https://facebook.com/jikulumessu',
      'social_instagram': 'https://instagram.com/jikulumessu',
      'analytics_enabled': 'true',
      'notification_email': 'admin@jikulumessu.ao',
      'primary_color': '#DC2626',
      'secondary_color': '#000000',
      'accent_color': '#FCD34D',
      'background_color': '#FFFFFF',
      'text_color': '#111827',
      'header_color': '#DC2626',
      'footer_color': '#374151',
      'button_color': '#DC2626',
      'link_color': '#2563EB',
      'border_color': '#D1D5DB',
      'success_color': '#059669',
      'warning_color': '#D97706',
      'error_color': '#DC2626',
      'info_color': '#0EA5E9',
      'card_background': '#F9FAFB',
      'sidebar_color': '#F3F4F6',
      'menu_color': '#FFFFFF',
      'hover_color': '#F3F4F6',
      'active_color': '#EF4444',
      'disabled_color': '#9CA3AF',
    };
    return examples[key] || 'valor_exemplo';
  };

  // Função para obter input apropriado
  const getSettingInput = (key: string) => {
    const booleanKeys = ['maintenance_mode', 'registration_enabled', 'review_moderation', 'analytics_enabled'];
    const textareaKeys = ['site_description', 'welcome_message', 'featured_services'];
    const colorKeys = ['primary_color', 'secondary_color', 'accent_color', 'background_color', 'text_color', 'header_color', 'footer_color', 'button_color', 'link_color', 'border_color', 'success_color', 'warning_color', 'error_color', 'info_color', 'card_background', 'sidebar_color', 'menu_color', 'hover_color', 'active_color', 'disabled_color'];
    
    if (colorKeys.includes(key)) {
      return (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={newSettingValue || getSettingExample(key)}
            onChange={(e) => setNewSettingValue(e.target.value)}
            className="w-12 h-10 border rounded cursor-pointer"
          />
          <Input
            value={newSettingValue}
            onChange={(e) => setNewSettingValue(e.target.value)}
            placeholder={getSettingExample(key)}
            className="flex-1"
          />
        </div>
      );
    } else if (booleanKeys.includes(key)) {
      return (
        <Select value={newSettingValue} onValueChange={setNewSettingValue}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Activado</SelectItem>
            <SelectItem value="false">Desactivado</SelectItem>
          </SelectContent>
        </Select>
      );
    } else if (textareaKeys.includes(key)) {
      return (
        <Textarea
          value={newSettingValue}
          onChange={(e) => setNewSettingValue(e.target.value)}
          placeholder={getSettingExample(key)}
          rows={3}
        />
      );
    } else {
      return (
        <Input
          value={newSettingValue}
          onChange={(e) => setNewSettingValue(e.target.value)}
          placeholder={getSettingExample(key)}
        />
      );
    }
  };

  // Função para obter nome amigável da definição - APENAS DEFINIÇÕES ESSENCIAIS
  const getSettingFriendlyName = (key: string) => {
    const names = {
      'site_title': 'Título do Site',
      'site_description': 'Descrição do Site',
      'maintenance_mode': 'Modo de Manutenção',
      'registration_enabled': 'Permitir Novos Registos',
      'primary_color': 'Cor Primária',
      'secondary_color': 'Cor Secundária',
    };
    return names[key] || key;
  };

  // Função para obter input de edição
  const getSettingEditInput = (key: string, currentValue: string) => {
    const booleanKeys = ['maintenance_mode', 'registration_enabled', 'review_moderation', 'analytics_enabled'];
    const textareaKeys = ['site_description', 'welcome_message', 'featured_services'];
    const colorKeys = ['primary_color', 'secondary_color', 'accent_color', 'background_color', 'text_color', 'header_color', 'footer_color', 'button_color', 'link_color', 'border_color', 'success_color', 'warning_color', 'error_color', 'info_color', 'card_background', 'sidebar_color', 'menu_color', 'hover_color', 'active_color', 'disabled_color'];
    
    if (colorKeys.includes(key)) {
      return (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={settingsValues[key] || currentValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setSettingsValues(prev => ({ ...prev, [key]: newValue }));
              updateSettingMutation.mutate({ key, value: newValue });
              setEditingSettings(prev => ({ ...prev, [key]: false }));
            }}
            className="w-12 h-10 border rounded cursor-pointer"
          />
          <Input
            value={settingsValues[key] || currentValue}
            onChange={(e) => {
              setSettingsValues(prev => ({ ...prev, [key]: e.target.value }));
            }}
            onBlur={() => {
              if (settingsValues[key] !== currentValue) {
                updateSettingMutation.mutate({ key, value: settingsValues[key] });
              }
              setEditingSettings(prev => ({ ...prev, [key]: false }));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value !== currentValue) {
                updateSettingMutation.mutate({ key, value: e.target.value });
                setEditingSettings(prev => ({ ...prev, [key]: false }));
              }
            }}
            placeholder={getSettingExample(key)}
            className="flex-1"
          />
        </div>
      );
    } else if (booleanKeys.includes(key)) {
      return (
        <Select 
          value={settingsValues[key] || currentValue} 
          onValueChange={(value) => {
            setSettingsValues(prev => ({ ...prev, [key]: value }));
            updateSettingMutation.mutate({ key, value });
            setEditingSettings(prev => ({ ...prev, [key]: false }));
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Activado</SelectItem>
            <SelectItem value="false">Desactivado</SelectItem>
          </SelectContent>
        </Select>
      );
    } else if (textareaKeys.includes(key)) {
      return (
        <Textarea
          value={settingsValues[key] || currentValue}
          onChange={(e) => {
            setSettingsValues(prev => ({ ...prev, [key]: e.target.value }));
          }}
          onBlur={() => {
            if (settingsValues[key] !== currentValue) {
              updateSettingMutation.mutate({ key, value: settingsValues[key] });
            }
            setEditingSettings(prev => ({ ...prev, [key]: false }));
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              updateSettingMutation.mutate({ key, value: e.target.value });
              setEditingSettings(prev => ({ ...prev, [key]: false }));
            }
          }}
          placeholder={getSettingExample(key)}
          rows={3}
        />
      );
    } else {
      return (
        <Input
          value={settingsValues[key] || currentValue}
          onChange={(e) => {
            setSettingsValues(prev => ({ ...prev, [key]: e.target.value }));
          }}
          onBlur={() => {
            if (settingsValues[key] !== currentValue) {
              updateSettingMutation.mutate({ key, value: settingsValues[key] });
            }
            setEditingSettings(prev => ({ ...prev, [key]: false }));
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value !== currentValue) {
              updateSettingMutation.mutate({ key, value: e.target.value });
              setEditingSettings(prev => ({ ...prev, [key]: false }));
            }
          }}
          placeholder={getSettingExample(key)}
        />
      );
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-8 h-8 text-red-600" />
                Painel Administrativo
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Gestão completa da plataforma Jikulumessu
              </p>
            </div>
            <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {user?.role || 'Admin'}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Utilizadores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilizadores Activos</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.active || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilizadores Suspensos</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.suspended || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.admins || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos Hoje</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats?.newToday || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Utilizadores</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="settings">Definições</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Utilizadores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead>Papel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Avaliação</TableHead>
                        <TableHead>Registado</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.phone}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="w-3 h-3" />
                              {user.municipality}, {user.province}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role || 'user')}>
                              {user.role || 'user'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status || 'active')}>
                              {user.status || 'active'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              {user.average_rating?.toFixed(1) || '0.0'}
                              <span className="text-sm text-gray-500">({user.total_reviews || 0})</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(user.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select
                                value={user.role || 'user'}
                                onValueChange={(role) => updateUserRoleMutation.mutate({ userId: user.id, role })}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">Utilizador</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="super_admin">Super Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select
                                value={user.status || 'active'}
                                onValueChange={(status) => updateUserStatusMutation.mutate({ userId: user.id, status })}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Activo</SelectItem>
                                  <SelectItem value="suspended">Suspenso</SelectItem>
                                  <SelectItem value="inactive">Inactivo</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (window.confirm(`Tem certeza que deseja eliminar completamente o utilizador ${user.name}? Esta ação não pode ser desfeita.`)) {
                                    deleteUserMutation.mutate(user.id);
                                  }
                                }}
                                disabled={deleteUserMutation.isPending}
                                className="ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
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
                <CardTitle>Logs de Atividade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ação</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>Alvo</TableHead>
                        <TableHead>Detalhes</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>IP</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs?.map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getActionIcon(log.action)}
                              <span className="capitalize">{log.action.replace('_', ' ')}</span>
                            </div>
                          </TableCell>
                          <TableCell>{log.admin_id}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{log.target_type}</div>
                              <div className="text-gray-500">{log.target_id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {log.details}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(log.created_at)}
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {log.ip_address}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Definições do Site
                  <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Settings className="w-4 h-4 mr-2" />
                        Nova Definição
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Definição</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="setting-key">Escolha uma definição</Label>
                          <Select value={newSettingKey} onValueChange={setNewSettingKey}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma definição..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="site_title">Título do Site</SelectItem>
                              <SelectItem value="site_description">Descrição do Site</SelectItem>
                              <SelectItem value="maintenance_mode">Modo de Manutenção</SelectItem>
                              <SelectItem value="registration_enabled">Permitir Novos Registos</SelectItem>
                              <SelectItem value="review_moderation">Moderação de Avaliações</SelectItem>
                              <SelectItem value="welcome_message">Mensagem de Boas-vindas</SelectItem>
                              <SelectItem value="terms_version">Versão dos Termos</SelectItem>
                              <SelectItem value="privacy_version">Versão da Política de Privacidade</SelectItem>
                              <SelectItem value="featured_services">Serviços em Destaque</SelectItem>
                              <SelectItem value="analytics_enabled">Análise de Dados Activada</SelectItem>
                              <SelectItem value="notification_email">Email para Notificações</SelectItem>
                              <SelectItem value="primary_color">Cor Primária</SelectItem>
                              <SelectItem value="secondary_color">Cor Secundária</SelectItem>
                              <SelectItem value="accent_color">Cor de Destaque</SelectItem>
                              <SelectItem value="background_color">Cor de Fundo</SelectItem>
                              <SelectItem value="text_color">Cor do Texto</SelectItem>
                              <SelectItem value="header_color">Cor do Cabeçalho</SelectItem>
                              <SelectItem value="footer_color">Cor do Rodapé</SelectItem>
                              <SelectItem value="button_color">Cor dos Botões</SelectItem>
                              <SelectItem value="link_color">Cor dos Links</SelectItem>
                              <SelectItem value="border_color">Cor das Bordas</SelectItem>
                              <SelectItem value="success_color">Cor de Sucesso</SelectItem>
                              <SelectItem value="warning_color">Cor de Aviso</SelectItem>
                              <SelectItem value="error_color">Cor de Erro</SelectItem>
                              <SelectItem value="info_color">Cor de Informação</SelectItem>
                              <SelectItem value="card_background">Fundo dos Cartões</SelectItem>
                              <SelectItem value="sidebar_color">Cor da Barra Lateral</SelectItem>
                              <SelectItem value="menu_color">Cor do Menu</SelectItem>
                              <SelectItem value="hover_color">Cor de Hover</SelectItem>
                              <SelectItem value="active_color">Cor Ativa</SelectItem>
                              <SelectItem value="disabled_color">Cor Desativada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Descrição da definição selecionada */}
                        {newSettingKey && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium">
                              {getSettingDescription(newSettingKey)}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Exemplo: {getSettingExample(newSettingKey)}
                            </p>
                          </div>
                        )}
                        
                        <div>
                          <Label htmlFor="setting-value">Valor</Label>
                          {getSettingInput(newSettingKey)}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              if (newSettingKey && newSettingValue) {
                                updateSettingMutation.mutate({
                                  key: newSettingKey,
                                  value: newSettingValue
                                });
                              }
                            }}
                            disabled={!newSettingKey || !newSettingValue}
                          >
                            Guardar
                          </Button>
                          <Button variant="outline" onClick={() => {
                            setIsSettingsDialogOpen(false);
                            setNewSettingKey('');
                            setNewSettingValue('');
                          }}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {settings?.map((setting: any) => (
                    <div key={setting.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium text-base">{setting.description || setting.key}</div>
                          <div className="text-sm text-gray-500">{setting.key}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Atualizado: {formatDate(setting.updated_at)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {setting.type === 'color' ? (
                          <div className="flex items-center gap-3 w-full">
                            <input
                              type="color"
                              value={settingsValues[setting.key] || setting.value}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setSettingsValues(prev => ({
                                  ...prev,
                                  [setting.key]: newValue
                                }));
                                updateSettingMutation.mutate({
                                  key: setting.key,
                                  value: newValue
                                });
                              }}
                              className="w-12 h-10 border rounded cursor-pointer"
                            />
                            <Input
                              value={settingsValues[setting.key] || setting.value}
                              onChange={(e) => {
                                setSettingsValues(prev => ({
                                  ...prev,
                                  [setting.key]: e.target.value
                                }));
                              }}
                              onBlur={(e) => {
                                if (e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                                  updateSettingMutation.mutate({
                                    key: setting.key,
                                    value: e.target.value
                                  });
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                                  updateSettingMutation.mutate({
                                    key: setting.key,
                                    value: e.target.value
                                  });
                                }
                              }}
                              className="flex-1"
                              placeholder="#000000"
                            />
                          </div>
                        ) : setting.type === 'boolean' ? (
                          <div className="flex items-center gap-3 w-full">
                            <input
                              type="checkbox"
                              checked={(settingsValues[setting.key] || setting.value) === 'true'}
                              onChange={(e) => {
                                const newValue = e.target.checked ? 'true' : 'false';
                                setSettingsValues(prev => ({
                                  ...prev,
                                  [setting.key]: newValue
                                }));
                                updateSettingMutation.mutate({
                                  key: setting.key,
                                  value: newValue
                                });
                              }}
                              className="w-5 h-5"
                            />
                            <span className="text-sm">
                              {(settingsValues[setting.key] || setting.value) === 'true' ? 'Activado' : 'Desactivado'}
                            </span>
                          </div>
                        ) : setting.type === 'number' ? (
                          <Input
                            type="number"
                            value={settingsValues[setting.key] || setting.value}
                            onChange={(e) => {
                              setSettingsValues(prev => ({
                                ...prev,
                                [setting.key]: e.target.value
                              }));
                            }}
                            onBlur={(e) => {
                              if (e.target.value !== setting.value) {
                                updateSettingMutation.mutate({
                                  key: setting.key,
                                  value: e.target.value
                                });
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.target.value !== setting.value) {
                                updateSettingMutation.mutate({
                                  key: setting.key,
                                  value: e.target.value
                                });
                              }
                            }}
                            className="w-full"
                          />
                        ) : setting.type === 'email' ? (
                          <Input
                            type="email"
                            value={settingsValues[setting.key] || setting.value}
                            onChange={(e) => {
                              setSettingsValues(prev => ({
                                ...prev,
                                [setting.key]: e.target.value
                              }));
                            }}
                            onBlur={(e) => {
                              if (e.target.value !== setting.value) {
                                updateSettingMutation.mutate({
                                  key: setting.key,
                                  value: e.target.value
                                });
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.target.value !== setting.value) {
                                updateSettingMutation.mutate({
                                  key: setting.key,
                                  value: e.target.value
                                });
                              }
                            }}
                            className="w-full"
                          />
                        ) : (
                          <Input
                            value={settingsValues[setting.key] || setting.value}
                            onChange={(e) => {
                              setSettingsValues(prev => ({
                                ...prev,
                                [setting.key]: e.target.value
                              }));
                            }}
                            onBlur={(e) => {
                              if (e.target.value !== setting.value) {
                                updateSettingMutation.mutate({
                                  key: setting.key,
                                  value: e.target.value
                                });
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.target.value !== setting.value) {
                                updateSettingMutation.mutate({
                                  key: setting.key,
                                  value: e.target.value
                                });
                              }
                            }}
                            className="w-full"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics e Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Analytics em Desenvolvimento
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Esta secção estará disponível em breve com relatórios detalhados sobre:
                  </p>
                  <ul className="mt-4 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• Visitantes e visualizações de página</li>
                    <li>• Novos registos e atividade de utilizadores</li>
                    <li>• Pesquisas e contactos realizados</li>
                    <li>• Avaliações e feedback dos utilizadores</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}