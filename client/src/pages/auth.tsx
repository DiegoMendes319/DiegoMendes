import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import LocationSelector from "@/components/location-selector";
import { UserPlus, LogIn, Home, Calendar, Globe, Facebook, Instagram, Music, Mail } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { InsertUser } from "@shared/schema";

type AuthMethod = 'email' | 'google' | 'simple';

export default function Auth() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [formData, setFormData] = useState<Partial<InsertUser>>({
    services: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isLogin) {
      // Name validation
      if (!formData.first_name?.trim()) {
        newErrors.first_name = 'Primeiro nome é obrigatório';
      }
      if (!formData.last_name?.trim()) {
        newErrors.last_name = 'Último nome é obrigatório';
      }

      // Age validation (≥18)
      if (!formData.date_of_birth) {
        newErrors.date_of_birth = 'Data de nascimento é obrigatória';
      } else {
        const age = validateAge(formData.date_of_birth);
        if (age < 18) {
          newErrors.date_of_birth = 'Deve ter pelo menos 18 anos';
        }
      }

      // Phone validation
      if (!formData.phone?.trim()) {
        newErrors.phone = 'Telefone é obrigatório';
      }

      // Email validation (only for email method)
      if (authMethod === 'email' && !formData.email?.trim()) {
        newErrors.email = 'Email é obrigatório';
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }

      // Location validation
      if (!formData.province) {
        newErrors.province = 'Província é obrigatória';
      }
      if (!formData.municipality) {
        newErrors.municipality = 'Município é obrigatório';
      }
      if (!formData.neighborhood) {
        newErrors.neighborhood = 'Bairro é obrigatório';
      }

      // Contract type validation
      if (!formData.contract_type) {
        newErrors.contract_type = 'Tipo de contrato é obrigatório';
      }

      // Services validation
      if (!formData.services || formData.services.length === 0) {
        newErrors.services = 'Selecione pelo menos um serviço';
      }

      // Availability validation
      if (!formData.availability?.trim()) {
        newErrors.availability = 'Disponibilidade é obrigatória';
      }

      // URL validation
      if (formData.facebook_url && formData.facebook_url.trim() && !/^https?:\/\/.+/.test(formData.facebook_url)) {
        newErrors.facebook_url = 'URL do Facebook inválida';
      }
      if (formData.instagram_url && formData.instagram_url.trim() && !/^https?:\/\/.+/.test(formData.instagram_url)) {
        newErrors.instagram_url = 'URL do Instagram inválida';
      }
      if (formData.tiktok_url && formData.tiktok_url.trim() && !/^https?:\/\/.+/.test(formData.tiktok_url)) {
        newErrors.tiktok_url = 'URL do TikTok inválida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta.",
      });
      setLocation("/profile");
    },
    onError: (error) => {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const response = await apiRequest('POST', '/api/users', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Conta criada com sucesso!",
        description: "Você pode fazer login agora.",
      });
      setLocation("/profile");
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGoogleAuth = async () => {
    toast({
      title: "Google OAuth",
      description: "Funcionalidade em desenvolvimento. Use email por enquanto.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro na validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive"
      });
      return;
    }
    
    if (isLogin) {
      if (formData.email && formData.password) {
        loginMutation.mutate({
          email: formData.email,
          password: formData.password,
        });
      }
    } else {
      registerMutation.mutate(formData as InsertUser);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Home className="h-8 w-8 text-[var(--angola-red)]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[var(--angola-red)]">
            {isLogin ? "Entrar" : "Criar Conta"}
          </CardTitle>
          <p className="text-gray-600">
            {isLogin ? "Entre na sua conta" : "Junte-se à nossa comunidade de profissionais"}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                {/* Authentication Method Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Método de Cadastro</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant={authMethod === 'email' ? 'default' : 'outline'}
                      onClick={() => setAuthMethod('email')}
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email + Senha
                    </Button>
                    <Button
                      type="button"
                      variant={authMethod === 'google' ? 'default' : 'outline'}
                      onClick={() => setAuthMethod('google')}
                      className="flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Conta Google
                    </Button>
                    <Button
                      type="button"
                      variant={authMethod === 'simple' ? 'default' : 'outline'}
                      onClick={() => setAuthMethod('simple')}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Formulário Simples
                    </Button>
                  </div>
                </div>

                {/* Google OAuth */}
                {authMethod === 'google' && (
                  <div className="space-y-4">
                    <Button
                      type="button"
                      onClick={handleGoogleAuth}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Continuar com Google
                    </Button>
                    <p className="text-sm text-gray-600 text-center">
                      Após autorizar, você poderá completar seu perfil
                    </p>
                  </div>
                )}

                {/* Personal Information */}
                {authMethod !== 'google' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">Primeiro Nome *</Label>
                        <Input
                          id="first_name"
                          required
                          value={formData.first_name || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                          placeholder="Maria"
                          className={errors.first_name ? 'border-red-500' : ''}
                        />
                        {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                      </div>
                      <div>
                        <Label htmlFor="last_name">Último Nome *</Label>
                        <Input
                          id="last_name"
                          required
                          value={formData.last_name || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                          placeholder="Santos"
                          className={errors.last_name ? 'border-red-500' : ''}
                        />
                        {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date_of_birth">Data de Nascimento *</Label>
                        <Input
                          id="date_of_birth"
                          type="date"
                          required
                          value={formData.date_of_birth || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                          className={errors.date_of_birth ? 'border-red-500' : ''}
                        />
                        {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+244 923 456 789"
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Email and Password */}
            {(isLogin || authMethod === 'email') && (
              <>
                <div>
                  <Label htmlFor="email">Email {!isLogin ? '*' : ''}</Label>
                  <Input
                    id="email"
                    type="email"
                    required={isLogin || authMethod === 'email'}
                    value={formData.email || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu.email@exemplo.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="password">Senha {!isLogin ? '(mínimo 8 caracteres)' : ''}</Label>
                  <Input
                    id="password"
                    type="password"
                    required={isLogin || authMethod === 'email'}
                    value={formData.password || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Mínimo 8 caracteres"
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
              </>
            )}

            {/* Professional Information */}
            {!isLogin && authMethod !== 'google' && (
              <>
                <LocationSelector 
                  onLocationChange={handleLocationChange}
                  defaultValues={{
                    province: formData.province,
                    municipality: formData.municipality,
                    neighborhood: formData.neighborhood
                  }}
                />
                
                <div>
                  <Label htmlFor="contract_type">Tipo de Contrato *</Label>
                  <Select 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, contract_type: value }))}
                    value={formData.contract_type || ""}
                  >
                    <SelectTrigger className={errors.contract_type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o tipo de contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diarista">Diarista</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="verbal">Acordo Verbal</SelectItem>
                      <SelectItem value="escrito">Contrato Escrito</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.contract_type && <p className="text-red-500 text-sm mt-1">{errors.contract_type}</p>}
                </div>
                
                <div>
                  <Label>Serviços Oferecidos *</Label>
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
                  {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
                </div>
                
                <div>
                  <Label htmlFor="availability">Disponibilidade *</Label>
                  <Textarea
                    id="availability"
                    required
                    value={formData.availability || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                    placeholder="Ex: Segunda a Sexta, 8h às 17h"
                    rows={3}
                    className={errors.availability ? 'border-red-500' : ''}
                  />
                  {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
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

                {/* Social Media Links */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Redes Sociais (Opcional)</Label>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="facebook_url" className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        Facebook
                      </Label>
                      <Input
                        id="facebook_url"
                        type="url"
                        value={formData.facebook_url || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                        placeholder="https://facebook.com/seu.perfil"
                        className={errors.facebook_url ? 'border-red-500' : ''}
                      />
                      {errors.facebook_url && <p className="text-red-500 text-sm mt-1">{errors.facebook_url}</p>}
                    </div>

                    <div>
                      <Label htmlFor="instagram_url" className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-600" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram_url"
                        type="url"
                        value={formData.instagram_url || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                        placeholder="https://instagram.com/seu.perfil"
                        className={errors.instagram_url ? 'border-red-500' : ''}
                      />
                      {errors.instagram_url && <p className="text-red-500 text-sm mt-1">{errors.instagram_url}</p>}
                    </div>

                    <div>
                      <Label htmlFor="tiktok_url" className="flex items-center gap-2">
                        <Music className="h-4 w-4 text-black" />
                        TikTok
                      </Label>
                      <Input
                        id="tiktok_url"
                        type="url"
                        value={formData.tiktok_url || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, tiktok_url: e.target.value }))}
                        placeholder="https://tiktok.com/@seu.perfil"
                        className={errors.tiktok_url ? 'border-red-500' : ''}
                      />
                      {errors.tiktok_url && <p className="text-red-500 text-sm mt-1">{errors.tiktok_url}</p>}
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
              disabled={loginMutation.isPending || registerMutation.isPending}
            >
              {isLogin ? (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Conta
                </>
              )}
            </Button>
          </form>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[var(--angola-red)] hover:underline font-medium"
              >
                {isLogin ? "Criar conta" : "Fazer login"}
              </button>
            </p>
            <button
              type="button"
              onClick={() => setLocation("/")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Voltar ao início
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}