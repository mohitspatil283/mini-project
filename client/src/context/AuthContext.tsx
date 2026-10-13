import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken, setStoredToken, removeStoredToken } from '../services/api';

export interface User {
  user_id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: 'GUEST' | 'USER' | 'FACILITY_REPRESENTATIVE' | 'ADMIN';
  status: string;
  assigned_facility?: {
    facility_id: number;
    facility_name: string;
    facility_type: string;
    status: string;
    address?: string;
    city?: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, phone: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const stored = getStoredToken();
      if (!stored) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        removeStoredToken();
        setUser(null);
      }
    } catch (e) {
      removeStoredToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.error || 'Login failed.');
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    const res = await api.register({ name, email, phone, password });
    if (res.success && res.token) {
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.error || 'Registration failed.');
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // Ignore logout api failure if token already expired
    } finally {
      removeStoredToken();
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        role: user ? user.role : 'GUEST',
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
