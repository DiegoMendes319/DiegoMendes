import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, CheckCircle, Eye, Users, Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import JikulumessuIcon from "./jikulumessu-icon";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  position: { x: number; y: number };
  highlight?: string;
}

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function OnboardingTutorial({ isOpen, onClose, onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [characterPosition, setCharacterPosition] = useState({ x: 50, y: 50 });

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Bem-vindo ao Jikulumessu!",
      description: "Olá! Eu sou o Jiku, o seu guia pessoal. Vou mostrar-lhe passo a passo como usar a plataforma para encontrar ou oferecer serviços domésticos.",
      icon: <Eye className="w-6 h-6" />,
      content: (
        <div className="text-center space-y-4">
          <div className="animate-bounce">
            <JikulumessuIcon size="xl" className="mx-auto" />
          </div>
          <div className="bg-angola-yellow/10 rounded-lg p-4 border border-angola-yellow">
            <p className="text-lg font-medium text-gray-800 mb-2">
              "Jikulumessu" significa "abre o olho"
            </p>
            <p className="text-sm text-gray-600">
              Mantenha-se alerta para as melhores oportunidades! Este tutorial vai mostrar-lhe tudo o que precisa saber.
            </p>
          </div>
        </div>
      ),
      position: { x: 50, y: 50 }
    },
    {
      id: "search",
      title: "1️⃣ Procurar Prestadores de Serviços",
      description: "Primeiro passo: Use os filtros de pesquisa no topo da página principal para encontrar exactamente o que precisa na sua área.",
      icon: <Search className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">👆 Onde clicar:</h4>
            <p className="text-sm text-blue-700">Procure a secção de filtros no topo da página inicial</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-angola-yellow/20">📍 Localização</Badge>
              <span className="text-sm text-gray-600">Província, Município, Bairro</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-angola-red/20">🧹 Serviços</Badge>
              <span className="text-sm text-gray-600">Limpeza, Cozinha, Jardinagem...</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-angola-black/20">📋 Contrato</Badge>
              <span className="text-sm text-gray-600">Mensal, Diarista, Verbal</span>
            </div>
          </div>
        </div>
      ),
      position: { x: 25, y: 30 },
      highlight: "search-section"
    },
    {
      id: "profiles",
      title: "2️⃣ Explorar Perfis",
      description: "Segundo passo: Clique em qualquer perfil de prestador de serviços para ver informações detalhadas, avaliações e formas de contacto.",
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">👆 Onde clicar:</h4>
            <p className="text-sm text-green-700">Clique em qualquer cartão de perfil na lista de resultados</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-angola-red rounded-full flex items-center justify-center">
                <span className="text-white font-bold">JP</span>
              </div>
              <div>
                <p className="font-medium">João Pedro</p>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★★★★★</span>
                  <span className="text-sm text-gray-600">(15 avaliações)</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Especialista em limpeza e jardinagem • Luanda, Maianga
            </p>
            <div className="mt-2 text-xs text-blue-600">👆 Clique aqui para ver detalhes</div>
          </div>
        </div>
      ),
      position: { x: 75, y: 40 },
      highlight: "profiles-section"
    },
    {
      id: "contact",
      title: "3️⃣ Contactar Directamente",
      description: "Terceiro passo: No perfil detalhado, clique no botão 'Contactar' para ver todas as formas de entrar em contacto directo.",
      icon: <MessageCircle className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">👆 Onde clicar:</h4>
            <p className="text-sm text-purple-700">Procure pelo botão "Contactar" no perfil do prestador</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Contacto Directo</span>
            </div>
            <p className="text-sm text-green-700">
              Negocie termos, preços e horários directamente com o prestador de serviços.
            </p>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• 📞 Telefone com código +244</p>
            <p>• 📘 Facebook</p>
            <p>• 📷 Instagram</p>
            <p>• 🎵 TikTok</p>
          </div>
        </div>
      ),
      position: { x: 60, y: 70 },
      highlight: "contact-section"
    },
    {
      id: "register",
      title: "4️⃣ Criar o Seu Perfil",
      description: "Quarto passo: Quer oferecer serviços? Clique em 'Entrar' no cabeçalho da página para se registar e criar o seu perfil profissional.",
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">👆 Onde clicar:</h4>
            <p className="text-sm text-yellow-700">Clique no botão "Entrar" no cabeçalho da página</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 rounded-lg p-2 text-center border">
              <span className="text-2xl">✉️</span>
              <p className="text-xs mt-1 font-medium">Email</p>
            </div>
            <div className="bg-red-50 rounded-lg p-2 text-center border">
              <span className="text-2xl">🌐</span>
              <p className="text-xs mt-1 font-medium">Google</p>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2 text-center border border-yellow-300">
            <span className="text-2xl">👤</span>
            <p className="text-xs mt-1 font-medium">Registo Simples (Nome + Palavra-passe)</p>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Três formas fáceis de se registar e começar a receber contactos!
          </p>
        </div>
      ),
      position: { x: 25, y: 60 },
      highlight: "auth-section"
    },
    {
      id: "complete",
      title: "Está Pronto!",
      description: "Agora já sabe como usar o Jikulumessu. Comece a explorar e encontre os melhores serviços!",
      icon: <CheckCircle className="w-6 h-6" />,
      content: (
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <JikulumessuIcon size="lg" className="mx-auto" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-800">
              Parabéns! 🎉
            </p>
            <p className="text-gray-600">
              Agora pode começar a usar a plataforma com confiança.
            </p>
            <div className="bg-angola-yellow/20 rounded-lg p-3 mt-3">
              <p className="text-sm font-medium text-gray-800">
                Lembre-se: "Jikulumessu" - mantenha sempre os olhos abertos!
              </p>
            </div>
          </div>
        </div>
      ),
      position: { x: 50, y: 50 }
    }
  ];

  const nextStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setCharacterPosition(steps[currentStep + 1].position);
      }
      setIsAnimating(false);
    }, 300);
  };

  const prevStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
        setCharacterPosition(steps[currentStep - 1].position);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setCharacterPosition(steps[currentStep].position);
    }
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-6xl h-full max-h-[95vh] bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-angola-red to-angola-yellow p-3 sm:p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <JikulumessuIcon size="sm" className="text-white" />
              <h2 className="text-lg sm:text-xl font-bold">Tutorial Jikulumessu</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2 sm:mt-3">
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span>Passo {currentStep + 1} de {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
              <div 
                className="bg-white h-1.5 sm:h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tutorial Content - Responsive Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side - Character and Instructions */}
          <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
            <div className="max-w-lg mx-auto">
              {/* Character */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-angola-yellow to-angola-red rounded-full flex items-center justify-center shadow-lg onboarding-character border-4 border-white">
                  <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              
              {/* Instructions */}
              <Card className="shadow-xl border-2 border-angola-yellow bg-gradient-to-br from-white to-angola-yellow/5">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-angola-red/10 rounded-full animate-pulse flex-shrink-0">
                      {currentStepData.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-2 text-lg sm:text-xl">
                        {currentStepData.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4">
                        {currentStepData.description}
                      </p>
                      <div className="mb-6">
                        {currentStepData.content}
                      </div>
                      
                      {/* Navigation */}
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={prevStep}
                          disabled={currentStep === 0}
                          className="flex items-center space-x-1"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span className="hidden sm:inline">Anterior</span>
                        </Button>
                        
                        {currentStep === steps.length - 1 ? (
                          <Button
                            onClick={handleComplete}
                            className="bg-angola-red hover:bg-angola-red/90 text-white flex items-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Concluir</span>
                          </Button>
                        ) : (
                          <Button
                            onClick={nextStep}
                            className="bg-angola-red hover:bg-angola-red/90 text-white flex items-center space-x-1"
                          >
                            <span>Próximo</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Right Side - Live Preview with Highlight */}
          <div className="flex-1 bg-white relative border-l border-gray-200 hidden lg:block">
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500 p-6">
                <div className="text-6xl mb-4">👁️</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Vista Prévia Interactiva</h3>
                <div className="bg-white rounded-lg p-4 shadow-md border-2 border-gray-200 mb-4">
                  <p className="text-sm font-medium text-gray-800 mb-2">
                    {currentStep === 0 && "🏠 Página inicial do Jikulumessu"}
                    {currentStep === 1 && "🔍 Área de filtros de pesquisa"}
                    {currentStep === 2 && "👥 Lista de perfis de prestadores"}
                    {currentStep === 3 && "📞 Modal de contacto"}
                    {currentStep === 4 && "🔐 Página de registo/login"}
                    {currentStep === 5 && "✅ Plataforma pronta para usar"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {currentStep === 0 && "Bem-vindo ao Jikulumessu!"}
                    {currentStep === 1 && "Utilize os filtros de pesquisa no topo da página"}
                    {currentStep === 2 && "Clique nos perfis para ver mais detalhes"}
                    {currentStep === 3 && "Contacte directamente através do botão 'Contactar'"}
                    {currentStep === 4 && "Registe-se clicando em 'Entrar' no menu"}
                    {currentStep === 5 && "Está pronto para usar a plataforma!"}
                  </p>
                </div>
              </div>
              
              {/* Visual Indicators with Arrows */}
              {currentStep === 1 && (
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-angola-red/30 border-3 border-angola-red rounded-lg p-3 animate-pulse shadow-lg">
                    <div className="text-sm text-angola-red font-bold text-center">
                      👆 CLIQUE AQUI: Área de Filtros
                    </div>
                    <div className="text-xs text-angola-red/80 text-center mt-1">
                      Procure, filtre e encontre prestadores
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="absolute bottom-20 left-4 right-4">
                  <div className="bg-angola-yellow/30 border-3 border-angola-yellow rounded-lg p-3 animate-pulse shadow-lg">
                    <div className="text-sm text-angola-yellow-dark font-bold text-center">
                      👆 CLIQUE AQUI: Perfis dos Prestadores
                    </div>
                    <div className="text-xs text-angola-yellow-dark/80 text-center mt-1">
                      Veja detalhes, avaliações e serviços
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                  <div className="bg-green-300 border-3 border-green-600 rounded-lg p-3 animate-pulse shadow-lg">
                    <div className="text-sm text-green-800 font-bold text-center">
                      👆 CLIQUE AQUI: Botão Contactar
                    </div>
                    <div className="text-xs text-green-700 text-center mt-1">
                      Obtenha informações de contacto
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="absolute top-4 right-4">
                  <div className="bg-blue-300 border-3 border-blue-600 rounded-lg p-3 animate-pulse shadow-lg">
                    <div className="text-sm text-blue-800 font-bold text-center">
                      👆 CLIQUE AQUI: Botão Entrar
                    </div>
                    <div className="text-xs text-blue-700 text-center mt-1">
                      Registe-se ou faça login
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skip Button */}
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
          >
            Saltar tutorial
          </Button>
        </div>
      </div>
    </div>
  );
}