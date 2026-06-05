'use client';
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@/lib/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const stored = localStorage.getItem('manga_token');
    if (!stored) { setLoading(false); return; }
    try {
      const u = await api.me();
      setUser(u);
      setToken(stored);
    } catch {
      localStorage.removeItem('manga_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { token: t, user: u } = await api.login(email, password);
    localStorage.setItem('manga_token', t);
    setToken(t);
    setUser(u);
  };

  const register = async (username: string, email: string, password: string) => {
    const { token: t, user: u } = await api.register(username, email, password);
    localStorage.setItem('manga_token', t);
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('manga_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
