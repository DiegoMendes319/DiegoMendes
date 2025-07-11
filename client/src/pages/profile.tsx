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
  Facebook,
  Instagram
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
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
      const response = await apiRequest('GET', `/api/users/${user.id}`);
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
        facebook_url: profile.facebook_url || '',
        instagram_url: profile.instagram_url || '',
        whatsapp_url: profile.whatsapp_url || ''
      });
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PUT', `/api/users/${user?.id}`, data);
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
      const response = await apiRequest('DELETE', `/api/users/${user?.id}`);
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
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-[var(--angola-red)] hover:bg-[var(--angola-red)]/10"
          >
            <Home className="h-4 w-4 mr-2" />
            Página Inicial
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setEditMode(!editMode)}
              className="text-[var(--angola-red)] border-[var(--angola-red)]"
            >
              <Edit className="h-4 w-4 mr-2" />
              {editMode ? 'Cancelar' : 'Editar Perfil'}
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
        </div>

        {/* Profile Header */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  {(formData.profile_url || profile?.profile_url) ? (
                    <img 
                      src={formData.profile_url || profile?.profile_url} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="text-2xl bg-[var(--angola-red)] text-white">
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
              <div className="flex-1">
                {editMode ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Primeiro nome"
                    />
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Último nome"
                    />
                  </div>
                ) : (
                  <CardTitle className="text-2xl text-[var(--angola-red)]">
                    {profile ? `${profile.first_name} ${profile.last_name}` : user.email}
                  </CardTitle>
                )}
                <p className="text-gray-600 dark:text-gray-300 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </p>
                {profile?.rating && (
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-semibold">{profile.rating.toFixed(1)}</span>
                    <span className="text-gray-500 ml-1">({profile.review_count} avaliações)</span>
                  </div>
                )}
              </div>
              {editMode && (
                <Button 
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editMode ? (
                    <>
                      <div>
                        <Label>Telefone</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400">+244</span>
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
                            className="pl-14"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Data de Nascimento</Label>
                        <Input
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Localização</Label>
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
                        <Label>Complemento de Endereço</Label>
                        <Input
                          value={formData.address_complement}
                          onChange={(e) => setFormData(prev => ({ ...prev, address_complement: e.target.value }))}
                          placeholder="Apartamento, Bloco, etc."
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {profile?.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span>+244 {profile.phone}</span>
                        </div>
                      )}
                      {profile?.date_of_birth && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{new Date(profile.date_of_birth).toLocaleDateString('pt-PT')}</span>
                        </div>
                      )}
                      {(profile?.province || profile?.municipality || profile?.neighborhood) && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{[profile?.neighborhood, profile?.municipality, profile?.province].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Informações Profissionais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editMode ? (
                    <>
                      <div>
                        <Label>Tipo de Contrato</Label>
                        <Select value={formData.contract_type} onValueChange={(value) => setFormData(prev => ({ ...prev, contract_type: value }))}>
                          <SelectTrigger>
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
                        <Label>Disponibilidade</Label>
                        <Textarea
                          value={formData.availability}
                          onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                          placeholder="Ex: Segunda a Sexta, 8h-17h"
                        />
                      </div>
                      <div>
                        <Label>Sobre Mim</Label>
                        <Textarea
                          value={formData.about_me}
                          onChange={(e) => setFormData(prev => ({ ...prev, about_me: e.target.value }))}
                          placeholder="Conte-nos um pouco sobre você..."
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {profile?.contract_type && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tipo de Contrato</label>
                          <p className="capitalize">{profile.contract_type}</p>
                        </div>
                      )}
                      {profile?.availability && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Disponibilidade</label>
                          <p>{profile.availability}</p>
                        </div>
                      )}
                      {profile?.about_me && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Sobre Mim</label>
                          <p className="text-gray-700 dark:text-gray-300">{profile.about_me}</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Serviços Oferecidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {serviceOptions.map(service => (
                      <div key={service.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={service.value}
                          checked={formData.services.includes(service.value)}
                          onCheckedChange={() => handleServiceToggle(service.value)}
                        />
                        <Label htmlFor={service.value} className="text-sm">
                          {service.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile?.services?.length > 0 ? (
                      profile.services.map((service: string, index: number) => {
                        const serviceLabel = serviceOptions.find(opt => opt.value === service)?.label || service;
                        return (
                          <Badge key={index} variant="secondary">
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

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Redes Sociais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <>
                    <div>
                      <Label className="flex items-center">
                        <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                        Facebook
                      </Label>
                      <Input
                        value={formData.facebook_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                        placeholder="https://facebook.com/seu-perfil"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center">
                        <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                        Instagram
                      </Label>
                      <Input
                        value={formData.instagram_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                        placeholder="https://instagram.com/seu-perfil"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center">
                        <FaWhatsapp className="h-4 w-4 mr-2 text-green-600" />
                        WhatsApp
                      </Label>
                      <Input
                        value={formData.whatsapp_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_url: e.target.value }))}
                        placeholder="https://wa.me/244900000000"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    {profile?.facebook_url && (
                      <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </a>
                    )}
                    {profile?.instagram_url && (
                      <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-pink-600 hover:underline">
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </a>
                    )}
                    {profile?.whatsapp_url && (
                      <a href={profile.whatsapp_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-green-600 hover:underline">
                        <FaWhatsapp className="h-4 w-4 mr-2" />
                        WhatsApp
                      </a>
                    )}
                    {!profile?.facebook_url && !profile?.instagram_url && !profile?.whatsapp_url && (
                      <p className="text-gray-500">Nenhuma rede social adicionada</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Zona Perigosa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-red-600 mb-2">Eliminar Conta</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Esta acção é irreversível. Todos os seus dados serão permanentemente eliminados.
                    </p>
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar Conta
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Tem a certeza?</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>Esta acção não pode ser desfeita. Isto irá eliminar permanentemente a sua conta e todos os dados associados.</p>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={handleDeleteAccount}
                              disabled={deleteAccountMutation.isPending}
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