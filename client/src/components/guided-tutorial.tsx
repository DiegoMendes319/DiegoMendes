import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowDown, ArrowUp, ArrowLeft, ArrowRight } from "lucide-react";
import JikulumessuIcon from "./jikulumessu-icon";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  arrow: 'up' | 'down' | 'left' | 'right';
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  action?: () => void;
}

interface GuidedTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function GuidedTutorial({ isOpen, onClose, onComplete }: GuidedTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps: TutorialStep[] = [
    {
      id: "filters",
      title: "Filtros de Pesquisa",
      description: "Aqui pode procurar prestadores por localização, tipo de serviço e contrato.",
      target: '[data-tutorial="search-filters"]',
      arrow: 'down',
      position: { top: '10px', left: '50%', transform: 'translateX(-50%)' }
    },
    {
      id: "profiles",
      title: "Perfis dos Prestadores",
      description: "Clique em qualquer perfil para ver mais detalhes, avaliações e informações.",
      target: '[data-tutorial="profile-card"]',
      arrow: 'up',
      position: { bottom: '10px', left: '50%', transform: 'translateX(-50%)' }
    },
    {
      id: "contact",
      title: "Contactar Prestador",
      description: "Use este botão para ver todas as formas de contacto direto.",
      target: '[data-tutorial="contact-btn"]',
      arrow: 'left',
      position: { right: '10px', top: '50%', transform: 'translateY(-50%)' },
      action: () => {
        // Simula clique no primeiro perfil para mostrar o modal
        setTimeout(() => {
          const firstProfile = document.querySelector('[data-tutorial="profile-card"]') as HTMLElement;
          if (firstProfile) {
            firstProfile.click();
          }
        }, 500);
      }
    },
    {
      id: "register",
      title: "Registar-se",
      description: "Clique aqui para se registar e criar o seu próprio perfil profissional.",
      target: '[data-tutorial="auth-link"]',
      arrow: 'down',
      position: { top: '10px', right: '20px' }
    }
  ];

  const currentStepData = steps[currentStep];

  const scrollToElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
    }
  };

  const highlightElement = (selector: string) => {
    // Remove previous highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    // Add highlight to current element
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.classList.add('tutorial-highlight');
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      
      setTimeout(() => {
        const nextStepIndex = currentStep + 1;
        const nextStepData = steps[nextStepIndex];
        
        // Execute action if needed
        if (nextStepData.action) {
          nextStepData.action();
        }
        
        // Scroll to next element
        scrollToElement(nextStepData.target);
        
        // Highlight next element
        setTimeout(() => {
          highlightElement(nextStepData.target);
          setCurrentStep(nextStepIndex);
          setIsAnimating(false);
        }, 500);
      }, 300);
    }
  };

  const handleComplete = () => {
    // Remove all highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });
    
    onComplete();
    onClose();
  };

  const getTooltipPosition = () => {
    const element = document.querySelector(currentStepData.target) as HTMLElement;
    if (!element) return currentStepData.position;
    
    const rect = element.getBoundingClientRect();
    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;
    
    switch (currentStepData.arrow) {
      case 'down':
        return {
          top: `${rect.top + scrollY - 120}px`,
          left: `${rect.left + scrollX + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'up':
        return {
          top: `${rect.bottom + scrollY + 20}px`,
          left: `${rect.left + scrollX + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: `${rect.top + scrollY + rect.height / 2}px`,
          left: `${rect.right + scrollX + 20}px`,
          transform: 'translateY(-50%)'
        };
      case 'right':
        return {
          top: `${rect.top + scrollY + rect.height / 2}px`,
          left: `${rect.left + scrollX - 320}px`,
          transform: 'translateY(-50%)'
        };
      default:
        return currentStepData.position;
    }
  };

  const getArrowIcon = () => {
    switch (currentStepData.arrow) {
      case 'up': return <ArrowUp className="w-6 h-6 text-angola-red animate-bounce" />;
      case 'down': return <ArrowDown className="w-6 h-6 text-angola-red animate-bounce" />;
      case 'left': return <ArrowLeft className="w-6 h-6 text-angola-red animate-bounce" />;
      case 'right': return <ArrowRight className="w-6 h-6 text-angola-red animate-bounce" />;
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Start tutorial
      setTimeout(() => {
        scrollToElement(currentStepData.target);
        setTimeout(() => {
          highlightElement(currentStepData.target);
        }, 500);
      }, 300);
    }
    
    return () => {
      // Clean up highlights when component unmounts
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
    };
  }, [isOpen, currentStepData]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-50 pointer-events-none" />
      
      {/* Tutorial Tooltip */}
      <div
        className="fixed z-[60] pointer-events-auto"
        style={getTooltipPosition()}
      >
        <Card className="w-80 shadow-2xl border-2 border-angola-yellow bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <JikulumessuIcon size="sm" />
                <span className="text-sm font-medium text-gray-500">
                  Jiku explica ({currentStep + 1}/{steps.length})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-sm text-gray-600">
                {currentStepData.description}
              </p>
            </div>
            
            <div className="flex justify-center mb-4">
              {getArrowIcon()}
            </div>
            
            <div className="text-center">
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleComplete}
                  className="bg-angola-red hover:bg-angola-red/90 text-white px-6 py-2"
                  disabled={isAnimating}
                >
                  Concluir Tutorial
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-angola-red hover:bg-angola-red/90 text-white px-6 py-2"
                  disabled={isAnimating}
                >
                  {isAnimating ? 'Movendo...' : 'OK, Próximo'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}