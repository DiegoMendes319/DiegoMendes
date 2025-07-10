import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Calendar, Eye } from "lucide-react";
import type { User } from "@/types/user";

interface ProfileCardProps {
  user: User;
  onClick: () => void;
}

export default function ProfileCard({ user, onClick }: ProfileCardProps) {
  return (
    <Card className="profile-card overflow-hidden fade-in">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <Avatar className="h-32 w-32">
            <AvatarImage src={user.profile_url || undefined} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 mr-1 fill-current" />
            <span className="text-sm font-medium">4.9</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-[var(--angola-red)]" />
          {user.province}, {user.municipality}
        </p>
        
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
        
        <p className="text-sm text-gray-600 mb-4 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {user.availability}
        </p>
        
        <Button 
          onClick={onClick}
          className="w-full bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  );
}
