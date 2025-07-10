import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

export interface AuthUser {
  id: string;
  email: string | null;
  name: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await apiRequest('GET', '/api/auth/me');
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.log('Not authenticated or session expired');
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiRequest('POST', '/api/auth/login', { email, password });
    const result = await response.json();
    
    if (result.user) {
      setUser(result.user);
    }
    
    return result;
  };

  const register = async (userData: any) => {
    const response = await apiRequest('POST', '/api/auth/register', userData);
    const result = await response.json();
    
    if (result.user) {
      setUser(result.user);
    }
    
    return result;
  };

  const logout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}