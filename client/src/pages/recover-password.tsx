import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, ArrowLeft, CheckCircle, Phone, Key } from "lucide-react";

export default function RecoverPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [recoveryData, setRecoveryData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("request");

  const handleRecoveryRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest('/api/auth/recover-password', 'POST', { 
        email: email || undefined, 
        phone: phone || undefined 
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          setRecoveryData(data);
          setActiveTab("reset");
          toast({
            title: "Token gerado",
            description: `Token de recuperação: ${data.token}`,
          });
        } else {
          setIsSubmitted(true);
          toast({
            title: "Pedido enviado",
            description: data.message,
          });
        }
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar pedido de recuperação",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As palavras-passe não coincidem",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await apiRequest('/api/auth/reset-password', 'POST', {
        token,
        newPassword
      });
      
      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Palavra-passe redefinida com sucesso",
        });
        setTimeout(() => setLocation("/login"), 2000);
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao redefinir palavra-passe",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-[var(--angola-red)]">
              Pedido Enviado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Se o contacto existir no nosso sistema, receberá as instruções de recuperação de palavra-passe.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button
                onClick={() => setLocation("/login")}
                className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90 text-white"
              >
                Ir para Login
              </Button>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                  setPhone("");
                }}
                variant="outline"
                className="border-[var(--angola-red)] text-[var(--angola-red)] hover:bg-[var(--angola-red)]/10"
              >
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button
            variant="ghost"
            onClick={() => setLocation("/login")}
            className="self-start mb-4 text-[var(--angola-red)] hover:bg-[var(--angola-red)]/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Login
          </Button>
          <CardTitle className="text-2xl font-bold text-center text-[var(--angola-red)]">
            Recuperar Palavra-passe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">Solicitar Token</TabsTrigger>
              <TabsTrigger value="reset">Redefinir Senha</TabsTrigger>
            </TabsList>
            
            <TabsContent value="request" className="space-y-4">
              <form onSubmit={handleRecoveryRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email (opcional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    className="w-full"
                  />
                </div>
                
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  ou
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Número de Telefone (opcional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+244 900 000 000"
                    className="w-full"
                  />
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Introduza o email ou número de telefone associado à sua conta
                </p>
                
                <Button
                  type="submit"
                  className="w-full bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90 text-white"
                  disabled={isSubmitting || (!email && !phone)}
                >
                  {isSubmitting ? 'Enviando...' : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Gerar Token de Recuperação
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="reset" className="space-y-4">
              {recoveryData && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-200">
                      Token Gerado
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Token: <strong>{recoveryData.token}</strong>
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Método: {recoveryData.method === 'email' ? 'Email' : 'SMS'}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Expira em: {recoveryData.expiresIn}
                  </p>
                </div>
              )}
              
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Token de Recuperação</Label>
                  <Input
                    id="token"
                    name="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="123456"
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Palavra-passe</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nova palavra-passe"
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Palavra-passe</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar nova palavra-passe"
                    required
                    className="w-full"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processando...' : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Redefinir Palavra-passe
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}