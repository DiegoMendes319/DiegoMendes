import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase-client";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Star, 
  Edit, 
  LogOut,
  Home,
  Briefcase,
  Clock,
  DollarSign
} from "lucide-react";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, loading, signOut } = useSupabaseAuth();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/auth");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, loading, setLocation]);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o perfil.",
          variant: "destructive",
        });
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil.",
        variant: "destructive",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Até à próxima!",
      });
      setLocation("/");
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--angola-red)] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">A carregar perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userInitials = profile 
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`
    : user.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-[var(--angola-red)] hover:bg-[var(--angola-red)]/10"
          >
            <Home className="h-4 w-4 mr-2" />
            Página Inicial
          </Button>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-[var(--angola-red)] text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl text-[var(--angola-red)]">
                  {profile ? `${profile.first_name} ${profile.last_name}` : user.email}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </p>
                {profile?.rating && (
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-semibold">{profile.rating.toFixed(1)}</span>
                    <span className="text-gray-500 ml-1">({profile.review_count} avaliações)</span>
                  </div>
                )}
              </div>
              <Button className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90">
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile?.date_of_birth && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{new Date(profile.date_of_birth).toLocaleDateString('pt-PT')}</span>
                  </div>
                )}
                {(profile?.province || profile?.municipality || profile?.neighborhood) && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{[profile?.neighborhood, profile?.municipality, profile?.province].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services */}
            {profile?.services && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Serviços
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.services.map((service: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Professional Info */}
          <div className="md:col-span-2 space-y-4">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="availability">Disponibilidade</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Profissionais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile?.contract_type && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tipo de Contrato</label>
                        <p className="capitalize">{profile.contract_type}</p>
                      </div>
                    )}
                    {profile?.hourly_rate && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tarifa por Hora</label>
                        <p className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {profile.hourly_rate.toLocaleString('pt-PT')} AOA
                        </p>
                      </div>
                    )}
                    {profile?.about_me && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Sobre Mim</label>
                        <p className="text-gray-700 dark:text-gray-300">{profile.about_me}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="availability">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Disponibilidade
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">
                      {profile?.availability || 'Disponibilidade não especificada'}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      Avaliações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        {profile?.review_count > 0 
                          ? `${profile.review_count} avaliação${profile.review_count > 1 ? 'ões' : ''}`
                          : 'Ainda não tem avaliações'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}