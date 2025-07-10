import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  className
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(maxRating)].map((_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= rating;
        const isPartial = starRating - 0.5 <= rating && starRating > rating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleStarClick(starRating)}
            className={cn(
              "relative",
              interactive && "hover:scale-110 transition-transform cursor-pointer",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled 
                  ? "fill-yellow-400 text-yellow-400" 
                  : isPartial
                  ? "fill-yellow-200 text-yellow-400"
                  : "fill-gray-200 text-gray-300"
              )}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600 font-medium">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}