import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Camera, Edit, Save, X, User, Phone, MapPin, Calendar, Briefcase, Home, Trash2, ExternalLink, Facebook, Instagram } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import type { User as UserType } from '@/types/user';
import { LocationSelector } from '@/components/location-selector';

const contractTypes = [
  { value: 'full-time', label: 'Tempo integral' },
  { value: 'part-time', label: 'Meio período' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'contract', label: 'Contrato' },
  { value: 'temporary', label: 'Temporário' },
  { value: 'internship', label: 'Estágio' },
];

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

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    province: '',
    municipality: '',
    neighborhood: '',
    address_complement: '',
    services: [] as string[],
    contract_type: '',
    availability: '',
    about_me: '',
    profile_url: '',
    facebook_url: '',
    instagram_url: '',
    whatsapp_url: '',
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/profile'],
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<UserType>) => {
      return await apiRequest('/api/profile', 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: 'Perfil actualizado',
        description: 'As suas alterações foram guardadas com sucesso.',
      });
      setEditMode(false);
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao actualizar perfil',
        description: error.message || 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/profile', 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: 'Conta eliminada',
        description: 'A sua conta foi eliminada com sucesso.',
      });
      logout();
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao eliminar conta',
        description: error.message || 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        province: profile.province || '',
        municipality: profile.municipality || '',
        neighborhood: profile.neighborhood || '',
        address_complement: profile.address_complement || '',
        services: profile.services || [],
        contract_type: profile.contract_type || '',
        availability: profile.availability || '',
        about_me: profile.about_me || '',
        profile_url: profile.profile_url || '',
        facebook_url: profile.facebook_url || '',
        instagram_url: profile.instagram_url || '',
        whatsapp_url: profile.whatsapp_url || '',
      });
    }
  }, [profile]);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    updateMutation.mutate(formData);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--angola-red)]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e profissionais</p>
      </div>

      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-[var(--angola-yellow)]">
                  <AvatarImage src={profile?.profile_url || undefined} alt={profile?.name} />
                  <AvatarFallback className="text-2xl">
                    {profile?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{profile?.name || 'Sem nome'}</h2>
                <p className="text-gray-600">{profile?.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile?.services?.slice(0, 3).map((service: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {profile?.services?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.services.length - 3} mais
                    </Badge>
                  )}
                </div>
              </div>
              {editMode && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <Label>Nome <span className="text-red-500">*</span></Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      <div>
                        <Label>Email <span className="text-red-500">*</span></Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                      <div>
                        <Label>Telefone <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-gray-500 text-sm">+244</span>
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
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Data de Nascimento <span className="text-red-500">*</span></Label>
                        <Input
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label>Localização <span className="text-red-500">*</span></Label>
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
                        <Label>Complemento de Endereço <span className="text-gray-500">(opcional)</span></Label>
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
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                          <span>{[profile?.neighborhood, profile?.municipality, profile?.province].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                      {profile?.address_complement && (
                        <div className="flex items-start">
                          <Home className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                          <span>{profile.address_complement}</span>
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
                        <Label>Tipo de Contrato <span className="text-red-500">*</span></Label>
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
                        <Label>Disponibilidade <span className="text-gray-500">(opcional)</span></Label>
                        <Textarea
                          value={formData.availability}
                          onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                          placeholder="Ex: Segunda a Sexta, 8h-17h"
                        />
                      </div>
                      <div>
                        <Label>Sobre Mim <span className="text-gray-500">(opcional)</span></Label>
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
                          <p className="text-gray-700">{profile.about_me}</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Social Media Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Redes Sociais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <>
                    <div>
                      <Label>Facebook <span className="text-gray-500">(opcional)</span></Label>
                      <Input
                        value={formData.facebook_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                        placeholder="https://facebook.com/seu-perfil"
                      />
                    </div>
                    <div>
                      <Label>Instagram <span className="text-gray-500">(opcional)</span></Label>
                      <Input
                        value={formData.instagram_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                        placeholder="https://instagram.com/seu-perfil"
                      />
                    </div>
                    <div>
                      <Label>WhatsApp <span className="text-gray-500">(opcional)</span></Label>
                      <Input
                        value={formData.whatsapp_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_url: e.target.value }))}
                        placeholder="https://wa.me/244XXXXXXXXX"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {profile?.facebook_url && (
                      <a 
                        href={profile.facebook_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </a>
                    )}
                    {profile?.instagram_url && (
                      <a 
                        href={profile.instagram_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-700 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </a>
                    )}
                    {profile?.whatsapp_url && (
                      <a 
                        href={profile.whatsapp_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Serviços Oferecidos <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Área de Perigo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Eliminar Conta</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Esta ação eliminará permanentemente a sua conta e todos os dados associados.
                    </p>
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar Conta
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar Eliminação de Conta</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">
                            Tem a certeza de que deseja eliminar permanentemente a sua conta? Esta ação não pode ser desfeita.
                          </p>
                          <div className="flex gap-3">
                            <Button
                              variant="destructive"
                              onClick={handleDeleteAccount}
                              disabled={deleteAccountMutation.isPending}
                            >
                              {deleteAccountMutation.isPending ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              Sim, Eliminar
                            </Button>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
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
      </div>
    </div>
  );
}