import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, MapPin, Phone, Mail, Calendar, Star, Edit, Upload, Camera, LogOut, Key, Settings, User as UserIcon } from 'lucide-react';
import { insertUserSchema, type InsertUser } from '@shared/schema';
import { useAuth } from '@/lib/auth';
import { useLocation } from 'wouter';
import { locationData } from '@/lib/location-data';
import { serviceOptions } from '@/lib/service-options';
import { apiRequest } from '@/lib/queryClient';

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  age: number;
  province: string;
  municipality: string;
  neighborhood: string;
  address_complement?: string;
  services: string[];
  contract_type: string;
  availability: string;
  about_me?: string;
  profile_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  whatsapp_url?: string;
  average_rating: number;
  total_reviews: number;
  created_at: string;
}

const profileSchema = insertUserSchema.extend({
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (use YYYY-MM-DD)'),
  facebook_url: z.string().optional(),
  instagram_url: z.string().optional(),
  whatsapp_url: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Palavra-passe deve ter pelo menos 6 caracteres'),
  newPassword: z.string().min(6, 'Palavra-passe deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Palavra-passe deve ter pelo menos 6 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Palavras-passe não coincidem',
  path: ['confirmPassword'],
});

export default function ProfilePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      province: '',
      municipality: '',
      neighborhood: '',
      address_complement: '',
      services: [],
      contract_type: '',
      availability: '',
      about_me: '',
      profile_url: '',
      facebook_url: '',
      instagram_url: '',
      whatsapp_url: '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { data: profile, isLoading } = useQuery<ProfileData>({
    queryKey: ['/api/auth/me'],
    refetchOnWindowFocus: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileData>) => {
      return apiRequest('/api/users/' + profile?.id, 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: 'Perfil atualizado',
        description: 'As suas informações foram atualizadas com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message || 'Ocorreu um erro ao atualizar o perfil.',
        variant: 'destructive',
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return apiRequest('/api/auth/change-password', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: 'Palavra-passe alterada',
        description: 'A sua palavra-passe foi alterada com sucesso.',
      });
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao alterar palavra-passe',
        description: error.message || 'Ocorreu um erro ao alterar a palavra-passe.',
        variant: 'destructive',
      });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const reader = new FileReader();
      return new Promise<string>((resolve) => {
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve(result);
        };
        reader.readAsDataURL(file);
      });
    },
    onSuccess: (imageUrl: string) => {
      form.setValue('profile_url', imageUrl);
      setImagePreview(imageUrl);
    },
  });

  // Load profile data into form when fetched
  useEffect(() => {
    if (profile) {
      const formData = {
        ...profile,
        date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : '',
      };
      form.reset(formData);
      setImagePreview(profile.profile_url || null);
    }
  }, [profile, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'Arquivo muito grande',
          description: 'A imagem deve ter no máximo 5MB.',
          variant: 'destructive',
        });
        return;
      }
      
      setProfileImageFile(file);
      uploadImageMutation.mutate(file);
    }
  };

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      await updateProfileMutation.mutateAsync(data);
    } catch (error) {
      // Error is handled by mutation
    }
  };

  const onPasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    } catch (error) {
      // Error is handled by mutation
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast({
        title: 'Erro ao sair',
        description: 'Ocorreu um erro ao fazer logout.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Perfil não encontrado</CardTitle>
            <CardDescription>Não foi possível carregar os dados do perfil.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const selectedProvince = form.watch('province');
  const selectedMunicipality = form.watch('municipality');
  
  const municipalities = selectedProvince ? locationData[selectedProvince] || [] : [];
  const neighborhoods = selectedMunicipality && selectedProvince ? 
    locationData[selectedProvince]?.find(m => m.name === selectedMunicipality)?.neighborhoods || [] : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Meu Perfil</h1>
        <p className="text-gray-600 dark:text-gray-300">Gerencie as suas informações pessoais e profissionais</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Pessoal
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Profissional
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Atualize os seus dados pessoais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={imagePreview || profile.profile_url || ''} alt="Foto de perfil" />
                      <AvatarFallback className="text-2xl bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                        {profile.first_name[0]}{profile.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profile.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {profile.average_rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {profile.average_rating.toFixed(1)} ({profile.total_reviews} avaliações)
                          </span>
                        )}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('profile-image')?.click()}
                          disabled={uploadImageMutation.isPending}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          {uploadImageMutation.isPending ? 'Enviando...' : 'Alterar Foto'}
                        </Button>
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome *</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sobrenome *</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu sobrenome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone *</FormLabel>
                          <FormControl>
                            <Input placeholder="900 000 000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Localização
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Província *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a província" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.keys(locationData).map((province) => (
                                  <SelectItem key={province} value={province}>
                                    {province}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="municipality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Município *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o município" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {municipalities.map((municipality) => (
                                  <SelectItem key={municipality.name} value={municipality.name}>
                                    {municipality.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="neighborhood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o bairro" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {neighborhoods.map((neighborhood) => (
                                  <SelectItem key={neighborhood} value={neighborhood}>
                                    {neighborhood}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address_complement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complemento do Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Rua das Flores, Casa 123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Profissionais</CardTitle>
                  <CardDescription>Configure os serviços que oferece</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serviços Oferecidos *</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {serviceOptions.map((service) => (
                            <label key={service} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.value?.includes(service) || false}
                                onChange={(e) => {
                                  const currentServices = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([...currentServices, service]);
                                  } else {
                                    field.onChange(currentServices.filter(s => s !== service));
                                  }
                                }}
                                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                              />
                              <span className="text-sm">{service}</span>
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contract_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Contrato *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="diarista">Diarista</SelectItem>
                              <SelectItem value="meio_periodo">Meio Período</SelectItem>
                              <SelectItem value="tempo_integral">Tempo Integral</SelectItem>
                              <SelectItem value="permanente">Permanente</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disponibilidade *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Segunda a Sexta, 8h às 17h" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="about_me"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sobre Mim</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte-nos sobre a sua experiência e competências..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociais</CardTitle>
                  <CardDescription>Adicione os links das suas redes sociais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="facebook_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/seuperfil" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagram_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/seuperfil" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="whatsapp_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="https://wa.me/244900000000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Alterar Palavra-passe</CardTitle>
                    <CardDescription>Atualize a sua palavra-passe de acesso</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Palavra-passe Atual *</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Digite a palavra-passe atual" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nova Palavra-passe *</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Digite a nova palavra-passe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirmar Nova Palavra-passe *</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirme a nova palavra-passe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          disabled={changePasswordMutation.isPending}
                          className="w-full"
                        >
                          <Key className="h-4 w-4 mr-2" />
                          {changePasswordMutation.isPending ? 'Alterando...' : 'Alterar Palavra-passe'}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configurações da Conta</CardTitle>
                    <CardDescription>Gerencie a sua conta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair da Conta
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Save Button - Only show for profile tabs */}
            {activeTab !== 'settings' && (
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  className="min-w-[120px]"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? 'Guardando...' : 'Guardar Alterações'}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </Tabs>
    </div>
  );
}