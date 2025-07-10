import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

// Mock auth functions for development
export const authService = {
  async signUp(email: string, password: string, userData: any) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      // TODO: Create user profile in database
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signIn({ email, password });
      if (error) throw error;
      
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }
};
