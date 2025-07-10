import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { user, loading } = useSupabaseAuth();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Give some time for the auth state to update
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (user) {
          console.log('User authenticated, redirecting to home');
          setLocation('/');
        } else {
          console.log('No user found, redirecting to auth');
          setLocation('/auth');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setLocation('/auth');
      } finally {
        setProcessing(false);
      }
    };

    if (!loading) {
      handleAuthCallback();
    }
  }, [user, loading, setLocation]);

  if (loading || processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">A processar autenticação...</p>
        </div>
      </div>
    );
  }

  return null;
}