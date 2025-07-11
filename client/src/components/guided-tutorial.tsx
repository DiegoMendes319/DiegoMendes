import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowDown, ArrowUp, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import JikulumessuIcon from "./jikulumessu-icon";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  arrow: 'up' | 'down' | 'left' | 'right';
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface GuidedTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function GuidedTutorial({ isOpen, onClose, onComplete }: GuidedTutorialProps) {
  const [currentStep, setCurrentStep] = useState(-1); // -1 for introduction
  const [isAnimating, setIsAnimating] = useState(false);
  const [tutorialStarted, setTutorialStarted] = useState(false);
  const queryClient = useQueryClient();

  const startTutorialMutation = useMutation({
    mutationFn: () => apiRequest("/api/tutorial/start", "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    }
  });

  const endTutorialMutation = useMutation({
    mutationFn: () => apiRequest("/api/tutorial/end", "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    }
  });

  const steps: TutorialStep[] = [
    {
      id: "filters",
      title: "Filtros de Pesquisa",
      description: "Aqui pode procurar prestadores por localização, tipo de serviço e contrato.",
      target: '[data-tutorial="search-filters"]',
      arrow: 'down',
      position: 'top'
    },
    {
      id: "profiles",
      title: "Perfis dos Prestadores",
      description: "Aqui aparecem os perfis disponíveis. Vou criar um exemplo para si.",
      target: '[data-tutorial="profile-card"]',
      arrow: 'up',
      position: 'bottom'
    },
    {
      id: "contact",
      title: "Contactar Prestador",
      description: "Use este botão para ver todas as formas de contacto direto.",
      target: '[data-tutorial="contact-btn"]',
      arrow: 'left',
      position: 'right',
      action: () => {
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
      position: 'top'
    }
  ];

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
        }, 800); // Increased delay to ensure proper positioning
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      
      setTimeout(() => {
        const prevStepIndex = currentStep - 1;
        const prevStepData = steps[prevStepIndex];
        
        // Scroll to previous element
        scrollToElement(prevStepData.target);
        
        // Highlight previous element
        setTimeout(() => {
          highlightElement(prevStepData.target);
          setCurrentStep(prevStepIndex);
          setIsAnimating(false);
        }, 500);
      }, 300);
    } else if (currentStep === 0) {
      // Go back to introduction
      setCurrentStep(-1);
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
    }
  };

  const skipTutorial = () => {
    handleComplete();
  };

  const startTutorial = () => {
    setTutorialStarted(true);
    startTutorialMutation.mutate();
    
    setTimeout(() => {
      setCurrentStep(0);
      const firstStep = steps[0];
      scrollToElement(firstStep.target);
      
      setTimeout(() => {
        highlightElement(firstStep.target);
      }, 500);
    }, 1000); // Increased delay to ensure profile is created
  };

  const handleComplete = () => {
    // Remove all highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });
    
    // End tutorial and clean up
    endTutorialMutation.mutate();
    onComplete();
    onClose();
  };

  const getTooltipPosition = () => {
    if (currentStep === -1) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const
      };
    }

    const stepData = steps[currentStep];
    const element = document.querySelector(stepData.target) as HTMLElement;
    if (!element) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed' as const };
    
    const rect = element.getBoundingClientRect();
    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;
    const isMobile = window.innerWidth < 768;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate safe positions that don't overlap with highlighted element
    switch (currentStep) {
      case 0: // Filters - position at top left corner
        return {
          top: `${Math.max(20, rect.top + scrollY - (isMobile ? 200 : 180))}px`,
          left: `${Math.max(20, rect.left + scrollX - (isMobile ? 150 : 200))}px`,
          transform: 'translateX(0)',
          position: 'absolute' as const
        };
      case 1: // Profiles - position at bottom right
        return {
          top: `${rect.bottom + scrollY + 30}px`,
          left: `${Math.min(viewportWidth - (isMobile ? 350 : 400), rect.right + scrollX - (isMobile ? 300 : 350))}px`,
          transform: 'translateX(0)',
          position: 'absolute' as const
        };
      case 2: // Contact - position at top right
        return {
          top: `${Math.max(20, rect.top + scrollY - (isMobile ? 200 : 180))}px`,
          left: `${Math.min(viewportWidth - (isMobile ? 350 : 400), rect.right + scrollX + 30)}px`,
          transform: 'translateX(0)',
          position: 'absolute' as const
        };
      case 3: // Register - position at bottom left
        return {
          top: `${rect.bottom + scrollY + 30}px`,
          left: `${Math.max(20, rect.left + scrollX - (isMobile ? 150 : 200))}px`,
          transform: 'translateX(0)',
          position: 'absolute' as const
        };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed' as const };
    }
  };

  const getArrowIcon = () => {
    if (currentStep === -1) return null;
    
    const isMobile = window.innerWidth < 768;
    const arrowSize = isMobile ? "w-8 h-8" : "w-12 h-12";
    
    // Always use right arrow pointing from tooltip to target
    return <ArrowRight className={`${arrowSize} text-angola-red tutorial-arrow-right`} strokeWidth={3} />;
  };

  const getArrowPosition = () => {
    if (currentStep === -1) return {};
    
    const stepData = steps[currentStep];
    const element = document.querySelector(stepData.target) as HTMLElement;
    const tooltipElement = document.querySelector('.tutorial-tooltip') as HTMLElement;
    
    if (!element || !tooltipElement) return {};
    
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;
    const isMobile = window.innerWidth < 768;
    
    // Calculate arrow position to connect tooltip to target element
    const targetCenterX = rect.left + rect.width / 2;
    const targetCenterY = rect.top + rect.height / 2;
    const tooltipCenterX = tooltipRect.left + tooltipRect.width / 2;
    const tooltipCenterY = tooltipRect.top + tooltipRect.height / 2;
    
    // Position arrow at the edge of tooltip closest to target
    let arrowX, arrowY;
    
    if (targetCenterX > tooltipCenterX) {
      // Target is to the right of tooltip
      arrowX = tooltipRect.right + scrollX;
      arrowY = tooltipCenterY + scrollY;
    } else {
      // Target is to the left of tooltip
      arrowX = tooltipRect.left + scrollX - (isMobile ? 40 : 60);
      arrowY = tooltipCenterY + scrollY;
    }
    
    return {
      top: `${arrowY}px`,
      left: `${arrowX}px`,
      transform: 'translateY(-50%)',
      position: 'absolute' as const
    };
  };

  useEffect(() => {
    if (isOpen && currentStep >= 0) {
      const stepData = steps[currentStep];
      if (stepData) {
        setTimeout(() => {
          scrollToElement(stepData.target);
          setTimeout(() => {
            highlightElement(stepData.target);
            
            // Force re-render to update arrow position after tooltip repositions
            setTimeout(() => {
              const arrowElement = document.querySelector('.tutorial-arrow');
              if (arrowElement) {
                const newPosition = getArrowPosition();
                Object.assign(arrowElement.style, newPosition);
              }
            }, 100);
          }, 500);
        }, 300);
      }
    }
    
    return () => {
      // Clean up highlights when component unmounts
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
    };
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 pointer-events-none" />
      
      {/* Giant Arrow */}
      {currentStep >= 0 && (
        <div
          className="fixed z-[58] pointer-events-none tutorial-arrow"
          style={getArrowPosition()}
        >
          {getArrowIcon()}
        </div>
      )}
      
      {/* Tutorial Card */}
      <div
        className="fixed z-[60] pointer-events-auto max-w-sm w-full mx-4 sm:mx-0 sm:w-96 tutorial-tooltip"
        style={getTooltipPosition()}
      >
        <Card className="shadow-2xl border-2 border-angola-red bg-white">
          <CardContent className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <JikulumessuIcon size="sm" />
                <span className="text-xs sm:text-sm font-medium text-gray-500">
                  {currentStep === -1 ? 'Olá!' : `Passo ${currentStep + 1}/${steps.length}`}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTutorial}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Introduction */}
            {currentStep === -1 && (
              <div className="text-center space-y-4">
                <div className="text-2xl sm:text-3xl mb-2">👋</div>
                <h3 className="font-bold text-lg sm:text-xl text-gray-800">
                  Olá! Sou o Jiku
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Bem-vindo ao <strong>Jikulumessu</strong>! 
                  <br />
                  "Jikulumessu" significa <em>"abre o olho"</em> ou <em>"fica atento"</em>.
                </p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Vou mostrar-lhe como funciona o nosso site para encontrar prestadores de serviços domésticos em Angola.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    onClick={startTutorial}
                    className="bg-angola-red hover:bg-angola-red/90 text-white flex-1"
                    disabled={startTutorialMutation.isPending}
                  >
                    {startTutorialMutation.isPending ? 'A iniciar...' : 'Começar Tour'}
                  </Button>
                  <Button
                    onClick={skipTutorial}
                    variant="outline"
                    className="flex-1"
                  >
                    Saltar
                  </Button>
                </div>
              </div>
            )}
            
            {/* Tutorial Steps */}
            {currentStep >= 0 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-2">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {steps[currentStep].description}
                  </p>
                </div>
                
                {/* Navigation */}
                <div className="flex justify-between items-center pt-4">
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    disabled={isAnimating}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </Button>
                  
                  <div className="flex gap-1">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentStep ? 'bg-angola-red' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      onClick={skipTutorial}
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      disabled={isAnimating}
                    >
                      <SkipForward className="w-4 h-4" />
                      <span className="hidden sm:inline">Saltar</span>
                    </Button>
                    
                    {currentStep === steps.length - 1 ? (
                      <Button
                        onClick={handleComplete}
                        className="bg-angola-red hover:bg-angola-red/90 text-white flex items-center gap-1"
                        disabled={isAnimating}
                      >
                        <span className="hidden sm:inline">Concluir</span>
                        <span className="sm:hidden">Fim</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={nextStep}
                        className="bg-angola-red hover:bg-angola-red/90 text-white flex items-center gap-1"
                        disabled={isAnimating}
                      >
                        <span className="hidden sm:inline">Próximo</span>
                        <span className="sm:hidden">OK</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}