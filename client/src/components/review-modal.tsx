import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import RatingStars from "./rating-stars";
import type { User, InsertReview } from "@shared/schema";

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
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
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
    if (!serviceType) {
      toast({
        title: "Erro",
        description: "Por favor selecione o tipo de serviço.",
        variant: "destructive"
      });
      return;
    }

    // Generate a temporary reviewer ID if not authenticated
    const reviewerId = currentUserId || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
                <SelectItem value="limpeza">Limpeza</SelectItem>
                <SelectItem value="cozinha">Cozinha</SelectItem>
                <SelectItem value="lavanderia">Lavanderia</SelectItem>
                <SelectItem value="jardinagem">Jardinagem</SelectItem>
                <SelectItem value="cuidados">Cuidados</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}