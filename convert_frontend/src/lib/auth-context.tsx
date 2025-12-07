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
};

type AuthContextValue = {
  auth: AuthState;
  ready: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  setProfile: (profile: Partial<AuthState>) => void;
};

const STORAGE_KEY = "tutor-auth-state";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({});
  const [ready, setReady] = useState(false);

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
    setReady(true);
  }, []);

  const persist = (nextState: AuthState) => {
    setAuth(nextState);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    }
  };

  const login = async ({ email, password }: LoginPayload) => {
    const response = await api.login(email, password);
    const user = await api.getMe(response.token);

    const nextState: AuthState = {
      token: response.token,
      role: user.role,
      email,
      userId: user.userId,
      fullName: user.fullName || email.split("@")[0],
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
      ready,
      login,
      logout,
      setProfile,
    }),
    [auth, ready],
  );

  useEffect(() => {
    const hydrateFromBackend = async () => {
      if (!auth.token) return;
      try {
        const profile = await api.getMe(auth.token);
        persist({
          token: auth.token,
          role: profile.role,
          email: profile.email || auth.email,
          userId: profile.userId,
          fullName:
            profile.fullName || auth.fullName || profile.email?.split("@")[0],
        });
      } catch (error) {
        console.warn("Unable to refresh user profile", error);
        // Keep existing session; the caller can decide to re-auth if needed.
      }
    };
    hydrateFromBackend();
    // We only need to re-run when token changes; persist handles saving.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
