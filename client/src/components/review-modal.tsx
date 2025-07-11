import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import RatingStars from "./rating-stars";
import type { User, InsertReview } from "@shared/schema";
import { SERVICE_OPTIONS } from "@shared/constants";

interface ReviewModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
}

export default function ReviewModal({ user, isOpen, onClose, currentUserId }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [workQuality, setWorkQuality] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [valueForMoney, setValueForMoney] = useState(5);
  const [serviceType, setServiceType] = useState("");
  const [comment, setComment] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);
  
  // Identification system
  const [showIdentification, setShowIdentification] = useState(false);
  const [reviewerFirstName, setReviewerFirstName] = useState("");
  const [reviewerLastName, setReviewerLastName] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: InsertReview) => {
      const response = await apiRequest("POST", "/api/reviews", reviewData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Avaliação enviada!",
        description: "Obrigado pelo seu feedback.",
      });
      // Invalidate all related queries to update the UI immediately
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", user.id] });
      
      // Also force refetch to ensure immediate update
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["/api/reviews", user.id] });
        queryClient.refetchQueries({ queryKey: ["/api/users"] });
      }, 100);
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = () => {
    // If not authenticated, show identification form first
    if (!currentUserId) {
      setShowIdentification(true);
      return;
    }

    if (!serviceType) {
      toast({
        title: "Erro",
        description: "Por favor selecione o tipo de serviço.",
        variant: "destructive"
      });
      return;
    }

    const reviewData: InsertReview = {
      reviewer_id: currentUserId,
      reviewee_id: user.id,
      rating,
      comment: comment || null,
      service_type: serviceType,
      work_quality: workQuality,
      punctuality,
      communication,
      value_for_money: valueForMoney,
      would_recommend: wouldRecommend
    };

    createReviewMutation.mutate(reviewData);
  };

  const handleIdentificationSubmit = () => {
    if (!reviewerFirstName.trim() || !reviewerLastName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor preencha o primeiro e último nome.",
        variant: "destructive"
      });
      return;
    }

    if (!serviceType) {
      toast({
        title: "Erro",
        description: "Por favor selecione o tipo de serviço.",
        variant: "destructive"
      });
      return;
    }

    // Create temporary reviewer ID with names
    const reviewerId = `temp_${reviewerFirstName.trim()}_${reviewerLastName.trim()}_${Date.now()}`;

    const reviewData: InsertReview = {
      reviewer_id: reviewerId,
      reviewee_id: user.id,
      rating,
      comment: comment || null,
      service_type: serviceType,
      work_quality: workQuality,
      punctuality,
      communication,
      value_for_money: valueForMoney,
      would_recommend: wouldRecommend
    };

    createReviewMutation.mutate(reviewData);
  };

  const handleClose = () => {
    setRating(5);
    setWorkQuality(5);
    setPunctuality(5);
    setCommunication(5);
    setValueForMoney(5);
    setServiceType("");
    setComment("");
    setWouldRecommend(true);
    setShowIdentification(false);
    setReviewerFirstName("");
    setReviewerLastName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Avaliar {user.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Identification Form */}
          {showIdentification && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Identificação Necessária
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Para enviar uma avaliação, precisa de se identificar com o seu nome completo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reviewer-first-name">Primeiro Nome</Label>
                  <Input
                    id="reviewer-first-name"
                    value={reviewerFirstName}
                    onChange={(e) => setReviewerFirstName(e.target.value)}
                    placeholder="Ex: João"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reviewer-last-name">Último Nome</Label>
                  <Input
                    id="reviewer-last-name"
                    value={reviewerLastName}
                    onChange={(e) => setReviewerLastName(e.target.value)}
                    placeholder="Ex: Silva"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Overall Rating */}
          <div>
            <Label className="text-base font-semibold">Avaliação Geral</Label>
            <div className="mt-2">
              <RatingStars
                rating={rating}
                interactive={true}
                onRatingChange={setRating}
                size="lg"
              />
            </div>
          </div>

          {/* Service Type */}
          <div>
            <Label htmlFor="service-type" className="text-base font-semibold">
              Tipo de Serviço
            </Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_OPTIONS.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Detailed Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Qualidade do Trabalho</Label>
              <div className="mt-1">
                <RatingStars
                  rating={workQuality}
                  interactive={true}
                  onRatingChange={setWorkQuality}
                  size="md"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Pontualidade</Label>
              <div className="mt-1">
                <RatingStars
                  rating={punctuality}
                  interactive={true}
                  onRatingChange={setPunctuality}
                  size="md"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Comunicação</Label>
              <div className="mt-1">
                <RatingStars
                  rating={communication}
                  interactive={true}
                  onRatingChange={setCommunication}
                  size="md"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Custo-Benefício</Label>
              <div className="mt-1">
                <RatingStars
                  rating={valueForMoney}
                  interactive={true}
                  onRatingChange={setValueForMoney}
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-base font-semibold">
              Comentário (opcional)
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partilhe a sua experiência..."
              className="mt-2"
              rows={3}
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {comment.length}/500 caracteres
            </p>
          </div>

          {/* Recommendation */}
          <div className="flex items-center justify-between">
            <Label htmlFor="recommend" className="text-base font-semibold">
              Recomendaria este profissional?
            </Label>
            <Switch
              id="recommend"
              checked={wouldRecommend}
              onCheckedChange={setWouldRecommend}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            {showIdentification ? (
              <>
                <Button
                  onClick={handleIdentificationSubmit}
                  disabled={createReviewMutation.isPending}
                  className="flex-1 bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
                >
                  {createReviewMutation.isPending ? "A enviar..." : "Confirmar e Enviar Avaliação"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowIdentification(false)}
                  className="flex-1"
                >
                  Voltar
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSubmit}
                  disabled={createReviewMutation.isPending}
                  className="flex-1 bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
                >
                  {createReviewMutation.isPending ? "A enviar..." : "Enviar Avaliação"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}