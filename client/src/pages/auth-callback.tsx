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
        console.log('Processing auth callback...');
        
        // Check URL for errors
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const error = urlParams.get('error') || hashParams.get('error');
        if (error) {
          console.error('OAuth error:', error);
          setLocation('/auth?error=oauth_failed');
          return;
        }
        
        // Give time for auth state to update
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        if (user) {
          console.log('User authenticated successfully, redirecting to profile');
          setLocation('/profile');
        } else {
          console.log('No user found after timeout, redirecting to auth');
          setLocation('/auth?error=timeout');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setLocation('/auth?error=callback_error');
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