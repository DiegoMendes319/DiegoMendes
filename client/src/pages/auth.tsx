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
import { X, UserPlus, LogIn, Home } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { InsertUser } from "@shared/schema";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<Partial<InsertUser>>({
    services: [],
  });
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      // TODO: Implement actual authentication with Supabase
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta.",
      });
      setLocation("/");
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
      setIsLogin(true);
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      if (formData.email && formData.password) {
        loginMutation.mutate({
          email: formData.email,
          password: formData.password,
        });
      }
    } else {
      const requiredFields = ['name', 'email', 'phone', 'age', 'province', 'municipality', 'neighborhood', 'contract_type', 'availability'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof InsertUser]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        });
        return;
      }
      
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isLogin ? "Entrar na Conta" : "Criar Conta"}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      required
                      min={18}
                      max={70}
                      value={formData.age || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      placeholder="Sua idade"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seu.email@exemplo.com"
              />
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+244 923 456 789"
                />
              </div>
            )}

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            {!isLogin && (
              <>
                <LocationSelector onLocationChange={handleLocationChange} />
                
                <div>
                  <Label htmlFor="contract_type">Tipo de Contrato</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, contract_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diarista">Diarista</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="verbal">Acordo Verbal</SelectItem>
                      <SelectItem value="escrito">Contrato Escrito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Serviços Oferecidos</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['limpeza', 'cozinha', 'lavanderia', 'jardinagem'].map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={formData.services?.includes(service)}
                          onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                        />
                        <Label htmlFor={service} className="text-sm">
                          {service.charAt(0).toUpperCase() + service.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="availability">Disponibilidade</Label>
                  <Textarea
                    id="availability"
                    required
                    value={formData.availability || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                    placeholder="Ex: Segunda a Sexta, 8h às 17h"
                    rows={3}
                  />
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
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[var(--angola-red)] hover:text-[var(--angola-red)]/90 font-medium"
              >
                {isLogin ? "Cadastre-se" : "Faça login"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
