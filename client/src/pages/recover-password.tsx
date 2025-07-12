import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function RecoverPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await apiRequest('/api/auth/recover-password', 'POST', { email });
      
      setIsSubmitted(true);
      toast({
        title: "Pedido enviado",
        description: "Se o email existir, receberá as instruções de recuperação",
      });
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
              Se o email <strong>{email}</strong> existir no nosso sistema, receberá as instruções de recuperação de palavra-passe.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Verifique a sua caixa de entrada e pasta de spam.
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                required
                className="w-full"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Introduza o email associado à sua conta
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  A enviar...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Instruções
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lembrou-se da palavra-passe?{' '}
              <button
                onClick={() => setLocation('/login')}
                className="text-[var(--angola-red)] hover:text-[var(--angola-red)]/80 font-medium"
              >
                Fazer Login
              </button>
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Nota:</strong> Por motivos de segurança, será sempre apresentada a mesma mensagem, 
              mesmo que o email não exista no sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}