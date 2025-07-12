import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
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
  Lock
} from "lucide-react";

import { SERVICE_OPTIONS, CONTRACT_TYPES } from "@shared/constants";

const serviceOptions = SERVICE_OPTIONS;

const contractTypes = CONTRACT_TYPES;

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
    profile_url: ''
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
        profile_url: profile.profile_url || ''
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
      toast({
        title: "Perfil actualizado!",
        description: "As suas informações foram guardadas com sucesso.",
      });
      setEditMode(false);
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id] });
      refreshUser();
    },
    onError: (error) => {
      toast({
        title: "Erro ao actualizar",
        description: error.message,
        variant: "destructive",
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
      toast({
        title: "Conta eliminada",
        description: "A sua conta foi eliminada com sucesso.",
      });
      logout();
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Erro ao eliminar conta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
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

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
    setDeleteDialogOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 50MB - muito mais generoso)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Ficheiro muito grande",
        description: "A imagem deve ter no máximo 50MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de ficheiro inválido",
        description: "Por favor seleccione uma imagem válida",
        variant: "destructive",
      });
      return;
    }

    // Compress and convert image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 800x800 to reduce size)
      const maxSize = 800;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with compression (0.8 quality)
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
      
      // Update form data with the compressed image
      setFormData(prev => ({
        ...prev,
        profile_url: compressedBase64
      }));

      toast({
        title: "Imagem carregada",
        description: "A imagem foi optimizada e adicionada ao perfil. Clique em 'Guardar' para actualizar.",
      });
    };
    
    img.onerror = () => {
      toast({
        title: "Erro ao carregar imagem",
        description: "Não foi possível processar a imagem. Tente outra.",
        variant: "destructive",
      });
    };
    
    // Start loading the image
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-[var(--angola-red)] hover:bg-[var(--angola-red)]/10 self-start sm:self-auto"
          >
            <Home className="h-4 w-4 mr-2" />
            Página Inicial
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setEditMode(!editMode)}
              className="text-[var(--angola-red)] border-[var(--angola-red)] text-sm sm:text-base px-3 sm:px-4"
            >
              <Edit className="h-4 w-4 mr-2" />
              {editMode ? 'Cancelar' : 'Editar Perfil'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/change-password')}
              className="text-blue-600 border-blue-200 hover:bg-blue-50 text-sm sm:text-base px-3 sm:px-4"
            >
              <Lock className="h-4 w-4 mr-2" />
              Alterar Palavra-passe
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="text-red-600 border-red-200 hover:bg-red-50 text-sm sm:text-base px-3 sm:px-4"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="mb-4 sm:mb-6 shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-shrink-0 self-center sm:self-auto">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  {(formData.profile_url || profile?.profile_url) ? (
                    <img 
                      src={formData.profile_url || profile?.profile_url} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="text-xl sm:text-2xl bg-[var(--angola-red)] text-white">
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
                      className="absolute -bottom-2 -right-2 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
                      onClick={() => document.getElementById('profile-image-upload')?.click()}
                    >
                      <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                {editMode ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Primeiro nome"
                      className="text-sm sm:text-base"
                    />
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Último nome"
                      className="text-sm sm:text-base"
                    />
                  </div>
                ) : (
                  <CardTitle className="text-xl sm:text-2xl text-[var(--angola-red)]">
                    {profile ? `${profile.first_name} ${profile.last_name}` : user.email}
                  </CardTitle>
                )}
                <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center sm:justify-start mt-1 text-sm sm:text-base">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
                {profile?.rating && (
                  <div className="flex items-center justify-center sm:justify-start mt-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-semibold text-sm sm:text-base">{profile.rating.toFixed(1)}</span>
                    <span className="text-gray-500 ml-1 text-sm">({profile.review_count} avaliações)</span>
                  </div>
                )}
              </div>
              {editMode && (
                <Button 
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto mt-2 sm:mt-0"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="details" className="text-xs sm:text-sm py-2 sm:py-3">Detalhes</TabsTrigger>
            <TabsTrigger value="services" className="text-xs sm:text-sm py-2 sm:py-3">Serviços</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm py-2 sm:py-3">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-3 sm:space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  {editMode ? (
                    <>
                      <div>
                        <Label className="text-sm sm:text-base">
                          Telefone <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">+244</span>
                          </div>
                          <Input
                            value={formData.phone}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, '');
                              const limitedDigits = digits.slice(0, 9);
                              const formatted = limitedDigits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
                              setFormData(prev => ({ ...prev, phone: formatted }));
                            }}
                            placeholder="9XX XXX XXX"
                            className="pl-12 sm:pl-14 text-sm sm:text-base"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm sm:text-base">
                          Data de Nascimento <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                          className="text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-sm sm:text-base">
                          Localização <span className="text-red-500">*</span>
                        </Label>
                        <LocationSelector
                          onLocationChange={handleLocationChange}
                          defaultValues={{
                            province: formData.province,
                            municipality: formData.municipality,
                            neighborhood: formData.neighborhood
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-sm sm:text-base">
                          Complemento de Endereço <span className="text-gray-500">(opcional)</span>
                        </Label>
                        <Input
                          value={formData.address_complement}
                          onChange={(e) => setFormData(prev => ({ ...prev, address_complement: e.target.value }))}
                          placeholder="Apartamento, Bloco, etc."
                          className="text-sm sm:text-base"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {profile?.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">+244 {profile.phone}</span>
                        </div>
                      )}
                      {profile?.date_of_birth && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">{new Date(profile.date_of_birth).toLocaleDateString('pt-PT')}</span>
                        </div>
                      )}
                      {(profile?.province || profile?.municipality || profile?.neighborhood) && (
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">{[profile?.neighborhood, profile?.municipality, profile?.province].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                      {profile?.address_complement && (
                        <div className="flex items-start">
                          <Home className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm sm:text-base">{profile.address_complement}</span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Informações Profissionais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  {editMode ? (
                    <>
                      <div>
                        <Label className="text-sm sm:text-base">
                          Tipo de Contrato <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.contract_type} onValueChange={(value) => setFormData(prev => ({ ...prev, contract_type: value }))}>
                          <SelectTrigger className="text-sm sm:text-base">
                            <SelectValue placeholder="Seleccione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {contractTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm sm:text-base">
                          Disponibilidade <span className="text-gray-500">(opcional)</span>
                        </Label>
                        <Textarea
                          value={formData.availability}
                          onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                          placeholder="Ex: Segunda a Sexta, 8h-17h"
                          className="text-sm sm:text-base min-h-[60px] sm:min-h-[80px]"
                        />
                      </div>
                      <div>
                        <Label className="text-sm sm:text-base">
                          Sobre Mim <span className="text-gray-500">(opcional)</span>
                        </Label>
                        <Textarea
                          value={formData.about_me}
                          onChange={(e) => setFormData(prev => ({ ...prev, about_me: e.target.value }))}
                          placeholder="Conte-nos um pouco sobre você..."
                          className="text-sm sm:text-base min-h-[60px] sm:min-h-[80px]"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {profile?.contract_type && (
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-500">Tipo de Contrato</label>
                          <p className="capitalize text-sm sm:text-base">{profile.contract_type}</p>
                        </div>
                      )}
                      {profile?.availability && (
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-500">Disponibilidade</label>
                          <p className="text-sm sm:text-base">{profile.availability}</p>
                        </div>
                      )}
                      {profile?.about_me && (
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-500">Sobre Mim</label>
                          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{profile.about_me}</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-4">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Serviços Oferecidos <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {editMode ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {serviceOptions.map(service => (
                      <div key={service.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={service.value}
                          checked={formData.services.includes(service.value)}
                          onCheckedChange={() => handleServiceToggle(service.value)}
                        />
                        <Label htmlFor={service.value} className="text-xs sm:text-sm">
                          {service.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {profile?.services?.length > 0 ? (
                      profile.services.map((service: string, index: number) => {
                        const serviceLabel = serviceOptions.find(opt => opt.value === service)?.label || service;
                        return (
                          <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                            {serviceLabel}
                          </Badge>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">Nenhum serviço especificado</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>



          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-red-600 text-base sm:text-lg">Zona Perigosa</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="font-medium text-red-600 mb-2 text-sm sm:text-base">Eliminar Conta</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">
                      Esta acção é irreversível. Todos os seus dados serão permanentemente eliminados.
                    </p>
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar Conta
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="mx-4 sm:mx-0">
                        <DialogHeader>
                          <DialogTitle className="text-base sm:text-lg">Tem a certeza?</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-xs sm:text-sm">Esta acção não pode ser desfeita. Isto irá eliminar permanentemente a sua conta e todos os dados associados.</p>
                          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="w-full sm:w-auto">
                              Cancelar
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={handleDeleteAccount}
                              disabled={deleteAccountMutation.isPending}
                              className="w-full sm:w-auto"
                            >
                              {deleteAccountMutation.isPending ? 'A eliminar...' : 'Sim, eliminar'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}