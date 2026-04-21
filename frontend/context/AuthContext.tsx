"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  token: string;
  email?: string;
  displayName?: string;
  credits?: number;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext(undefined as AuthContextType | undefined);

// Session keys for sessionStorage (cleared on tab close)
const SESSION_KEY = 'session_token';
const USER_DATA_KEY = 'user_data';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null as User | null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Force logout function - clears everything
  const forceLogout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(USER_DATA_KEY);
      localStorage.removeItem('token');
    } catch (e) {
      // Ignore errors
    }
    setUser(null);
  }, []);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await api.get('/api/v1/profile');
      const profileData = res.data;
      
      setUser((prev: User | null) => {
        const updatedUser = prev ? { ...prev, ...profileData } : { token: '', ...profileData };
        // Persist profile data (excluding sensitive fields if any)
        try {
          sessionStorage.setItem(USER_DATA_KEY, JSON.stringify({
            email: updatedUser.email,
            displayName: updatedUser.displayName,
            credits: updatedUser.credits
          }));
        } catch (e) {}
        return updatedUser;
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
      // Don't throw - allow the app to continue without profile data
    }
  }, []);

  // Refresh user data (for credit updates after purchase)
  const refreshUser = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = sessionStorage.getItem(SESSION_KEY);
      const storedUserData = sessionStorage.getItem(USER_DATA_KEY);
      
      if (token) {
        let userObj: User = { token };
        if (storedUserData) {
          try {
            const parsedData = JSON.parse(storedUserData);
            userObj = { ...userObj, ...parsedData };
          } catch (e) {}
        }
        setUser(userObj);
        
        // Fetch profile to get latest credits/data
        try {
          await fetchUserProfile();
        } catch (err) {
          // Profile fetch failed, but don't block initialization
          console.error('Failed to fetch profile during init', err);
        }
      }
      // Set loading to false regardless of success/failure
      setIsLoading(false);
    };

    initializeAuth();
  }, []); // Empty dependency array - only run once on mount

  const login = (token: string, email?: string) => {
    sessionStorage.setItem(SESSION_KEY, token);
    if (email) {
      const userData = { email };
      sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      setUser({ token, email });
    } else {
      setUser({ token });
    }
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (e) {
      // Continue with local logout
    }
    forceLogout();
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>
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
