import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Send, MessageCircle, AlertTriangle, Heart, Lightbulb, Bug, User } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEEDBACK_CATEGORIES = [
  {
    id: "complaint_user",
    title: "Reclamação sobre Utilizador",
    description: "Denunciar comportamento inadequado de outros utilizadores",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-800"
  },
  {
    id: "site_evaluation",
    title: "Avaliação do Site",
    description: "Partilhar a sua opinião sobre o funcionamento da plataforma",
    icon: MessageCircle,
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: "compliment",
    title: "Elogio",
    description: "Elogiar o site ou alguma funcionalidade específica",
    icon: Heart,
    color: "bg-green-100 text-green-800"
  },
  {
    id: "suggestion",
    title: "Sugestão de Melhoria",
    description: "Propor melhorias ou novas funcionalidades",
    icon: Lightbulb,
    color: "bg-yellow-100 text-yellow-800"
  },
  {
    id: "bug_report",
    title: "Reportar Problema",
    description: "Comunicar erros ou problemas técnicos",
    icon: Bug,
    color: "bg-orange-100 text-orange-800"
  },
  {
    id: "other",
    title: "Outro",
    description: "Qualquer outro tipo de feedback ou preocupação",
    icon: MessageCircle,
    color: "bg-gray-100 text-gray-800"
  }
];

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory || !message.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma categoria e escreva a sua mensagem",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        category: selectedCategory,
        message: message.trim(),
        senderName: user ? user.name : (firstName && lastName ? `${firstName} ${lastName}` : null),
        senderEmail: user?.email || null,
        senderId: user?.id || null,
        isAuthenticated: !!user
      };

      const response = await apiRequest('/api/feedback', 'POST', feedbackData);
      
      if (response.ok) {
        toast({
          title: "Feedback enviado",
          description: "A sua mensagem foi enviada com sucesso ao Jiku!",
        });
        
        // Reset form
        setSelectedCategory("");
        setMessage("");
        setFirstName("");
        setLastName("");
        onClose();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Erro ao enviar feedback");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar feedback",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryData = FEEDBACK_CATEGORIES.find(cat => cat.id === selectedCategory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[var(--angola-red)]">
            <MessageCircle className="w-5 h-5" />
            Enviar Feedback ao Jiku (Administrador do Site)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Categoria do Feedback</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selecione a categoria que melhor descreve o tipo de feedback que deseja enviar:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FEEDBACK_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedCategory === category.id
                        ? "border-[var(--angola-red)] bg-red-50 dark:bg-red-900/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-[var(--angola-red)] mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{category.title}</span>
                          <Badge className={`text-xs ${category.color}`}>
                            {category.id.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message Form */}
          {selectedCategory && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {selectedCategoryData && <selectedCategoryData.icon className="w-4 h-4" />}
                  <span className="font-medium text-sm">
                    {selectedCategoryData?.title}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedCategoryData?.description}
                </p>
              </div>

              {/* Identification (optional for non-authenticated users) */}
              {!user && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Identificação (Opcional)
                  </Label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Pode optar por se identificar ou enviar o feedback de forma anónima
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName" className="text-xs">Primeiro Nome</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Opcional"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-xs">Último Nome</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Opcional"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Authenticated user info */}
              {user && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Conectado como: {user.name}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    O seu nome será automaticamente incluído no feedback
                  </p>
                </div>
              )}

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Mensagem *
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva aqui a sua mensagem para o Jiku..."
                  className="min-h-[120px] text-sm"
                  required
                />
                <p className="text-xs text-gray-500">
                  Seja específico e detalhado para ajudar o Jiku a compreender melhor o seu feedback
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedCategory || !message.trim()}
                  className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Feedback
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}