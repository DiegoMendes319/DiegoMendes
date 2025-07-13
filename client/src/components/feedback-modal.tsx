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
        title: "Campos obrigatórios",
        description: "Por favor, selecione uma categoria e escreva uma mensagem.",
        variant: "destructive",
      });
      return;
    }

    if (!user && (!firstName.trim() || !lastName.trim())) {
      toast({
        title: "Identificação necessária",
        description: "Por favor, forneça o seu nome e apelido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get admin user ID (we know it's admin-test-user from the initialized data)
      const adminUserId = 'admin-test-user';
      
      if (user) {
        // For authenticated users, create/get conversation and send message
        try {
          const conversationResponse = await apiRequest('/api/messages/conversations', 'POST', {
            participant_id: adminUserId
          });
          
          if (conversationResponse.ok) {
            const conversation = await conversationResponse.json();
            
            // Format message with category
            const categoryInfo = FEEDBACK_CATEGORIES.find(cat => cat.id === selectedCategory);
            const formattedMessage = `[${categoryInfo?.title}] ${message}`;
            
            const messageResponse = await apiRequest(`/api/messages/conversations/${conversation.id}/messages`, 'POST', {
              content: formattedMessage
            });
            
            if (messageResponse.ok) {
              toast({
                title: "Feedback enviado",
                description: "A sua mensagem foi enviada ao administrador.",
              });
              
              // Reset form
              setSelectedCategory("");
              setMessage("");
              onClose();
            } else {
              throw new Error('Erro ao enviar mensagem');
            }
          } else {
            throw new Error('Erro ao criar conversa');
          }
        } catch (error) {
          console.error('Erro específico no feedback:', error);
          throw error;
        }
      } else {
        // For non-authenticated users, still send through the old feedback system
        await apiRequest('/api/feedback', 'POST', {
          category: selectedCategory,
          message: message,
          sender_name: `${firstName} ${lastName}`,
          sender_email: null,
          user_id: null
        });
        
        toast({
          title: "Feedback enviado",
          description: "Obrigado pelo seu feedback. Será analisado em breve.",
        });
        
        // Reset form
        setSelectedCategory("");
        setMessage("");
        setFirstName("");
        setLastName("");
        onClose();
      }
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryData = FEEDBACK_CATEGORIES.find(cat => cat.id === selectedCategory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-red-600" />
            Feedback para o Jiku
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label htmlFor="category">Categoria do Feedback</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {FEEDBACK_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedCategoryData && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <selectedCategoryData.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCategoryData.description}
                </p>
              </div>
            )}
          </div>

          {/* User Identification (if not authenticated) */}
          {!user && (
            <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-amber-600" />
                <Label className="text-amber-800 dark:text-amber-200">
                  Identifique-se para enviar feedback
                </Label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Primeiro nome"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Apelido</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Apelido"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva a sua mensagem aqui..."
              className="min-h-[120px]"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3">
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
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  A enviar...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}