import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/auth.js';
import {
  getMeApi,
  loginApi,
  registerApi,
  logoutApi,
  clearStoredAuth,
  getStoredToken
} from '../services/auth.service.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (username: string, email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always validate with backend; do NOT trust stale data without validation
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    // If no token exists in session/local storage, immediately clear and finish
    if (!getStoredToken()) {
      clearStoredAuth();
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getMeApi();
      setUser(currentUser);
    } catch {
      clearStoredAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (emailOrUsername: string, password: string, rememberMe: boolean = false) => {
    const res = await loginApi(emailOrUsername, password, rememberMe);
    setUser(res.user);
  };

  const register = async (username: string, email: string, password: string, rememberMe: boolean = false) => {
    const res = await registerApi(username, email, password, rememberMe);
    setUser(res.user);
  };

  const logout = async () => {
    await logoutApi();
    clearStoredAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
