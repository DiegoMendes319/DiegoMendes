import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Edit, 
  LogOut,
  Home,
  Briefcase,
  Save,
  Trash2,
  Camera,
  X,
  Facebook,
  Instagram,
  ExternalLink,
  Upload,
  Check
} from "lucide-react";

const serviceOptions = [
  { value: 'Limpeza doméstica', label: 'Limpeza doméstica' },
  { value: 'Cozinha', label: 'Cozinha' },
  { value: 'Cuidados com crianças', label: 'Cuidados com crianças' },
  { value: 'Cuidados com idosos', label: 'Cuidados com idosos' },
  { value: 'Jardinagem', label: 'Jardinagem' },
  { value: 'Motorista', label: 'Motorista' },
  { value: 'Segurança', label: 'Segurança' },
  { value: 'Manutenção', label: 'Manutenção' },
  { value: 'Electricista', label: 'Electricista' },
  { value: 'Canalizador', label: 'Canalizador' },
  { value: 'Pintor', label: 'Pintor' },
  { value: 'Carpinteiro', label: 'Carpinteiro' },
  { value: 'Decorador', label: 'Decorador' },
  { value: 'Cabeleireiro', label: 'Cabeleireiro' },
  { value: 'Manicure', label: 'Manicure' },
  { value: 'Massagista', label: 'Massagista' },
  { value: 'Professor particular', label: 'Professor particular' },
  { value: 'Tradutor', label: 'Tradutor' },
  { value: 'Organizador de eventos', label: 'Organizador de eventos' },
  { value: 'Fotógrafo', label: 'Fotógrafo' },
  { value: 'Técnico de informática', label: 'Técnico de informática' },
  { value: 'Reparação de electrodomésticos', label: 'Reparação de electrodomésticos' },
  { value: 'Lavandaria', label: 'Lavandaria' },
  { value: 'Passadoria', label: 'Passadoria' },
  { value: 'Outros', label: 'Outros' },
];

const contractTypes = [
  { value: 'diarista', label: 'Diarista' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'verbal', label: 'Verbal' },
  { value: 'escrito', label: 'Escrito' },
];

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, loading, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for editing - initialized from user data
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

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/profile'],
    enabled: !!user,
  });

  // Auto-load data from registration/user profile
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
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

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/profile', 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: "Perfil actualizado!",
        description: "As suas informações foram guardadas com sucesso.",
      });
      setEditMode(false);
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao actualizar perfil",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/profile', 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: "Conta eliminada",
        description: "A sua conta foi eliminada com sucesso.",
      });
      logout();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao eliminar conta",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    // Validate required fields
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome e sobrenome.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o número de telefone.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.date_of_birth) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha a data de nascimento.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.province || !formData.municipality) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, seleccione a província e município.",
        variant: "destructive",
      });
      return;
    }

    if (formData.services.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, seleccione pelo menos um serviço.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.contract_type) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, seleccione o tipo de contrato.",
        variant: "destructive",
      });
      return;
    }

    const fullName = `${formData.first_name} ${formData.last_name}`.trim();
    const age = formData.date_of_birth 
      ? new Date().getFullYear() - new Date(formData.date_of_birth).getFullYear()
      : 0;

    const updateData = {
      ...formData,
      name: fullName,
      age: age,
    };

    updateProfileMutation.mutate(updateData);
  };

  const handleCancel = () => {
    setEditMode(false);
    // Reset form data to original values
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
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
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleLocationChange = (province: string, municipality: string, neighborhood: string) => {
    setFormData(prev => ({
      ...prev,
      province,
      municipality,
      neighborhood
    }));
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
    setDeleteDialogOpen(false);
  };

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Ficheiro muito grande",
          description: "Por favor, seleccione uma imagem até 5MB.",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Tipo de ficheiro inválido",
          description: "Por favor, seleccione uma imagem válida.",
          variant: "destructive",
        });
        return;
      }

      setUploadingImage(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          profile_url: base64
        }));
        setUploadingImage(false);
        toast({
          title: "Imagem carregada",
          description: "A imagem foi carregada com sucesso. Guarde o perfil para confirmar.",
        });
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  if (loading || profileLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--angola-red)]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Gerencie suas informações pessoais e profissionais</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {editMode ? (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="flex-1 sm:flex-none bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90 text-sm sm:text-base"
                    size="sm"
                  >
                    {updateProfileMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Guardar
                  </Button>
                  <Button 
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 sm:flex-none text-sm sm:text-base"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setEditMode(true)}
                  className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90 text-sm sm:text-base"
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
              <Button 
                onClick={logout}
                variant="outline"
                className="text-sm sm:text-base"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-[var(--angola-yellow)]">
                      <AvatarImage src={formData.profile_url || profile?.profile_url} alt={profile?.name} />
                      <AvatarFallback className="text-lg sm:text-2xl">
                        {profile?.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profile-image-upload"
                      />
                      <label
                        htmlFor="profile-image-upload"
                        className="cursor-pointer inline-flex items-center justify-center h-8 w-8 rounded-full bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90 text-white transition-colors"
                      >
                        {uploadingImage ? (
                          <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </label>
                    </div>
                  </div>
                  
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {profile?.name || 'Sem nome'}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">{profile?.email}</p>
                  
                  {profile?.province && profile?.municipality && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {profile.province}, {profile.municipality}
                    </div>
                  )}

                  <div className="w-full space-y-2">
                    <div className="flex items-center text-xs sm:text-sm">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500" />
                      <span>{profile?.phone ? `+244 ${profile.phone}` : 'Não informado'}</span>
                    </div>
                    
                    <div className="flex items-center text-xs sm:text-sm">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500" />
                      <span>{profile?.age ? `${profile.age} anos` : 'Idade não informada'}</span>
                    </div>
                    
                    <div className="flex items-center text-xs sm:text-sm">
                      <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500" />
                      <span>{profile?.contract_type || 'Tipo de contrato não informado'}</span>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  {(profile?.facebook_url || profile?.instagram_url || profile?.whatsapp_url) && (
                    <div className="w-full mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Redes Sociais</p>
                      <div className="flex justify-center gap-3">
                        {profile?.facebook_url && (
                          <a 
                            href={profile.facebook_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                          </a>
                        )}
                        {profile?.instagram_url && (
                          <a 
                            href={profile.instagram_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-800 transition-colors"
                          >
                            <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                          </a>
                        )}
                        {profile?.whatsapp_url && (
                          <a 
                            href={profile.whatsapp_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 transition-colors"
                          >
                            <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  Informações Detalhadas
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 text-xs sm:text-sm">
                    <TabsTrigger value="personal" className="px-2 sm:px-4">Pessoal</TabsTrigger>
                    <TabsTrigger value="professional" className="px-2 sm:px-4">Profissional</TabsTrigger>
                    <TabsTrigger value="social" className="px-2 sm:px-4">Social</TabsTrigger>
                    <TabsTrigger value="settings" className="px-2 sm:px-4">Configurações</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4 mt-4 sm:mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name" className="text-sm sm:text-base">
                          Primeiro Nome <span className="text-red-500">*</span>
                        </Label>
                        {editMode ? (
                          <Input
                            id="first_name"
                            value={formData.first_name}
                            onChange={(e) => setFormData(prev => ({...prev, first_name: e.target.value}))}
                            placeholder="Primeiro nome"
                            className="text-sm sm:text-base"
                          />
                        ) : (
                          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded">
                            {profile?.first_name || 'Não informado'}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="last_name" className="text-sm sm:text-base">
                          Sobrenome <span className="text-red-500">*</span>
                        </Label>
                        {editMode ? (
                          <Input
                            id="last_name"
                            value={formData.last_name}
                            onChange={(e) => setFormData(prev => ({...prev, last_name: e.target.value}))}
                            placeholder="Sobrenome"
                            className="text-sm sm:text-base"
                          />
                        ) : (
                          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded">
                            {profile?.last_name || 'Não informado'}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm sm:text-base">
                          Telefone <span className="text-red-500">*</span>
                        </Label>
                        {editMode ? (
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <span className="text-gray-500 text-sm">+244</span>
                            </div>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '');
                                const limitedDigits = digits.slice(0, 9);
                                const formatted = limitedDigits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
                                setFormData(prev => ({...prev, phone: formatted}));
                              }}
                              placeholder="9XX XXX XXX"
                              className="pl-12 sm:pl-14 text-sm sm:text-base"
                            />
                          </div>
                        ) : (
                          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded">
                            {profile?.phone ? `+244 ${profile.phone}` : 'Não informado'}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="date_of_birth" className="text-sm sm:text-base">
                          Data de Nascimento <span className="text-red-500">*</span>
                        </Label>
                        {editMode ? (
                          <Input
                            id="date_of_birth"
                            type="date"
                            value={formData.date_of_birth}
                            onChange={(e) => setFormData(prev => ({...prev, date_of_birth: e.target.value}))}
                            className="text-sm sm:text-base"
                          />
                        ) : (
                          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded">
                            {profile?.date_of_birth 
                              ? new Date(profile.date_of_birth).toLocaleDateString('pt-PT') 
                              : 'Não informado'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm sm:text-base">Localização <span className="text-red-500">*</span></Label>
                      {editMode ? (
                        <LocationSelector
                          onLocationChange={handleLocationChange}
                          defaultValues={{
                            province: formData.province,
                            municipality: formData.municipality,
                            neighborhood: formData.neighborhood
                          }}
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded">
                          {[profile?.neighborhood, profile?.municipality, profile?.province]
                            .filter(Boolean)
                            .join(', ') || 'Não informado'}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address_complement" className="text-sm sm:text-base">
                        Complemento de Endereço
                      </Label>
                      {editMode ? (
                        <Input
                          id="address_complement"
                          value={formData.address_complement}
                          onChange={(e) => setFormData(prev => ({...prev, address_complement: e.target.value}))}
                          placeholder="Apartamento, bloco, etc."
                          className="text-sm sm:text-base"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded">
                          {profile?.address_complement || 'Não informado'}
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="professional" className="space-y-4 mt-4 sm:mt-6">
                    <div>
                      <Label htmlFor="contract_type" className="text-sm sm:text-base">
                        Tipo de Contrato <span className="text-red-500">*</span>
                      </Label>
                      {editMode ? (
                        <Select value={formData.contract_type} onValueChange={(value) => setFormData(prev => ({...prev, contract_type: value}))}>
                          <SelectTrigger className="text-sm sm:text-base">
                            <SelectValue placeholder="Seleccione o tipo de contrato" />
                          </SelectTrigger>
                          <SelectContent>
                            {contractTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded">
                          {contractTypes.find(type => type.value === profile?.contract_type)?.label || 'Não informado'}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="services" className="text-sm sm:text-base">
                        Serviços Oferecidos <span className="text-red-500">*</span>
                      </Label>
                      {editMode ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 sm:max-h-64 overflow-y-auto border rounded p-3">
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
                            profile.services.map((service: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                                {service}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">Nenhum serviço especificado</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="availability" className="text-sm sm:text-base">
                        Disponibilidade
                      </Label>
                      {editMode ? (
                        <Textarea
                          id="availability"
                          value={formData.availability}
                          onChange={(e) => setFormData(prev => ({...prev, availability: e.target.value}))}
                          placeholder="Ex: Segunda a Sexta, 8h às 17h"
                          className="text-sm sm:text-base"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded min-h-[60px]">
                          {profile?.availability || 'Não informado'}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="about_me" className="text-sm sm:text-base">
                        Sobre Mim
                      </Label>
                      {editMode ? (
                        <Textarea
                          id="about_me"
                          value={formData.about_me}
                          onChange={(e) => setFormData(prev => ({...prev, about_me: e.target.value}))}
                          placeholder="Conte-nos um pouco sobre você..."
                          rows={4}
                          className="text-sm sm:text-base"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded min-h-[80px]">
                          {profile?.about_me || 'Não informado'}
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="space-y-4 mt-4 sm:mt-6">
                    <div>
                      <Label htmlFor="facebook_url" className="text-sm sm:text-base">
                        Facebook
                      </Label>
                      {editMode ? (
                        <Input
                          id="facebook_url"
                          value={formData.facebook_url}
                          onChange={(e) => setFormData(prev => ({...prev, facebook_url: e.target.value}))}
                          placeholder="https://facebook.com/seu-perfil"
                          className="text-sm sm:text-base"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded">
                          {profile?.facebook_url ? (
                            <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                              <Facebook className="h-4 w-4" />
                              {profile.facebook_url}
                            </a>
                          ) : (
                            'Não informado'
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="instagram_url" className="text-sm sm:text-base">
                        Instagram
                      </Label>
                      {editMode ? (
                        <Input
                          id="instagram_url"
                          value={formData.instagram_url}
                          onChange={(e) => setFormData(prev => ({...prev, instagram_url: e.target.value}))}
                          placeholder="https://instagram.com/seu-perfil"
                          className="text-sm sm:text-base"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded">
                          {profile?.instagram_url ? (
                            <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline flex items-center gap-1">
                              <Instagram className="h-4 w-4" />
                              {profile.instagram_url}
                            </a>
                          ) : (
                            'Não informado'
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="whatsapp_url" className="text-sm sm:text-base">
                        WhatsApp
                      </Label>
                      {editMode ? (
                        <Input
                          id="whatsapp_url"
                          value={formData.whatsapp_url}
                          onChange={(e) => setFormData(prev => ({...prev, whatsapp_url: e.target.value}))}
                          placeholder="https://wa.me/244XXXXXXXXX"
                          className="text-sm sm:text-base"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded">
                          {profile?.whatsapp_url ? (
                            <a href={profile.whatsapp_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {profile.whatsapp_url}
                            </a>
                          ) : (
                            'Não informado'
                          )}
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4 mt-4 sm:mt-6">
                    <Card className="border-red-200 dark:border-red-800">
                      <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2 text-lg sm:text-xl">
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          Área de Perigo
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Eliminar Conta</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                              Esta ação eliminará permanentemente a sua conta e todos os dados associados.
                            </p>
                            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="text-sm sm:text-base">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar Conta
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="w-[90vw] sm:w-auto">
                                <DialogHeader>
                                  <DialogTitle>Confirmar Eliminação de Conta</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Tem a certeza de que deseja eliminar permanentemente a sua conta? Esta ação não pode ser desfeita.
                                  </p>
                                  <div className="flex gap-3">
                                    <Button
                                      variant="destructive"
                                      onClick={handleDeleteAccount}
                                      disabled={deleteAccountMutation.isPending}
                                      size="sm"
                                    >
                                      {deleteAccountMutation.isPending ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                      ) : (
                                        <Trash2 className="h-4 w-4 mr-2" />
                                      )}
                                      Sim, Eliminar
                                    </Button>
                                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} size="sm">
                                      Cancelar
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}