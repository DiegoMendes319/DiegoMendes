import { useState, useEffect } from 'react';

const ONBOARDING_STORAGE_KEY = 'jikulumessu-onboarding-completed';

export function useOnboarding() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  
  console.log('useOnboarding hook - showOnboarding:', showOnboarding, 'isOnboardingCompleted:', isOnboardingCompleted);

  // Auto-show onboarding only if never completed before
  useEffect(() => {
    if (!isOnboardingCompleted) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnboardingCompleted]);

  const completeOnboarding = () => {
    setIsOnboardingCompleted(true);
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  };

  const resetOnboarding = () => {
    setIsOnboardingCompleted(false);
    setShowOnboarding(false);
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  };

  const startOnboarding = () => {
    console.log('startOnboarding called manually');
    setShowOnboarding(true);
  };

  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  return {
    isOnboardingCompleted,
    showOnboarding,
    completeOnboarding,
    resetOnboarding,
    startOnboarding,
    closeOnboarding
  };
}