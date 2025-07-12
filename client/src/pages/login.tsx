import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Mail, User, Eye, EyeOff, ArrowLeft, LogIn } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { apiRequest } from "@/lib/queryClient";

type AuthMethod = 'email' | 'google' | 'simple';

interface FormData {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (authMethod === 'email') {
      if (!formData.email?.trim()) {
        newErrors.email = 'Email é obrigatório';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
    } else if (authMethod === 'simple') {
      if (!formData.first_name?.trim()) {
        newErrors.first_name = 'Primeiro nome é obrigatório';
      }
      if (!formData.last_name?.trim()) {
        newErrors.last_name = 'Último nome é obrigatório';
      }
    }

    if (authMethod !== 'google' && !formData.password?.trim()) {
      newErrors.password = 'Palavra-passe é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (authMethod === 'email' && data.email && data.password) {
        const response = await apiRequest('POST', '/api/auth/login', {
          email: data.email,
          password: data.password
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro no login');
        }
        return response.json();
      } else if (authMethod === 'simple' && data.first_name && data.last_name && data.password) {
        const response = await apiRequest('POST', '/api/auth/simple-login', {
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro no login');
        }
        return response.json();
      }
      throw new Error('Método de login inválido');
    },
    onSuccess: async (data) => {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta, ${data.user?.name || ''}!`,
      });
      
      // Refresh user context after successful login
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = "/profile";
    },
    onError: (error) => {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais incorretas.",
        variant: "destructive",
      });
    },
  });

  const handleGoogleAuth = async () => {
    toast({
      title: "Funcionalidade em Desenvolvimento",
      description: "O login via Google estará disponível em breve.",
      variant: "default",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (authMethod === 'google') {
      handleGoogleAuth();
      return;
    }

    loginMutation.mutate(formData);
  };

  const switchAuthMethod = (method: AuthMethod) => {
    setAuthMethod(method);
    setFormData({});
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      <div className="max-w-md mx-auto">
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

        <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[var(--angola-red)] mb-2">
              Entrar na Conta
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              Aceda à sua conta do Jikulumessu
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
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
                <TabsContent value="email" className="space-y-4">
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
                    <Label htmlFor="password">Palavra-passe</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Digite a sua palavra-passe"
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
                </TabsContent>

                <TabsContent value="google" className="space-y-4">
                  <div className="text-center">
                    <Button
                      type="button"
                      onClick={handleGoogleAuth}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <FaGoogle className="h-4 w-4 mr-2" />
                      Entrar com Google
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="simple" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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

                  <div>
                    <Label htmlFor="simple_password">Palavra-passe</Label>
                    <div className="relative">
                      <Input
                        id="simple_password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Digite a sua palavra-passe"
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
                </TabsContent>

                {authMethod !== 'google' && (
                  <Button
                    type="submit"
                    className="w-full bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Processando...' : 'Entrar'}
                  </Button>
                )}
              </form>
            </Tabs>

            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              Não tem conta?{" "}
              <Link href="/auth" className="text-[var(--angola-red)] hover:underline">
                Registar aqui
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}