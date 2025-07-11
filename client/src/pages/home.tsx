import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import ProfileCard from "@/components/profile-card";
import LocationSelector from "@/components/location-selector";
import SkeletonLoader from "@/components/skeleton-loader";
import ProfileModal from "@/components/profile-modal";
import ContactModal from "@/components/contact-modal";
import GuidedTutorial from "@/components/guided-tutorial";
import { useOnboarding } from "@/hooks/use-onboarding";
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
  const { showOnboarding, completeOnboarding, closeOnboarding } = useOnboarding();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              Encontre
              <span className="text-[var(--angola-red)]"> Prestadores de Serviços</span>
              <br />na sua Região
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Conectamos pessoas com prestadores de serviços domésticos na sua região — uma plataforma de intermediação próxima de si.
            </p>
            
            {/* Geolocation Prompt - Fixed responsive container */}
            {showGeolocationPrompt && (
              <div className="w-full max-w-2xl mx-auto mb-8 px-4">
                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 shadow-lg overflow-hidden">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-center mb-4">
                      <MapPin className="h-6 w-6 md:h-8 md:w-8 text-[var(--angola-red)]" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                      Como pretende procurar?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                      Escolha a forma de encontrar prestadores de serviços próximos de si
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-full">
                      <Button 
                        onClick={handleGeolocationRequest} 
                        className="flex-1 min-w-0 bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90 text-sm md:text-base py-2 md:py-3 px-2 md:px-4"
                      >
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate text-center flex-1">Permitir localização automática</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleManualSearch} 
                        className="flex-1 min-w-0 border-[var(--angola-red)] text-[var(--angola-red)] hover:bg-[var(--angola-red)] hover:text-white dark:border-[var(--angola-red)] dark:text-[var(--angola-red)] text-sm md:text-base py-2 md:py-3 px-2 md:px-4"
                      >
                        <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate text-center flex-1">Procurar manualmente</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6 md:py-8 transition-colors" data-tutorial="search-filters">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-4 md:p-6 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center flex items-center justify-center gap-2 flex-wrap">
              <Filter className="h-5 w-5 md:h-6 md:w-6 text-[var(--angola-red)]" />
              <span>Filtrar Prestadores</span>
            </h2>
            
            <div className="space-y-4 md:space-y-6">
              <LocationSelector onLocationChange={handleLocationChange} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Serviço
                  </label>
                  <Select onValueChange={handleServiceFilter}>
                    <SelectTrigger className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                      <SelectValue placeholder="Todos os serviços" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value="todos">Todos os serviços</SelectItem>
                      <SelectItem value="limpeza">Limpeza Doméstica</SelectItem>
                      <SelectItem value="cozinha">Cozinhar</SelectItem>
                      <SelectItem value="passadoria">Passar Roupa</SelectItem>
                      <SelectItem value="jardinagem">Jardinagem</SelectItem>
                      <SelectItem value="cuidado_criancas">Cuidado de Crianças</SelectItem>
                      <SelectItem value="cuidado_idosos">Cuidado de Idosos</SelectItem>
                      <SelectItem value="compras">Fazer Compras</SelectItem>
                      <SelectItem value="organizacao">Organização</SelectItem>
                      <SelectItem value="lavanderia">Lavanderia</SelectItem>
                      <SelectItem value="baba">Babá</SelectItem>
                      <SelectItem value="decoracao_eventos">Decoração de Eventos</SelectItem>
                      <SelectItem value="taxista_automovel">Taxista de Automóvel</SelectItem>
                      <SelectItem value="taxista_mota">Taxista de Mota</SelectItem>
                      <SelectItem value="cobrador_taxi">Cobrador de Táxi</SelectItem>
                      <SelectItem value="seguranca">Segurança</SelectItem>
                      <SelectItem value="pintura">Pintura</SelectItem>
                      <SelectItem value="carpintaria">Carpintaria</SelectItem>
                      <SelectItem value="electricista">Electricista</SelectItem>
                      <SelectItem value="canalizacao">Canalização</SelectItem>
                      <SelectItem value="costura">Costura</SelectItem>
                      <SelectItem value="cabeleireiro">Cabeleireiro</SelectItem>
                      <SelectItem value="manicure">Manicure</SelectItem>
                      <SelectItem value="massagista">Massagista</SelectItem>
                      <SelectItem value="professor_particular">Professor Particular</SelectItem>
                      <SelectItem value="animador_festas">Animador de Festas</SelectItem>
                      <SelectItem value="fotografo">Fotógrafo</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Contrato
                  </label>
                  <Select onValueChange={handleContractFilter}>
                    <SelectTrigger className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                      <SelectValue placeholder="Todos os contratos" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value="todos">Todos os contratos</SelectItem>
                      <SelectItem value="tempo_inteiro">Tempo Inteiro</SelectItem>
                      <SelectItem value="meio_periodo">Meio Período</SelectItem>
                      <SelectItem value="por_horas">Por Horas</SelectItem>
                      <SelectItem value="fins_semana">Fins de Semana</SelectItem>
                      <SelectItem value="eventual">Eventual</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="text-center">
                <Button onClick={() => refetch()} className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90 w-full sm:w-auto px-6 py-3 text-sm md:text-base">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Prestadores
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 md:py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-[var(--angola-red)]" />
              Prestadores Disponíveis
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
              <span>{users?.length || 0} profissionais encontrados</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-tutorial="profiles-area">
              {[...Array(6)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-tutorial="profiles-area">
              {users?.map((user) => (
                <div key={user.id} data-tutorial="profile-card">
                  <ProfileCard
                    user={user}
                    onClick={() => handleProfileClick(user)}
                  />
                </div>
              ))}
              {users?.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <div className="mb-4">
                    <HomeIcon className="h-12 w-12 mx-auto text-gray-400" />
                  </div>
                  <p className="text-lg">Nenhum prestador encontrado na sua região</p>
                  <p className="text-sm mt-2">Tente ajustar os filtros de pesquisa ou expandir a área de busca</p>
                </div>
              )}
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

      {/* Guided Tutorial */}
      <GuidedTutorial
        isOpen={showOnboarding}
        onClose={closeOnboarding}
        onComplete={completeOnboarding}
      />
    </div>
  );
}
