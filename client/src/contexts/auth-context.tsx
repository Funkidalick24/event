import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Check for stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch user data when token is available
  const { data: userData, isLoading, refetch } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      if (!token) return null;

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token might be invalid, clear it
        localStorage.removeItem('authToken');
        setToken(null);
        throw new Error('Invalid token');
      }

      return response.json();
    },
    enabled: !!token,
    retry: false,
  });

  // Update user state when data changes
  useEffect(() => {
    if (userData) {
      setUser(userData);
    } else if (!isLoading && !token) {
      setUser(null);
    }
  }, [userData, isLoading, token]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(userData);
    queryClient.invalidateQueries({ queryKey: ['auth-user'] });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    queryClient.clear();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}