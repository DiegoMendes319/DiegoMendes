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
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import LocationSelector from "@/components/location-selector";
import { UserPlus, LogIn, Home, Mail, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { apiRequest } from "@/lib/queryClient";
import { scrollToElement } from "@/hooks/use-scroll-to-top";
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
  const supabaseAuth = useSupabaseAuth();

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

  // Format phone number in groups of 3 digits
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Limit to 9 digits (Angola mobile format)
    const limitedDigits = digits.slice(0, 9);
    
    // Format in groups of 3: XXX XXX XXX
    const formatted = limitedDigits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    
    return formatted;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (authMode === 'login') {
      // Login validation
      if (authMethod === 'email' && !formData.email?.trim()) {
        newErrors.email = 'E-mail é obrigatório';
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
        newErrors.password = 'Palavra-passe é obrigatória';
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
        newErrors.password = 'Palavra-passe é obrigatória';
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
        newErrors.agreeAge = 'Deve confirmar que tem 18 anos ou mais';
      }
      if (!agreeTerms) {
        newErrors.agreeTerms = 'Deve concordar com os termos e políticas';
      }
    }

    setErrors(newErrors);
    
    // Scroll to first error field if validation fails
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      setTimeout(() => {
        scrollToElement(firstErrorField);
      }, 100);
    }
    
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

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      // Use our local API for login
      const response = await apiRequest('POST', '/api/auth/login', data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no login');
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Login successful:', data);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta, ${data.user?.name || ''}!`,
      });
      
      // Force page reload to update auth state, then redirect
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1500);
    },
    onError: (error) => {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Email ou palavra-passe incorretos.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      // Use our local API for registration instead of Supabase
      const response = await apiRequest('POST', '/api/auth/register', data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no registo');
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Registration successful:', data);
      toast({
        title: "Registo realizado com sucesso!",
        description: `Bem-vindo ${data.user?.name || 'ao Jikulumessu'}!`,
      });
      
      // Force page reload to update auth state, then redirect
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1500);
    },
    onError: (error) => {
      console.error('Registration error:', error);
      toast({
        title: "Erro no registo",
        description: error.message || "Erro ao criar conta. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const authMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      if (authMode === 'login') {
        if (authMethod === 'email' && data.email && data.password) {
          // Use our local authentication endpoint
          return loginMutation.mutateAsync({
            email: data.email,
            password: data.password
          });
        } else if (authMethod === 'simple') {
          // Use simple login endpoint
          const response = await apiRequest('POST', '/api/auth/simple-login', {
            first_name: data.first_name!,
            last_name: data.last_name!,
            password: data.password!
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro no login simples');
          }
          
          const result = await response.json();
          
          // Handle success for simple login
          toast({
            title: "Login realizado com sucesso!",
            description: `Bem-vindo de volta, ${result.user?.name || ''}!`,
          });
          
          // Force page reload to update auth state, then redirect
          setTimeout(() => {
            window.location.href = "/profile";
          }, 1500);
          
          return result;
        }
        throw new Error('Método de login inválido');
      }

      // Registration mode
      return registerMutation.mutateAsync(data);
    },
    onSuccess: () => {
      // Success is handled by individual mutations
    },
    onError: (error) => {
      // Errors are handled by individual mutations
      console.error('Auth error:', error);
    },
  });

  const handleGoogleAuth = async () => {
    try {
      const result = await supabaseAuth.signInWithGoogle();
      console.log('Google auth result:', result);
      
      if (result.error) {
        toast({
          title: "Erro na autenticação",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Autenticação bem-sucedida!",
          description: "A redireccionar para o seu perfil...",
        });
        setTimeout(() => setLocation("/profile"), 1000);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Erro na autenticação",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (authMethod === 'google') {
      handleGoogleAuth();
      return;
    }

    try {
      if (authMode === 'login') {
        // Handle login
        authMutation.mutate(formData as InsertUser);
      } else {
        // Handle registration
        if (authMethod === 'simple') {
          // Use simple registration endpoint
          const simpleData = {
            first_name: formData.first_name!,
            last_name: formData.last_name!,
            password: formData.password!
          };
          
          const response = await apiRequest('POST', '/api/auth/simple-register', simpleData);
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro no registo simples');
          }
          
          const result = await response.json();
          toast({
            title: "Registo realizado com sucesso!",
            description: `Bem-vindo ${result.user?.name || 'ao Jikulumessu'}!`,
          });
          
          setTimeout(() => {
            window.location.href = "/profile";
          }, 1500);
        } else {
          // Full registration
          const userData: InsertUser = {
            ...formData,
            date_of_birth: formData.date_of_birth || '1990-01-01',
            availability: formData.availability || 'Segunda a Sexta, 8h-17h',
            services: formData.services || ['limpeza'],
            contract_type: formData.contract_type || 'diarista',
            phone: formData.phone || '900000000',
            province: formData.province || 'Luanda',
            municipality: formData.municipality || 'Luanda',
            neighborhood: formData.neighborhood || 'Centro'
          } as InsertUser;

          authMutation.mutate(userData);
        }
      }
    } catch (error) {
      toast({
        title: "Erro na autenticação",
        description: error.message || "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-[var(--angola-red)] hover:bg-[var(--angola-red)]/10 dark:text-[var(--angola-red)] dark:hover:bg-[var(--angola-red)]/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>

        <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-colors">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[var(--angola-red)] mb-2">
              {authMode === 'login' ? 'Entrar na Conta' : 'Registar Conta'}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              {authMode === 'login' 
                ? 'Escolha uma das três formas de entrar:'
                : 'Registe-se para divulgar os seus serviços'
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
                Registar
              </Button>
            </div>

            {/* Auth Method Selection */}
            <Tabs value={authMethod} onValueChange={(value) => switchAuthMethod(value as AuthMethod)}>
              <TabsList className="grid w-full grid-cols-3 dark:bg-gray-700 dark:border-gray-600">
                <TabsTrigger value="email" className="flex items-center gap-2 dark:data-[state=active]:bg-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4" />
                  E-mail
                </TabsTrigger>
                <TabsTrigger value="google" className="flex items-center gap-2 dark:data-[state=active]:bg-gray-600 dark:text-gray-300">
                  <FaGoogle className="h-4 w-4" />
                  Google
                </TabsTrigger>
                <TabsTrigger value="simple" className="flex items-center gap-2 dark:data-[state=active]:bg-gray-600 dark:text-gray-300">
                  <User className="h-4 w-4" />
                  Simples
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                {/* Email Method */}
                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="dark:text-gray-200">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="password" className="dark:text-gray-200">Palavra-passe</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Digite a sua palavra-passe"
                          className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${errors.password ? 'border-red-500' : ''}`}
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
                      {authMode === 'login' ? 'Entrar' : 'Registar'} com Google
                    </Button>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {authMode === 'login' 
                        ? 'Aceda à sua conta usando a sua conta Google'
                        : 'Após conectar com Google, completará o seu perfil'
                      }
                    </p>
                  </div>
                </TabsContent>

                {/* Simple Method */}
                <TabsContent value="simple" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name" className="dark:text-gray-200">Primeiro Nome</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        placeholder="João"
                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${errors.first_name ? 'border-red-500' : ''}`}
                      />
                      {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="last_name" className="dark:text-gray-200">Último Nome</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        placeholder="Silva"
                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${errors.last_name ? 'border-red-500' : ''}`}
                      />
                      {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                    </div>
                  </div>

                  {/* Phone field for simple registration */}
                  {authMode === 'register' && (
                    <div>
                      <Label htmlFor="phone" className="dark:text-gray-200">Telemóvel</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400">+244</span>
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone || ""}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="9XX XXX XXX"
                          className={`pl-14 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${errors.phone ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  )}

                  {authMode === 'login' && (
                    <div>
                      <Label htmlFor="simple_password">Palavra-passe</Label>
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

                    {/* Phone field for both email and simple registration */}
                    <div>
                      <Label htmlFor="reg_phone" className="dark:text-gray-200">Telemóvel</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400">+244</span>
                        </div>
                        <Input
                          id="reg_phone"
                          type="tel"
                          value={formData.phone || ""}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="9XX XXX XXX"
                          className={`pl-14 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${errors.phone ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Password for Simple Method */}
                    {authMethod === 'simple' && (
                      <div>
                        <Label htmlFor="reg_password">Palavra-passe</Label>
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