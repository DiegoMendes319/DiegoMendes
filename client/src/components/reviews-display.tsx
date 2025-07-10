import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, Calendar, Star } from "lucide-react";
import RatingStars from "./rating-stars";
import type { Review, User } from "@shared/schema";

interface ReviewsDisplayProps {
  userId: string;
  user: User;
  showAddReview?: boolean;
  onAddReview?: () => void;
}

interface ReviewWithReviewer extends Review {
  reviewer: User;
}

export default function ReviewsDisplay({ userId, user, showAddReview = false, onAddReview }: ReviewsDisplayProps) {
  const [showAll, setShowAll] = useState(false);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["/api/reviews", userId],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?reviewee_id=${userId}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Avaliações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
  const averageRating = user.average_rating || 0;
  const totalReviews = user.total_reviews || 0;

  const getRatingBreakdown = () => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review: Review) => {
      breakdown[review.rating as keyof typeof breakdown]++;
    });
    return breakdown;
  };

  const breakdown = getRatingBreakdown();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Avaliações ({totalReviews})
          </div>
          {showAddReview && (
            <Button
              onClick={onAddReview}
              size="sm"
              className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
            >
              Avaliar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalReviews === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Ainda não há avaliações para este profissional.</p>
            {showAddReview && (
              <p className="text-sm mt-2">Seja o primeiro a avaliar!</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Rating Summary */}
            <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                <RatingStars rating={averageRating} size="sm" />
                <div className="text-sm text-gray-500 mt-1">{totalReviews} avaliações</div>
              </div>
              
              {/* Rating Breakdown */}
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-3">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${totalReviews > 0 ? (breakdown[rating as keyof typeof breakdown] / totalReviews) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <span className="w-8 text-right">{breakdown[rating as keyof typeof breakdown]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {displayedReviews.map((review: ReviewWithReviewer) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.reviewer?.profile_url || undefined} />
                      <AvatarFallback>
                        {review.reviewer?.first_name?.[0]}{review.reviewer?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium">{review.reviewer?.name || 'Utilizador'}</span>
                        <RatingStars rating={review.rating} size="sm" />
                        <Badge variant="secondary" className="text-xs">
                          {review.service_type}
                        </Badge>
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                      )}
                      
                      {/* Detailed Ratings */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="min-w-0 flex-shrink-0">Qualidade:</span>
                          <RatingStars rating={review.work_quality} size="sm" />
                          <span className="ml-1 text-gray-500">{review.work_quality.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="min-w-0 flex-shrink-0">Pontualidade:</span>
                          <RatingStars rating={review.punctuality} size="sm" />
                          <span className="ml-1 text-gray-500">{review.punctuality.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="min-w-0 flex-shrink-0">Comunicação:</span>
                          <RatingStars rating={review.communication} size="sm" />
                          <span className="ml-1 text-gray-500">{review.communication.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="min-w-0 flex-shrink-0">Custo-Benefício:</span>
                          <RatingStars rating={review.value_for_money} size="sm" />
                          <span className="ml-1 text-gray-500">{review.value_for_money.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.created_at).toLocaleDateString('pt-PT')}
                        </div>
                        {review.would_recommend && (
                          <div className="flex items-center gap-1 text-green-600">
                            <ThumbsUp className="h-3 w-3" />
                            Recomenda
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {reviews.length > 3 && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(!showAll)}
                  size="sm"
                >
                  {showAll ? "Ver menos" : `Ver todas (${reviews.length})`}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}