import { useState, useEffect } from 'react';

const ONBOARDING_STORAGE_KEY = 'jikulumessu-onboarding-completed';

export function useOnboarding() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  useEffect(() => {
    // Show onboarding if not completed and user is not authenticated
    if (!isOnboardingCompleted) {
      // Small delay to let the page load
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
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  };

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  return {
    isOnboardingCompleted,
    showOnboarding,
    completeOnboarding,
    resetOnboarding,
    startOnboarding,
    closeOnboarding: () => setShowOnboarding(false)
  };
}