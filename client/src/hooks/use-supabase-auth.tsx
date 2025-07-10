import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData?: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get initial session
        const sessionResult = await supabase.auth.getSession();
        const session = sessionResult?.data?.session || null;
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Listen for auth changes
        const authResult = await supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }
        );

        const subscription = authResult?.data?.subscription || null;
        return subscription;
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
        return null;
      }
    };

    let subscription: any = null;
    initAuth().then(sub => {
      subscription = sub;
    }).catch(error => {
      console.error('Failed to initialize auth:', error);
      setLoading(false);
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [])

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData?.first_name || 'Nome',
            last_name: userData?.last_name || 'Sobrenome',
            ...userData,
          },
        },
      })

      if (error) throw error

      // Wait a bit for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the profile with additional data if provided
      if (data.user && userData) {
        const { error: profileError } = await supabase
          .from('users')
          .update({
            phone: userData.phone,
            date_of_birth: userData.date_of_birth,
            province: userData.province,
            municipality: userData.municipality,
            neighborhood: userData.neighborhood,
            address_complement: userData.address_complement,
            contract_type: userData.contract_type,
            services: userData.services,
            availability: userData.availability,
            about_me: userData.about_me,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.user.id)

        if (profileError) {
          console.error('Error updating profile:', profileError)
        }
      }

      return data
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log('Iniciando Google OAuth...');
      
      // Check if Google OAuth is properly configured
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('Erro no Google OAuth:', error);
        console.error('Detalhes do erro:', JSON.stringify(error, null, 2));
        
        // Provide helpful error message
        if (error.message?.includes('Provider not found') || error.message?.includes('invalid_request')) {
          throw new Error('Google OAuth não está configurado correctamente no Supabase. Verifique as configurações.');
        }
        
        throw error;
      }
      
      console.log('Google auth result:', data);
      
      // Redirect to the Google OAuth URL
      if (data?.url) {
        console.log('Redirecionando para:', data.url);
        window.location.href = data.url;
      } else {
        console.error('Nenhum URL de redirecionamento recebido');
        throw new Error('Nenhum URL de redirecionamento recebido. Verifique a configuração do Google OAuth.');
      }
      
      return data
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within an AuthProvider')
  }
  return context
}