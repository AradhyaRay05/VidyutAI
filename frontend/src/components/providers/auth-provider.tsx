"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import { api } from "@/lib/api";

interface User {
  user_id: number;
  username: string;
  email: string;
  full_name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; full_name?: string; household_size?: number; tariff_rate?: number }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initRef = useRef(false);

  const initAuth = useCallback(() => {
    if (initRef.current) return;
    initRef.current = true;

    const stored = localStorage.getItem("vidyutai_token");
    if (stored) {
      setToken(stored);
      api.auth
        .status(stored)
        .then((res) => {
          if (res.authenticated) setUser(res.user);
          else {
            localStorage.removeItem("vidyutai_token");
            setToken(null);
          }
        })
        .catch(() => {
          localStorage.removeItem("vidyutai_token");
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.auth.login(username, password);
    localStorage.setItem("vidyutai_token", res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (data: { username: string; email: string; password: string; full_name?: string; household_size?: number; tariff_rate?: number }) => {
    await api.auth.register(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("vidyutai_token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      <AuthInit onInit={initAuth} />
      {children}
    </AuthContext.Provider>
  );
}

function AuthInit({ onInit }: { onInit: () => void }) {
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) onInit();
  }, [onInit]);
  return <div ref={ref} className="hidden" />;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
