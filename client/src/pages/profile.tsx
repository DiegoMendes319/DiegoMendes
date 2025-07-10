import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import LocationSelector from "@/components/location-selector";
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Upload, 
  Camera, 
  Facebook, 
  Instagram, 
  Music, 
  Trash2,
  Home,
  Settings,
  LogOut
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { User as UserType, UpdateUserData } from "@/types/user";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdateUserData>>({});
  const [socialMedia, setSocialMedia] = useState({
    facebook_url: '',
    instagram_url: '',
    tiktok_url: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock user ID for demonstration - in real app, this would come from auth context
  const userId = "mock-user-id";

  const { data: user, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateUserData) => {
      const response = await apiRequest('PUT', `/api/users/${userId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Perfil atualizado com sucesso!",
        description: "Suas informações foram salvas.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      // Mock file upload - in real app, this would upload to Supabase Storage
      const formData = new FormData();
      formData.append('file', file);
      
      // For now, just return a mock URL
      return { url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.first_name}` };
    },
    onSuccess: (data) => {
      updateProfileMutation.mutate({
        profile_url: data.url
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao fazer upload da foto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', `/api/users/${userId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Conta excluída com sucesso",
        description: "Todos os seus dados foram removidos.",
      });
      // Redirect to home
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir conta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        date_of_birth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '',
        province: user.province,
        municipality: user.municipality,
        neighborhood: user.neighborhood,
        address_complement: user.address_complement,
        contract_type: user.contract_type,
        services: user.services,
        availability: user.availability,
        about_me: user.about_me
      });
      setSocialMedia({
        facebook_url: user.facebook_url || '',
        instagram_url: user.instagram_url || '',
        tiktok_url: user.tiktok_url || ''
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate({
      ...formData,
      ...socialMedia
    });
  };

  const handleLocationChange = (location: { province?: string; municipality?: string; neighborhood?: string }) => {
    setFormData(prev => ({ ...prev, ...location }));
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked
        ? [...(prev.services || []), service]
        : (prev.services || []).filter(s => s !== service)
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadPhotoMutation.mutate(file);
    }
  };

  const handleLogout = () => {
    // Clear auth state and redirect
    setLocation("/");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--angola-red)] mx-auto mb-4"></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-[var(--angola-red)]">Perfil não encontrado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">Você precisa estar logado para acessar esta página.</p>
            <Button onClick={() => setLocation("/auth")} className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="text-[var(--angola-red)] hover:bg-[var(--angola-red)]/10"
            >
              <Home className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-[var(--angola-red)]"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-[var(--angola-red)]">
                    Meu Perfil
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(false)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={updateProfileMutation.isPending}
                          className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={handleEdit}
                        className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-24 w-24 ring-4 ring-[var(--angola-yellow)]">
                    <AvatarImage src={user.profile_url || undefined} alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="mt-2">
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white hover:bg-gray-50"
                          disabled={uploadPhotoMutation.isPending}
                          asChild
                        >
                          <div>
                            <Camera className="h-4 w-4 mr-2" />
                            {uploadPhotoMutation.isPending ? 'Enviando...' : 'Alterar Foto'}
                          </div>
                        </Button>
                      </label>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">Primeiro Nome</Label>
                        <Input
                          id="first_name"
                          value={formData.first_name || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Último Nome</Label>
                        <Input
                          id="last_name"
                          value={formData.last_name || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="date_of_birth">Data de Nascimento</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      />
                    </div>

                    <LocationSelector 
                      onLocationChange={handleLocationChange}
                      defaultValues={{
                        province: formData.province,
                        municipality: formData.municipality,
                        neighborhood: formData.neighborhood
                      }}
                    />

                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={formData.neighborhood || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                        placeholder="Digite o nome do seu bairro"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address_complement">Complemento de Endereço</Label>
                      <Input
                        id="address_complement"
                        value={formData.address_complement || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, address_complement: e.target.value }))}
                        placeholder="Ex: Prédio A, Apartamento 3B, Casa 15"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contract_type">Tipo de Contrato</Label>
                      <Select 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, contract_type: value }))}
                        value={formData.contract_type || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de contrato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diarista">Diarista</SelectItem>
                          <SelectItem value="mensal">Mensal</SelectItem>
                          <SelectItem value="verbal">Acordo Verbal</SelectItem>
                          <SelectItem value="escrito">Contrato Escrito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Serviços Oferecidos</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {['limpeza', 'cozinha', 'lavanderia', 'jardinagem', 'cuidados'].map((service) => (
                          <div key={service} className="flex items-center space-x-2">
                            <Checkbox
                              id={service}
                              checked={formData.services?.includes(service)}
                              onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                            />
                            <Label htmlFor={service} className="text-sm capitalize">
                              {service === 'cuidados' ? 'Cuidados Pessoais' : service}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="availability">Disponibilidade</Label>
                      <Textarea
                        id="availability"
                        value={formData.availability || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                        placeholder="Ex: Segunda a Sexta, 8h às 17h"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="about_me">Sobre Mim</Label>
                      <Textarea
                        id="about_me"
                        value={formData.about_me || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, about_me: e.target.value }))}
                        placeholder="Conte um pouco sobre sua experiência e especialidades..."
                        rows={4}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                        <p className="text-gray-900">{user.phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Idade</Label>
                        <p className="text-gray-900">{user.age} anos</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Localização</Label>
                      <p className="text-gray-900">
                        {user.province}, {user.municipality}, {user.neighborhood}
                        {user.address_complement && <span className="text-gray-600"> - {user.address_complement}</span>}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Tipo de Contrato</Label>
                      <p className="text-gray-900 capitalize">{user.contract_type}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Serviços Oferecidos</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.services.map((service) => (
                          <span key={service} className="service-tag px-3 py-1 text-sm font-medium rounded-full">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Disponibilidade</Label>
                      <p className="text-gray-900">{user.availability}</p>
                    </div>

                    {user.about_me && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Sobre Mim</Label>
                        <p className="text-gray-900 leading-relaxed">{user.about_me}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[var(--angola-red)]">
                  Minhas Redes Sociais
                </CardTitle>
                <p className="text-gray-600">
                  Adicione suas redes sociais para que os clientes possam conhecer melhor seu trabalho
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="facebook_url" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook_url"
                    type="url"
                    value={socialMedia.facebook_url}
                    onChange={(e) => setSocialMedia(prev => ({ ...prev, facebook_url: e.target.value }))}
                    placeholder="https://facebook.com/seu.perfil"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram_url" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram_url"
                    type="url"
                    value={socialMedia.instagram_url}
                    onChange={(e) => setSocialMedia(prev => ({ ...prev, instagram_url: e.target.value }))}
                    placeholder="https://instagram.com/seu.perfil"
                  />
                </div>

                <div>
                  <Label htmlFor="tiktok_url" className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-black" />
                    TikTok
                  </Label>
                  <Input
                    id="tiktok_url"
                    type="url"
                    value={socialMedia.tiktok_url}
                    onChange={(e) => setSocialMedia(prev => ({ ...prev, tiktok_url: e.target.value }))}
                    placeholder="https://tiktok.com/@seu.perfil"
                  />
                </div>

                <Button 
                  onClick={() => updateProfileMutation.mutate(socialMedia)}
                  disabled={updateProfileMutation.isPending}
                  className="w-full bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Redes Sociais
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[var(--angola-red)]">
                  Configurações da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-700 mb-2">Zona de Perigo</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir Conta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                          e removerá todos os seus dados de nossos servidores.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteAccountMutation.mutate()}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sim, excluir conta
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}