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
      description: "Olá! Eu sou o Jiku, o seu guia pessoal. Vou mostrar-lhe como usar a plataforma para encontrar ou oferecer serviços domésticos.",
      icon: <Eye className="w-6 h-6" />,
      content: (
        <div className="text-center space-y-4">
          <div className="animate-bounce">
            <JikulumessuIcon size="xl" className="mx-auto" />
          </div>
          <p className="text-lg text-gray-700">
            "Jikulumessu" significa "abre o olho" - mantenha-se alerta para as melhores oportunidades!
          </p>
        </div>
      ),
      position: { x: 50, y: 50 }
    },
    {
      id: "search",
      title: "Procurar Prestadores de Serviços",
      description: "Use os filtros para encontrar exactamente o que precisa na sua área.",
      icon: <Search className="w-6 h-6" />,
      content: (
        <div className="space-y-3">
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
      ),
      position: { x: 25, y: 30 },
      highlight: "search-section"
    },
    {
      id: "profiles",
      title: "Explorar Perfis",
      description: "Veja informações detalhadas, avaliações e contactos dos prestadores de serviços.",
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-3">
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
            <p className="text-sm text-gray-600 mt-2">
              Especialista em limpeza e jardinagem • Luanda, Maianga
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Clique nos perfis para ver mais detalhes e informações de contacto!
          </p>
        </div>
      ),
      position: { x: 75, y: 40 },
      highlight: "profiles-section"
    },
    {
      id: "contact",
      title: "Contactar Directamente",
      description: "Entre em contacto directo com os prestadores de serviços através de telefone ou redes sociais.",
      icon: <MessageCircle className="w-6 h-6" />,
      content: (
        <div className="space-y-3">
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
      title: "Criar o Seu Perfil",
      description: "Quer oferecer serviços? Registe-se e crie o seu perfil profissional.",
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <span className="text-2xl">✉️</span>
              <p className="text-xs mt-1">Email</p>
            </div>
            <div className="bg-red-50 rounded-lg p-2 text-center">
              <span className="text-2xl">🌐</span>
              <p className="text-xs mt-1">Google</p>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2 text-center">
            <span className="text-2xl">👤</span>
            <p className="text-xs mt-1">Registo Simples (Nome + Palavra-passe)</p>
          </div>
          <p className="text-sm text-gray-600">
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl h-full max-h-[90vh] bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-angola-red to-angola-yellow p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <JikulumessuIcon size="sm" className="text-white" />
              <h2 className="text-xl font-bold">Tutorial Jikulumessu</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Passo {currentStep + 1} de {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Character Guide */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className={`absolute transition-all duration-700 ease-in-out ${isAnimating ? 'scale-110' : 'scale-100'}`}
            style={{
              left: `${characterPosition.x}%`,
              top: `${characterPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              {/* Character */}
              <div className="w-16 h-16 bg-gradient-to-br from-angola-yellow to-angola-red rounded-full flex items-center justify-center shadow-lg onboarding-character border-4 border-white">
                <Eye className="w-8 h-8 text-white" />
              </div>
              
              {/* Speech Bubble */}
              <div className="absolute -top-2 left-20 pointer-events-auto onboarding-bubble">
                <Card className="w-80 shadow-xl border-2 border-angola-yellow bg-gradient-to-br from-white to-angola-yellow/5">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-angola-red/10 rounded-full animate-pulse">
                        {currentStepData.icon}
                      </div>
                      <div className="flex-1 onboarding-content">
                        <h3 className="font-bold text-gray-800 mb-1">
                          {currentStepData.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {currentStepData.description}
                        </p>
                        <div className="mb-4">
                          {currentStepData.content}
                        </div>
                        
                        {/* Navigation */}
                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="flex items-center space-x-1"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Anterior</span>
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
                
                {/* Speech Bubble Tail */}
                <div className="absolute top-8 -left-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-angola-yellow border-b-8 border-b-transparent drop-shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Skip Button */}
        <div className="absolute bottom-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Saltar tutorial
          </Button>
        </div>
      </div>
    </div>
  );
}