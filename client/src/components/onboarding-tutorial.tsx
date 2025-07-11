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
      description: "Vamos mostrar-lhe como usar a plataforma em 4 passos simples.",
      icon: <Eye className="w-6 h-6" />,
      content: (
        <div className="text-center">
          <JikulumessuIcon size="lg" className="mx-auto mb-3" />
          <p className="text-sm text-gray-600">
            Tutorial rápido para começar a usar a plataforma
          </p>
        </div>
      ),
      position: { x: 50, y: 50 }
    },
    {
      id: "search",
      title: "1. Procurar",
      description: "Use os filtros no topo da página para encontrar prestadores.",
      icon: <Search className="w-6 h-6" />,
      content: (
        <div className="text-center">
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-blue-800">👆 Clique nos filtros no topo</p>
          </div>
          <p className="text-sm text-gray-600">
            Selecione localização, serviços e tipo de contrato
          </p>
        </div>
      ),
      position: { x: 25, y: 30 },
      highlight: "search-section"
    },
    {
      id: "profiles",
      title: "2. Ver Perfis",
      description: "Clique em qualquer perfil para ver detalhes e avaliações.",
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="text-center">
          <div className="bg-green-50 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-green-800">👆 Clique num perfil</p>
          </div>
          <p className="text-sm text-gray-600">
            Veja informações, avaliações e serviços oferecidos
          </p>
        </div>
      ),
      position: { x: 75, y: 40 },
      highlight: "profiles-section"
    },
    {
      id: "contact",
      title: "3. Contactar",
      description: "Clique no botão 'Contactar' para ver informações de contacto.",
      icon: <MessageCircle className="w-6 h-6" />,
      content: (
        <div className="text-center">
          <div className="bg-purple-50 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-purple-800">👆 Clique em "Contactar"</p>
          </div>
          <p className="text-sm text-gray-600">
            Telefone, Facebook, Instagram e TikTok
          </p>
        </div>
      ),
      position: { x: 60, y: 70 },
      highlight: "contact-section"
    },
    {
      id: "register",
      title: "4. Registar-se",
      description: "Para oferecer serviços, clique em 'Entrar' no cabeçalho.",
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="text-center">
          <div className="bg-yellow-50 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-yellow-800">👆 Clique em "Entrar"</p>
          </div>
          <p className="text-sm text-gray-600">
            Registe-se com email, Google ou nome simples
          </p>
        </div>
      ),
      position: { x: 25, y: 60 },
      highlight: "auth-section"
    },
    {
      id: "complete",
      title: "Concluído!",
      description: "Agora já sabe como usar o Jikulumessu.",
      icon: <CheckCircle className="w-6 h-6" />,
      content: (
        <div className="text-center">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-sm text-gray-600">
            Comece a explorar perfis ou registe-se para oferecer serviços
          </p>
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
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-angola-red to-angola-yellow p-4 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <JikulumessuIcon size="sm" className="text-white" />
              <h2 className="text-lg font-bold">Tutorial</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Passo {currentStep + 1} de {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div 
                className="bg-white h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="p-2 bg-angola-red/10 rounded-full inline-block mb-3">
              {currentStepData.icon}
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-lg">
              {currentStepData.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {currentStepData.description}
            </p>
            <div className="mb-6">
              {currentStepData.content}
            </div>
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

        {/* Skip Button */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xs"
          >
            Saltar tutorial
          </Button>
        </div>
      </div>
    </div>
  );
}