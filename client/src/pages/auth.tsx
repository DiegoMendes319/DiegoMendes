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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import LocationSelector from "@/components/location-selector";
import { UserPlus, LogIn, Home, Mail, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { apiRequest } from "@/lib/queryClient";
import type { InsertUser } from "@shared/schema";

type AuthMethod = 'email' | 'google' | 'simple';
type AuthMode = 'login' | 'register';

export default function Auth() {
  const [, setLocation] = useLocation();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertUser>>({
    services: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
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

    if (authMode === 'login') {
      // Login validation
      if (authMethod === 'email' && !formData.email?.trim()) {
        newErrors.email = 'Email é obrigatório';
      }
      if (authMethod === 'simple') {
        if (!formData.first_name?.trim()) {
          newErrors.first_name = 'Primeiro nome é obrigatório';
        }
        if (!formData.last_name?.trim()) {
          newErrors.last_name = 'Último nome é obrigatório';
        }
      }
      // Password always required for login (except Google)
      if (authMethod !== 'google' && !formData.password?.trim()) {
        newErrors.password = 'Senha é obrigatória';
      }
    } else {
      // Registration validation
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
      if (authMethod === 'email') {
        if (!formData.email?.trim()) {
          newErrors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Email inválido';
        }
      }

      // Password validation (for email and simple methods)
      if (authMethod !== 'google' && !formData.password?.trim()) {
        newErrors.password = 'Senha é obrigatória';
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

      // Checkbox validations
      if (!agreeAge) {
        newErrors.agreeAge = 'Você deve confirmar que tem 18 anos ou mais';
      }
      if (!agreeTerms) {
        newErrors.agreeTerms = 'Você deve concordar com os termos e políticas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked
        ? [...(prev.services || []), service]
        : (prev.services || []).filter(s => s !== service)
    }));
  };

  const handleLocationChange = (location: { province?: string; municipality?: string; neighborhood?: string }) => {
    setFormData(prev => ({ ...prev, ...location }));
  };

  const authMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      if (authMode === 'login') {
        // Mock login - in real app, this would use Supabase auth
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para seu perfil...",
        });
        setLocation("/profile");
        return;
      }

      const response = await apiRequest('POST', '/api/users', data);
      return response.json();
    },
    onSuccess: () => {
      if (authMode === 'register') {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Bem-vindo ao Doméstica Angola!",
        });
        setLocation("/profile");
      }
    },
    onError: (error) => {
      toast({
        title: "Erro na autenticação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGoogleAuth = async () => {
    try {
      // Mock Google OAuth - in real app, this would use Supabase OAuth
      toast({
        title: "Conectando com Google...",
        description: "Redirecionando para autenticação Google",
      });
      
      // Simulate OAuth flow
      setTimeout(() => {
        if (authMode === 'login') {
          setLocation("/profile");
        } else {
          // For registration, we'd need to collect additional info
          toast({
            title: "Conta Google conectada!",
            description: "Complete seu perfil com as informações adicionais",
          });
        }
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro na autenticação Google",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (authMethod === 'google') {
      handleGoogleAuth();
      return;
    }

    if (authMode === 'login') {
      // Handle login
      authMutation.mutate(formData as InsertUser);
    } else {
      // Handle registration
      const userData: InsertUser = {
        ...formData,
        date_of_birth: formData.date_of_birth || '',
        availability: formData.availability || '',
        services: formData.services || [],
      } as InsertUser;

      authMutation.mutate(userData);
    }
  };

  const resetForm = () => {
    setFormData({ services: [] });
    setErrors({});
    setAgreeAge(false);
    setAgreeTerms(false);
  };

  const switchAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    resetForm();
  };

  const switchAuthMethod = (method: AuthMethod) => {
    setAuthMethod(method);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-[var(--angola-red)] hover:bg-[var(--angola-red)]/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[var(--angola-red)] mb-2">
              {authMode === 'login' ? 'Entrar na Conta' : 'Criar Conta'}
            </CardTitle>
            <p className="text-gray-600">
              {authMode === 'login' 
                ? 'Escolha uma das três formas de entrar:'
                : 'Cadastre-se para conectar com famílias'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mode Switch */}
            <div className="flex justify-center space-x-4">
              <Button
                variant={authMode === 'login' ? 'default' : 'outline'}
                onClick={() => switchAuthMode('login')}
                className={authMode === 'login' ? 'bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90' : ''}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </Button>
              <Button
                variant={authMode === 'register' ? 'default' : 'outline'}
                onClick={() => switchAuthMode('register')}
                className={authMode === 'register' ? 'bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90' : ''}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar
              </Button>
            </div>

            {/* Auth Method Selection */}
            <Tabs value={authMethod} onValueChange={(value) => switchAuthMethod(value as AuthMethod)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail
                </TabsTrigger>
                <TabsTrigger value="google" className="flex items-center gap-2">
                  <FaGoogle className="h-4 w-4" />
                  Google
                </TabsTrigger>
                <TabsTrigger value="simple" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Simples
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                {/* Email Method */}
                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Digite sua senha"
                          className={errors.password ? 'border-red-500' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                  </div>
                </TabsContent>

                {/* Google Method */}
                <TabsContent value="google" className="space-y-4">
                  <div className="text-center">
                    <Button
                      type="button"
                      onClick={handleGoogleAuth}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={authMutation.isPending}
                    >
                      <FaGoogle className="h-4 w-4 mr-2" />
                      {authMode === 'login' ? 'Entrar' : 'Cadastrar'} com Google
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      {authMode === 'login' 
                        ? 'Acesse sua conta usando sua conta Google'
                        : 'Após conectar com Google, você completará seu perfil'
                      }
                    </p>
                  </div>
                </TabsContent>

                {/* Simple Method */}
                <TabsContent value="simple" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">Primeiro Nome</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        placeholder="João"
                        className={errors.first_name ? 'border-red-500' : ''}
                      />
                      {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="last_name">Último Nome</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        placeholder="Silva"
                        className={errors.last_name ? 'border-red-500' : ''}
                      />
                      {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                    </div>
                  </div>

                  {authMode === 'login' && (
                    <div>
                      <Label htmlFor="simple_password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="simple_password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Digite sua senha"
                          className={errors.password ? 'border-red-500' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                  )}
                </TabsContent>

                {/* Registration Fields (shown for all methods when registering) */}
                {authMode === 'register' && authMethod !== 'google' && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-900">Complete seu perfil</h3>
                    
                    {/* Basic Info for Email Method */}
                    {authMethod === 'email' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="reg_first_name">Primeiro Nome</Label>
                          <Input
                            id="reg_first_name"
                            value={formData.first_name || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                            placeholder="João"
                            className={errors.first_name ? 'border-red-500' : ''}
                          />
                          {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                        </div>
                        <div>
                          <Label htmlFor="reg_last_name">Último Nome</Label>
                          <Input
                            id="reg_last_name"
                            value={formData.last_name || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                            placeholder="Silva"
                            className={errors.last_name ? 'border-red-500' : ''}
                          />
                          {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                        </div>
                      </div>
                    )}

                    {/* Password for Simple Method */}
                    {authMethod === 'simple' && (
                      <div>
                        <Label htmlFor="reg_password">Senha</Label>
                        <div className="relative">
                          <Input
                            id="reg_password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Digite sua senha"
                            className={errors.password ? 'border-red-500' : ''}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                      </div>
                    )}

                    {/* Common Registration Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date_of_birth">Data de Nascimento</Label>
                        <Input
                          id="date_of_birth"
                          type="date"
                          value={formData.date_of_birth || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                          className={errors.date_of_birth ? 'border-red-500' : ''}
                        />
                        {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+244 923 456 789"
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Location */}
                    <LocationSelector 
                      onLocationChange={handleLocationChange}
                      defaultValues={{
                        province: formData.province,
                        municipality: formData.municipality,
                        neighborhood: formData.neighborhood
                      }}
                    />
                    {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                    {errors.municipality && <p className="text-red-500 text-sm mt-1">{errors.municipality}</p>}

                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={formData.neighborhood || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                        placeholder="Digite o nome do seu bairro"
                        className={errors.neighborhood ? 'border-red-500' : ''}
                      />
                      {errors.neighborhood && <p className="text-red-500 text-sm mt-1">{errors.neighborhood}</p>}
                    </div>

                    <div>
                      <Label htmlFor="address_complement">Complemento de Endereço</Label>
                      <Input
                        id="address_complement"
                        value={formData.address_complement || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, address_complement: e.target.value }))}
                        placeholder="Ex: Rua 12, Casa 34, próximo ao mercado, ponto de ônibus da escola"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Inclua informações como rua, número, referência, ponto de ônibus, etc.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="contract_type">Tipo de Contrato</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, contract_type: value }))}>
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
                      {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
                    </div>

                    <div>
                      <Label htmlFor="availability">Disponibilidade</Label>
                      <Textarea
                        id="availability"
                        value={formData.availability || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                        placeholder="Ex: Segunda a Sexta, 8h às 17h"
                        rows={2}
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
                        placeholder="Descreva aqui os serviços que você oferece e suas habilidades..."
                        rows={3}
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Descreva aqui os serviços que você oferece e suas habilidades.
                      </p>
                    </div>

                    {/* Required Checkboxes */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agree_age"
                          checked={agreeAge}
                          onCheckedChange={setAgreeAge}
                          className={errors.agreeAge ? 'border-red-500' : ''}
                        />
                        <Label htmlFor="agree_age" className="text-sm leading-relaxed">
                          Tenho 18 anos ou mais
                        </Label>
                      </div>
                      {errors.agreeAge && <p className="text-red-500 text-sm">{errors.agreeAge}</p>}

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agree_terms"
                          checked={agreeTerms}
                          onCheckedChange={setAgreeTerms}
                          className={errors.agreeTerms ? 'border-red-500' : ''}
                        />
                        <Label htmlFor="agree_terms" className="text-sm leading-relaxed">
                          Concordo com os{" "}
                          <a href="/termos" className="text-[var(--angola-red)] hover:underline">
                            Termos de Serviço
                          </a>
                          ,{" "}
                          <a href="/privacidade" className="text-[var(--angola-red)] hover:underline">
                            Política de Privacidade
                          </a>
                          {" "}e{" "}
                          <a href="/cookies" className="text-[var(--angola-red)] hover:underline">
                            Política de Cookies
                          </a>
                        </Label>
                      </div>
                      {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                {authMethod !== 'google' && (
                  <Button
                    type="submit"
                    className="w-full bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
                    disabled={authMutation.isPending}
                  >
                    {authMutation.isPending ? 'Processando...' : 
                     authMode === 'login' ? 'Entrar' : 'Criar Conta'}
                  </Button>
                )}
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}