import { useState, useEffect } from 'react';

const ONBOARDING_STORAGE_KEY = 'jikulumessu-onboarding-completed';

export function useOnboarding() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [manuallyStarted, setManuallyStarted] = useState<boolean>(false);
  
  console.log('useOnboarding hook - showOnboarding:', showOnboarding, 'isOnboardingCompleted:', isOnboardingCompleted, 'manuallyStarted:', manuallyStarted);

  useEffect(() => {
    // Show onboarding automatically if not completed and user is not authenticated
    if (!isOnboardingCompleted && !manuallyStarted) {
      // Small delay to let the page load
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnboardingCompleted, manuallyStarted]);

  const completeOnboarding = () => {
    setIsOnboardingCompleted(true);
    setShowOnboarding(false);
    setManuallyStarted(false);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  };

  const resetOnboarding = () => {
    setIsOnboardingCompleted(false);
    setManuallyStarted(false);
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  };

  const startOnboarding = () => {
    console.log('startOnboarding called, setting showOnboarding to true');
    setManuallyStarted(true);
    setShowOnboarding(true);
  };

  const closeOnboarding = () => {
    setShowOnboarding(false);
    setManuallyStarted(false);
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