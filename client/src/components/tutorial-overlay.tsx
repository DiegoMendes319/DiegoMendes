import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  X, 
  Search, 
  Users, 
  MessageCircle, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Eye
} from "lucide-react";
import JikulumessuIcon from "./jikulumessu-icon";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  target?: string;
}

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function TutorialOverlay({ isOpen, onClose, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TutorialStep[] = [
    {
      id: "welcome",
      title: "Bem-vindo ao Jikulumessu!",
      description: "Tutorial rápido em 4 passos",
      icon: <Eye className="w-6 h-6" />,
      position: 'top'
    },
    {
      id: "search",
      title: "1. Procurar",
      description: "Use os filtros para encontrar prestadores",
      icon: <Search className="w-6 h-6" />,
      position: 'bottom',
      target: '[data-tutorial="search-filters"]',
      highlight: 'search-filters'
    },
    {
      id: "profiles",
      title: "2. Ver Perfis",
      description: "Clique nos perfis para ver detalhes",
      icon: <Users className="w-6 h-6" />,
      position: 'top',
      target: '[data-tutorial="profile-card"]',
      highlight: 'profile-cards'
    },
    {
      id: "contact",
      title: "3. Contactar",
      description: "Clique em 'Contactar' para ver informações",
      icon: <MessageCircle className="w-6 h-6" />,
      position: 'left',
      target: '[data-tutorial="contact-btn"]',
      highlight: 'contact-button'
    },
    {
      id: "register",
      title: "4. Registar-se",
      description: "Clique em 'Entrar' para se registar",
      icon: <Users className="w-6 h-6" />,
      position: 'bottom',
      target: '[data-tutorial="auth-link"]',
      highlight: 'auth-link'
    }
  ];

  const currentStepData = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const getHighlightElement = () => {
    if (!currentStepData.target) return null;
    return document.querySelector(currentStepData.target);
  };

  const getTooltipPosition = () => {
    const element = getHighlightElement();
    if (!element) return { top: '50%', left: '50%' };
    
    const rect = element.getBoundingClientRect();
    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;
    
    switch (currentStepData.position) {
      case 'top':
        return {
          top: `${rect.top + scrollY - 120}px`,
          left: `${rect.left + scrollX + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'bottom':
        return {
          top: `${rect.bottom + scrollY + 10}px`,
          left: `${rect.left + scrollX + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: `${rect.top + scrollY + rect.height / 2}px`,
          left: `${rect.left + scrollX - 320}px`,
          transform: 'translateY(-50%)'
        };
      case 'right':
        return {
          top: `${rect.top + scrollY + rect.height / 2}px`,
          left: `${rect.right + scrollX + 10}px`,
          transform: 'translateY(-50%)'
        };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  useEffect(() => {
    if (isOpen && currentStepData.target) {
      const element = getHighlightElement();
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 pointer-events-auto" onClick={onClose} />
      
      {/* Highlight overlay */}
      {currentStepData.target && (
        <div
          className="absolute border-4 border-angola-red rounded-lg shadow-lg animate-pulse"
          style={{
            ...(() => {
              const element = getHighlightElement();
              if (!element) return {};
              const rect = element.getBoundingClientRect();
              return {
                top: `${rect.top + window.pageYOffset - 4}px`,
                left: `${rect.left + window.pageXOffset - 4}px`,
                width: `${rect.width + 8}px`,
                height: `${rect.height + 8}px`,
              };
            })(),
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute pointer-events-auto z-10"
        style={getTooltipPosition()}
      >
        <Card className="w-80 shadow-xl border-2 border-angola-yellow bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-angola-red/10 rounded-full">
                  {currentStepData.icon}
                </div>
                <h3 className="font-bold text-gray-800">{currentStepData.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{currentStepData.description}</p>
            
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Passo {currentStep + 1} de {steps.length}</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-angola-red h-1 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
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
          </CardContent>
        </Card>
        
        {/* Arrow pointing to target */}
        {currentStepData.target && (
          <div className="absolute">
            {currentStepData.position === 'top' && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-angola-yellow"></div>
            )}
            {currentStepData.position === 'bottom' && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-angola-yellow"></div>
            )}
            {currentStepData.position === 'left' && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-angola-yellow"></div>
            )}
            {currentStepData.position === 'right' && (
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-angola-yellow"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}