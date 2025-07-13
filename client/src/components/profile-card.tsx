import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Calendar, Eye, MessageCircle } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import RatingStars from "./rating-stars";
import FullSizeImageModal from "./full-size-image-modal";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types/user";

interface ProfileCardProps {
  user: User;
  onClick: () => void;
}

export default function ProfileCard({ user, onClick }: ProfileCardProps) {
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

  const handleSendMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    
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
    <Card className="profile-card overflow-hidden fade-in">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <Avatar 
            className="h-32 w-32 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
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
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
          {(user.average_rating || 0) > 0 ? (
            <RatingStars rating={user.average_rating || 0} size="sm" />
          ) : (
            <span className="text-sm text-gray-500">Sem avaliações</span>
          )}
        </div>
        
        <div className="text-gray-600 mb-3">
          <p className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-[var(--angola-red)]" />
            {user.province}, {user.municipality}
          </p>
          {user.neighborhood && (
            <p className="text-sm text-gray-500 ml-5">{user.neighborhood}</p>
          )}
          {user.address_complement && (
            <p className="text-sm text-gray-500 ml-5 mt-1">
              {user.address_complement}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {user.services.slice(0, 2).map((service) => (
            <span key={service} className="service-tag px-3 py-1 text-xs font-medium rounded-full">
              {service}
            </span>
          ))}
          {user.services.length > 2 && (
            <span className="bg-gray-200 text-gray-700 px-3 py-1 text-xs font-medium rounded-full">
              +{user.services.length - 2} mais
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-3 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {user.availability}
        </p>
        
        {/* Social Media Icons */}
        {(user.facebook_url || user.instagram_url || user.whatsapp_url) && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-500">Redes sociais:</span>
            {user.facebook_url && (
              <a 
                href={user.facebook_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FaFacebook className="h-4 w-4" />
              </a>
            )}
            {user.instagram_url && (
              <a 
                href={user.instagram_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FaInstagram className="h-4 w-4" />
              </a>
            )}
            {user.whatsapp_url && (
              <a 
                href={user.whatsapp_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FaWhatsapp className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={onClick}
            className="flex-1 bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={startConversationMutation.isPending}
            variant="outline"
            className="flex-1 sm:flex-none border-[var(--angola-red)] text-[var(--angola-red)] hover:bg-[var(--angola-red)] hover:text-white"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Mensagem
          </Button>
        </div>
      </CardContent>
      
      {showFullImage && user.profile_url && (
        <FullSizeImageModal
          imageUrl={user.profile_url}
          userName={user.name}
          onClose={() => setShowFullImage(false)}
        />
      )}
    </Card>
  );
}
