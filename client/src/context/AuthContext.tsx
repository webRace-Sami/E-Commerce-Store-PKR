import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginCustomer: (data: { email: string; password: string }) => Promise<any>;
  loginAdmin: (data: { email: string; password: string }) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sm_user') || localStorage.getItem('apex_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sm_token') || localStorage.getItem('apex_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and verify session
  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('sm_token') || localStorage.getItem('apex_token');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('sm_user', JSON.stringify(res.user));
      } else {
        throw new Error('Failed to verify user');
      }
    } catch {
      // Clear token if invalid or expired
      localStorage.removeItem('sm_token');
      localStorage.removeItem('sm_user');
      localStorage.removeItem('apex_token');
      localStorage.removeItem('apex_user');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginCustomer = async (credentials: { email: string; password: string }) => {
    const res = await api.loginCustomer(credentials);
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('sm_token', res.token);
      localStorage.setItem('sm_user', JSON.stringify(res.user));
    }
    return res;
  };

  const loginAdmin = async (credentials: { email: string; password: string }) => {
    const res = await api.loginAdmin(credentials);
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('sm_token', res.token);
      localStorage.setItem('sm_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('sm_token', res.token);
      localStorage.setItem('sm_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('sm_token');
    localStorage.removeItem('sm_user');
    localStorage.removeItem('apex_token');
    localStorage.removeItem('apex_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = !!user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        loginCustomer,
        loginAdmin,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
