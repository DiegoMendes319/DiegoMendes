import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Calendar, FileText, Phone, User as UserIcon, MessageCircle } from "lucide-react";
import RatingStars from "./rating-stars";
import ReviewsDisplay from "./reviews-display";
import ReviewModal from "./review-modal";
import FullSizeImageModal from "./full-size-image-modal";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

interface ProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onContact: () => void;
}

export default function ProfileModal({ user, isOpen, onClose, onContact }: ProfileModalProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const { user: currentUser } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  // Start conversation mutation
  const startConversationMutation = useMutation({
    mutationFn: async (participantId: string) => {
      return await apiRequest('/api/messages/conversations', 'POST', { participant_id: participantId });
    },
    onSuccess: (conversation) => {
      setLocation('/messages');
      onClose();
      toast({
        title: "Conversa iniciada",
        description: "Pode agora comunicar com este utilizador.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a conversa.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!currentUser) {
      toast({
        title: "Autenticação necessária",
        description: "Faça login para enviar mensagens.",
        variant: "destructive",
      });
      return;
    }

    if (currentUser.id === user.id) {
      toast({
        title: "Ação não permitida",
        description: "Não pode enviar mensagens para si mesmo.",
        variant: "destructive",
      });
      return;
    }

    startConversationMutation.mutate(user.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Detalhes do Perfil
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <Avatar 
              className="h-32 w-32 mx-auto mb-4 ring-4 ring-[var(--angola-yellow)] cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => {
                if (user.profile_url) {
                  setShowFullImage(true);
                }
              }}
            >
              <AvatarImage 
                src={user.profile_url || undefined} 
                alt={user.name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h4 className="text-2xl font-bold text-gray-900">{user.name}</h4>
            <div className="flex items-center justify-center mt-2">
              {(user.average_rating || 0) > 0 ? (
                <div className="flex items-center gap-2">
                  <RatingStars rating={user.average_rating || 0} size="md" />
                  <span className="text-sm text-gray-600">
                    ({user.total_reviews || 0} avaliações)
                  </span>
                </div>
              ) : (
                <span className="text-gray-500">Sem avaliações</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-[var(--angola-red)]" />
                Informações Pessoais
              </h5>
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-[var(--angola-red)]" />
                  {user.age} anos
                </p>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-[var(--angola-red)] mt-0.5" />
                  <div>
                    <p>{user.province}, {user.municipality}, {user.neighborhood}</p>
                    {user.address_complement && (
                      <p className="text-xs text-gray-500 mt-1">{user.address_complement}</p>
                    )}
                  </div>
                </div>
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-[var(--angola-red)]" />
                  Membro desde {new Date(user.created_at).getFullYear()}
                </p>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-[var(--angola-red)]" />
                Disponibilidade
              </h5>
              <div className="space-y-2 text-sm">
                <p>{user.availability}</p>
                <p className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-[var(--angola-red)]" />
                  Tipo: {user.contract_type}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Serviços Oferecidos</h5>
            <div className="flex flex-wrap gap-2">
              {user.services.map((service) => (
                <span key={service} className="service-tag px-3 py-1 text-sm font-medium rounded-full">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* About Me Section */}
          {user.about_me && (
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Sobre Mim</h5>
              <p className="text-gray-700 leading-relaxed">{user.about_me}</p>
            </div>
          )}



          {/* Reviews Section - Always visible */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Star className="h-5 w-5 mr-2 text-[var(--angola-red)]" />
              Avaliações
            </h5>
            <ReviewsDisplay 
              userId={user.id} 
              user={user}
              showAddReview={true}
              onAddReview={() => setShowReviewModal(true)}
            />
          </div>

          {/* Action Buttons - Always visible at bottom */}
          <div className="flex justify-center gap-4 pt-4 border-t">
            <Button 
              onClick={onContact}
              className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90 text-white px-6 py-3 text-lg font-semibold rounded-lg"
              data-tutorial="contact-btn"
            >
              <Phone className="h-5 w-5 mr-2" />
              Entrar em Contato
            </Button>
            
            {currentUser && currentUser.id !== user.id && (
              <Button 
                onClick={handleSendMessage}
                disabled={startConversationMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-semibold rounded-lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {startConversationMutation.isPending ? 'A processar...' : 'Enviar Mensagem'}
              </Button>
            )}
          </div>
        </div>
        
        <ReviewModal
          user={user}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          currentUserId={currentUser?.id}
        />
      </DialogContent>
      
      {showFullImage && user.profile_url && (
        <FullSizeImageModal
          imageUrl={user.profile_url}
          userName={user.name}
          onClose={() => setShowFullImage(false)}
        />
      )}
    </Dialog>
  );
}
