import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast, toastAngola } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LocationSelector from "@/components/location-selector";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Star, 
  Edit, 
  LogOut,
  Home,
  Briefcase,
  Clock,
  DollarSign,
  Save,
  Trash2,
  Camera,
  Lock,
  MessageCircle
} from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

import { serviceOptions } from "@/lib/service-options";

const contractTypes = [
  { id: "full-time", name: "Tempo integral" },
  { id: "part-time", name: "Tempo parcial" },
  { id: "freelance", name: "Freelancer" },
  { id: "contract", name: "Contrato" },
  { id: "temporary", name: "Temporário" }
];

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, loading, logout, refreshUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for editing
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    province: '',
    municipality: '',
    neighborhood: '',
    address_complement: '',
    contract_type: '',
    services: [] as string[],
    availability: '',
    about_me: '',
    profile_url: '',
    facebook_url: '',
    instagram_url: '',
    whatsapp_url: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/auth");
      return;
    }
  }, [user, loading, setLocation]);

  // Fetch user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/users', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await apiRequest(`/api/users/${user.id}`, 'GET');
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth ? profile.date_of_birth.split('T')[0] : '',
        province: profile.province || '',
        municipality: profile.municipality || '',
        neighborhood: profile.neighborhood || '',
        address_complement: profile.address_complement || '',
        contract_type: profile.contract_type || '',
        services: profile.services || [],
        availability: profile.availability || '',
        about_me: profile.about_me || '',
        profile_url: profile.profile_url || '',
        facebook_url: profile.facebook_url || '',
        instagram_url: profile.instagram_url || '',
        whatsapp_url: profile.whatsapp_url || ''
      });
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest(`/api/users/${user?.id}`, 'PUT', data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao actualizar perfil');
      }
      return response.json();
    },
    onSuccess: () => {
      toastAngola.success({
        title: "Perfil actualizado!",
        description: "As suas informações foram guardadas com sucesso.",
      });
      setEditMode(false);
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id] });
      refreshUser();
    },
    onError: (error) => {
      toastAngola.error({
        title: "Erro ao actualizar",
        description: error.message,
      });
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(`/api/users/${user?.id}`, 'DELETE');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao eliminar conta');
      }
      return response.json();
    },
    onSuccess: () => {
      toastAngola.neutral({
        title: "Conta eliminada",
        description: "A sua conta foi eliminada com sucesso.",
      });
      logout();
      setLocation("/");
    },
    onError: (error) => {
      toastAngola.error({
        title: "Erro ao eliminar conta",
        description: error.message,
      });
    },
  });

  const handleSignOut = async () => {
    try {
      await logout();
      toastAngola.neutral({
        title: "Logout realizado",
        description: "Até à próxima!",
      });
      setLocation("/");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleSaveChanges = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
    setDeleteDialogOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toastAngola.error({
        title: "Tipo de ficheiro inválido",
        description: "Por favor seleccione uma imagem válida",
      });
      return;
    }

    // Process image - accept any size and optimize
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas size to create perfect square with good resolution
      const size = 400; // Fixed size for profile pictures
      canvas.width = size;
      canvas.height = size;
      
      // Calculate crop dimensions for center crop
      const { width, height } = img;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = width;
      let sourceHeight = height;
      
      // Center crop to make it square
      if (width > height) {
        sourceWidth = height;
        sourceX = (width - height) / 2;
      } else if (height > width) {
        sourceHeight = width;
        sourceY = (height - width) / 2;
      }
      
      // Draw cropped and resized image
      ctx?.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, size, size);
      
      // Convert to base64 with good quality
      const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        profile_url: optimizedBase64
      }));

      toastAngola.success({
        title: "Imagem carregada",
        description: "A imagem foi optimizada e adicionada ao perfil. Clique em 'Guardar' para actualizar.",
      });
    };
    
    img.onerror = () => {
      toastAngola.error({
        title: "Erro ao carregar imagem",
        description: "Não foi possível processar a imagem. Tente outra.",
      });
    };
    
    img.src = URL.createObjectURL(file);
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleLocationChange = (location: { province?: string; municipality?: string; neighborhood?: string }) => {
    setFormData(prev => ({ ...prev, ...location }));
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--angola-red)] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">A carregar perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userInitials = profile 
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`
    : user.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-[var(--angola-red)] hover:bg-[var(--angola-red)]/10"
          >
            <Home className="h-4 w-4 mr-2" />
            Página Inicial
          </Button>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative flex-shrink-0 self-center sm:self-auto">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                  {(formData.profile_url || profile?.profile_url) ? (
                    <img 
                      src={formData.profile_url || profile?.profile_url} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="text-2xl sm:text-3xl bg-[var(--angola-red)] text-white">
                      {userInitials}
                    </AvatarFallback>
                  )}
                </Avatar>
                {editMode && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="profile-image-upload"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
                      onClick={() => document.getElementById('profile-image-upload')?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {profile?.first_name} {profile?.last_name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {profile?.email}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Badge variant="outline" className="bg-[var(--angola-red)]/10 text-[var(--angola-red)] border-[var(--angola-red)]/20">
                    {profile?.province}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {profile?.municipality}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setEditMode(!editMode)}
                  className="text-[var(--angola-red)] border-[var(--angola-red)] hover:bg-[var(--angola-red)]/10"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editMode ? 'Cancelar' : 'Editar Perfil'}
                </Button>
                
                {/* Save Changes Button - appears only in edit mode */}
                {editMode && (
                  <Button
                    onClick={handleSaveChanges}
                    disabled={updateProfileMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ? 'A guardar...' : 'Guardar Alterações'}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setLocation('/change-password')}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Alterar Palavra-passe
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          </TabsList>

          {/* Information Tab */}
          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">Nome</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        disabled={!editMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Apelido</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Data de Nascimento</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="about_me">Sobre mim</Label>
                    <Textarea
                      id="about_me"
                      value={formData.about_me}
                      onChange={(e) => setFormData(prev => ({ ...prev, about_me: e.target.value }))}
                      disabled={!editMode}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editMode ? (
                    <LocationSelector
                      defaultValues={{
                        province: formData.province,
                        municipality: formData.municipality,
                        neighborhood: formData.neighborhood
                      }}
                      onLocationChange={handleLocationChange}
                    />
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label>Província</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {profile?.province || 'Não especificado'}
                        </div>
                      </div>
                      <div>
                        <Label>Município</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {profile?.municipality || 'Não especificado'}
                        </div>
                      </div>
                      <div>
                        <Label>Bairro</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {profile?.neighborhood || 'Não especificado'}
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="address_complement">Complemento de Endereço</Label>
                    <Input
                      id="address_complement"
                      value={formData.address_complement}
                      onChange={(e) => setFormData(prev => ({ ...prev, address_complement: e.target.value }))}
                      disabled={!editMode}
                      placeholder="Ex: Rua X, Casa 123, Prédio Y"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Serviços Oferecidos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contract_type">Tipo de Contrato</Label>
                  <Select
                    value={formData.contract_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, contract_type: value }))}
                    disabled={!editMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Serviços</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {serviceOptions.map(service => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={formData.services.includes(service)}
                          onCheckedChange={() => handleServiceToggle(service)}
                          disabled={!editMode}
                        />
                        <Label htmlFor={service} className="text-sm">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="availability">Disponibilidade</Label>
                  <Textarea
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                    disabled={!editMode}
                    rows={3}
                    placeholder="Ex: Segunda a sexta, 8h às 17h"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Redes Sociais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="facebook_url" className="flex items-center gap-2">
                    <FaFacebook className="h-5 w-5 text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook_url"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                    disabled={!editMode}
                    placeholder="https://facebook.com/seuPerfil"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram_url" className="flex items-center gap-2">
                    <FaInstagram className="h-5 w-5 text-pink-600" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram_url"
                    value={formData.instagram_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                    disabled={!editMode}
                    placeholder="https://instagram.com/seuPerfil"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp_url" className="flex items-center gap-2">
                    <FaWhatsapp className="h-5 w-5 text-green-600" />
                    WhatsApp
                  </Label>
                  <Input
                    id="whatsapp_url"
                    value={formData.whatsapp_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_url: e.target.value }))}
                    disabled={!editMode}
                    placeholder="https://wa.me/244999999999"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        {editMode && (
          <Card className="mt-6">
            <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfileMutation.isPending ? 'A guardar...' : 'Guardar Alterações'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditMode(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="mt-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Zona Perigosa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Eliminar a conta é uma acção irreversível. Todos os seus dados serão permanentemente removidos.
            </p>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Conta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Eliminação</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Tem a certeza de que pretende eliminar permanentemente a sua conta? Esta acção não pode ser desfeita.
                  </p>
                  <div className="flex gap-4 justify-end">
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deleteAccountMutation.isPending}
                    >
                      {deleteAccountMutation.isPending ? 'A eliminar...' : 'Eliminar Conta'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}