// Supabase Auth Integration for Google OAuth
// Configure these environment variables in Replit Secrets:
// - VITE_SUPABASE_URL: Your Supabase project URL
// - VITE_SUPABASE_ANON_KEY: Your Supabase anon/public key
// - GOOGLE_CLIENT_ID: Your Google OAuth client ID (from Google Cloud Console)
// - GOOGLE_CLIENT_SECRET: Your Google OAuth client secret

export interface SupabaseAuthClient {
  signUp: (data: { email: string; password: string; options?: any }) => Promise<any>;
  signInWithPassword: (data: { email: string; password: string }) => Promise<any>;
  signInWithOAuth: (data: { provider: string; options?: any }) => Promise<any>;
  signOut: () => Promise<any>;
  getUser: () => Promise<any>;
  onAuthStateChange: (callback: (event: string, session: any) => void) => { data: { subscription: any } };
}

// Mock implementation for development - replace with actual Supabase client
export const createSupabaseAuthClient = (): SupabaseAuthClient => {
  // In production, this would be:
  // import { createClient } from '@supabase/supabase-js'
  // const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  // const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  // return createClient(supabaseUrl, supabaseKey).auth

  return {
    async signUp({ email, password, options }) {
      console.log('Supabase signUp called:', { email, options });
      // Simulate successful signup
      return {
        data: {
          user: { id: 'user-' + Date.now(), email, email_confirmed_at: new Date().toISOString() },
          session: { access_token: 'mock-token', refresh_token: 'mock-refresh' }
        },
        error: null
      };
    },

    async signInWithPassword({ email, password }) {
      console.log('Supabase signInWithPassword called:', { email });
      // Simulate successful login
      return {
        data: {
          user: { id: 'user-existing', email, email_confirmed_at: new Date().toISOString() },
          session: { access_token: 'mock-token', refresh_token: 'mock-refresh' }
        },
        error: null
      };
    },

    async signInWithOAuth({ provider, options }) {
      console.log('Supabase OAuth called:', { provider, options });
      
      if (provider === 'google') {
        // In production, this would redirect to Google OAuth
        // For now, simulate the OAuth flow
        const mockGoogleUser = {
          id: 'google-user-' + Date.now(),
          email: 'usuario@gmail.com',
          user_metadata: {
            name: 'Utilizador Google',
            picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser'
          }
        };

        return {
          data: {
            user: mockGoogleUser,
            session: { access_token: 'google-mock-token', refresh_token: 'google-mock-refresh' }
          },
          error: null
        };
      }

      return { data: null, error: { message: 'Provider not supported' } };
    },

    async signOut() {
      console.log('Supabase signOut called');
      return { error: null };
    },

    async getUser() {
      console.log('Supabase getUser called');
      // Check if user is logged in (in real app, check localStorage/session)
      return {
        data: { user: null },
        error: null
      };
    },

    onAuthStateChange(callback) {
      console.log('Supabase onAuthStateChange called');
      // In real app, this would listen to auth state changes
      return {
        data: {
          subscription: {
            unsubscribe: () => console.log('Auth state listener unsubscribed')
          }
        }
      };
    }
  };
};

// Configuration instructions for Replit
export const SETUP_INSTRUCTIONS = `
CONFIGURAÇÃO SUPABASE + GOOGLE OAUTH NO REPLIT:

1. CRIAR PROJECTO SUPABASE:
   - Vá para https://supabase.com/dashboard
   - Crie um novo projecto
   - Vá para Settings > API
   - Copie o Project URL e o anon public key

2. CONFIGURAR GOOGLE OAUTH:
   - Vá para https://console.cloud.google.com
   - Crie um novo projecto ou seleccione um existente
   - Active a Google+ API
   - Vá para Credentials > Create Credentials > OAuth 2.0 Client ID
   - Configure o redirect URI: https://[seu-projeto-supabase].supabase.co/auth/v1/callback
   - Copie o Client ID e Client Secret

3. CONFIGURAR SUPABASE AUTH:
   - No dashboard Supabase, vá para Authentication > Providers
   - Active o provider Google
   - Insira o Client ID e Client Secret do Google
   - Configure os redirect URLs

4. CONFIGURAR VARIÁVEIS NO REPLIT:
   - No seu projecto Replit, vá para Tools > Secrets
   - Adicione as seguintes variáveis:
     * VITE_SUPABASE_URL=https://[seu-projeto].supabase.co
     * VITE_SUPABASE_ANON_KEY=[sua-chave-anon]
     * GOOGLE_CLIENT_ID=[seu-google-client-id]
     * GOOGLE_CLIENT_SECRET=[seu-google-client-secret]

5. INSTALAR SUPABASE SDK:
   - Execute: npm install @supabase/supabase-js

6. ACTUALIZAR O CÓDIGO:
   - Remova a implementação mock em supabase-auth.ts
   - Substitua por: import { createClient } from '@supabase/supabase-js'
   - Use as variáveis de ambiente para configurar o cliente

TESTE:
- Reinicie o projecto Replit
- Teste o registo com email/palavra-passe
- Teste o login com Google OAuth
- Verifique no Supabase Dashboard se os utilizadores são criados
`;

export const supabaseAuth = createSupabaseAuthClient();