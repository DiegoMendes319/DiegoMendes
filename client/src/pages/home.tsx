import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import ProfileCard from "@/components/profile-card";
import LocationSelector from "@/components/location-selector";
import SkeletonLoader from "@/components/skeleton-loader";
import ProfileModal from "@/components/profile-modal";
import ContactModal from "@/components/contact-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Users, Check, Filter, Home as HomeIcon } from "lucide-react";
import type { User } from "@/types/user";

interface SearchFilters {
  lat?: number;
  lng?: number;
  province?: string;
  municipality?: string;
  neighborhood?: string;
  service?: string;
  contract_type?: string;
}

export default function Home() {
  const [showGeolocationPrompt, setShowGeolocationPrompt] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { data: users, isLoading, refetch } = useQuery<User[]>({
    queryKey: ['/api/users', searchFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
      const response = await fetch(`/api/users?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });

  const handleGeolocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSearchFilters(prev => ({ ...prev, lat: latitude, lng: longitude }));
          setShowGeolocationPrompt(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setShowGeolocationPrompt(false);
        }
      );
    } else {
      console.error('Geolocation not supported');
      setShowGeolocationPrompt(false);
    }
  };

  const handleManualSearch = () => {
    setShowGeolocationPrompt(false);
  };

  const handleLocationChange = (location: { province?: string; municipality?: string; neighborhood?: string }) => {
    setSearchFilters(prev => ({ ...prev, ...location }));
  };

  const handleServiceFilter = (service: string) => {
    setSearchFilters(prev => ({ ...prev, service: service === "todos" ? undefined : service }));
  };

  const handleContractFilter = (contract_type: string) => {
    setSearchFilters(prev => ({ ...prev, contract_type: contract_type === "todos" ? undefined : contract_type }));
  };

  const handleProfileClick = (profile: User) => {
    setSelectedProfile(profile);
  };

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="hero-pattern absolute inset-0"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Encontre os Melhores
              <span className="text-[var(--angola-red)]"> Diaristas</span>
              <br />em Angola
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Conectando famílias com profissionais domésticos qualificados em todo o país. 
              Seguro, confiável e próximo de você.
            </p>
            
            {/* Geolocation Prompt */}
            {showGeolocationPrompt && (
              <Card className="max-w-md mx-auto mb-8 bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-[var(--angola-red)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Permitir Localização?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Encontre diaristas próximos a você automaticamente
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={handleGeolocationRequest} className="flex-1 bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90">
                      <Check className="h-4 w-4 mr-2" />
                      Permitir
                    </Button>
                    <Button variant="outline" onClick={handleManualSearch} className="flex-1">
                      <Search className="h-4 w-4 mr-2" />
                      Buscar Manual
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-6 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
              <Filter className="h-6 w-6 text-[var(--angola-red)]" />
              Filtrar Diaristas
            </h2>
            
            <div className="space-y-6">
              <LocationSelector onLocationChange={handleLocationChange} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Serviço
                  </label>
                  <Select onValueChange={handleServiceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os serviços" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os serviços</SelectItem>
                      <SelectItem value="limpeza">Limpeza Geral</SelectItem>
                      <SelectItem value="cozinha">Cozinha</SelectItem>
                      <SelectItem value="lavanderia">Lavanderia</SelectItem>
                      <SelectItem value="jardinagem">Jardinagem</SelectItem>
                      <SelectItem value="cuidados">Cuidados Pessoais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Contrato
                  </label>
                  <Select onValueChange={handleContractFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os contratos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os contratos</SelectItem>
                      <SelectItem value="diarista">Diarista</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="verbal">Acordo Verbal</SelectItem>
                      <SelectItem value="escrito">Contrato Escrito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="text-center">
                <Button onClick={() => refetch()} className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Diaristas
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-8 w-8 text-[var(--angola-red)]" />
              Diaristas Disponíveis
            </h2>
            <div className="text-sm text-gray-600">
              <span>{users?.length || 0} profissionais encontrados</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users?.map((user) => (
                <ProfileCard
                  key={user.id}
                  user={user}
                  onClick={() => handleProfileClick(user)}
                />
              ))}
            </div>
          )}

          {!isLoading && users?.length === 0 && (
            <div className="text-center py-12">
              <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum profissional encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar seus filtros ou expandir a área de busca.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {selectedProfile && (
        <ProfileModal
          user={selectedProfile}
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onContact={handleContactClick}
        />
      )}

      {selectedProfile && (
        <ContactModal
          user={selectedProfile}
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
}
