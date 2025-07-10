import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Calendar, FileText, Phone, User as UserIcon, Facebook, Instagram, Music, ExternalLink } from "lucide-react";
import RatingStars from "./rating-stars";
import ReviewsDisplay from "./reviews-display";
import ReviewModal from "./review-modal";
import { useAuth } from "@/hooks/use-auth";
import type { User } from "@shared/schema";

interface ProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onContact: () => void;
}

export default function ProfileModal({ user, isOpen, onClose, onContact }: ProfileModalProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { user: currentUser } = useAuth();

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
            <Avatar className="h-32 w-32 mx-auto mb-4 ring-4 ring-[var(--angola-yellow)]">
              <AvatarImage src={user.profile_url || undefined} alt={user.name} />
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
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-[var(--angola-red)]" />
                  {user.province}, {user.municipality}, {user.neighborhood}
                </p>
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

          {/* Social Media Links */}
          {(user.facebook_url || user.instagram_url || user.tiktok_url) && (
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Redes Sociais</h5>
              <div className="flex flex-wrap gap-3">
                {user.facebook_url && (
                  <a 
                    href={user.facebook_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {user.instagram_url && (
                  <a 
                    href={user.instagram_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {user.tiktok_url && (
                  <a 
                    href={user.tiktok_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Music className="h-4 w-4" />
                    TikTok
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
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

          {/* Contact Button - Always visible at bottom */}
          <div className="flex justify-center pt-4 border-t">
            <Button 
              onClick={onContact}
              className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90 text-white px-8 py-3 text-lg font-semibold rounded-lg"
            >
              <Phone className="h-5 w-5 mr-2" />
              Entrar em Contato
            </Button>
          </div>
        </div>
        
        <ReviewModal
          user={user}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          currentUserId={currentUser?.id}
        />
      </DialogContent>
    </Dialog>
  );
}
