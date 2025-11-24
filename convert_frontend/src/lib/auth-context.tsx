'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "./api";
import { Role } from "@/types/api";

type AuthState = {
  token?: string;
  userId?: string;
  role?: Role;
  fullName?: string;
  email?: string;
};

type LoginPayload = {
  email: string;
  password: string;
  role: Role;
  userId?: string;
  fullName?: string;
};

type AuthContextValue = {
  auth: AuthState;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  setProfile: (profile: Partial<AuthState>) => void;
};

const STORAGE_KEY = "tutor-auth-state";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setAuth(JSON.parse(raw));
      } catch (error) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const persist = (nextState: AuthState) => {
    setAuth(nextState);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    }
  };

  const login = async ({ email, password, role, userId, fullName }: LoginPayload) => {
    const response = await api.login(email, password);
    const nextState: AuthState = {
      token: response.token,
      role,
      email,
      userId,
      fullName: fullName || email.split("@")[0],
    };
    persist(nextState);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setAuth({});
  };

  const setProfile = (profile: Partial<AuthState>) => {
    persist({ ...auth, ...profile });
  };

  const value = useMemo(
    () => ({
      auth,
      login,
      logout,
      setProfile,
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
