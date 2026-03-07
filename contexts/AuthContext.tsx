"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import type { User } from "@/models/user";
import {
  loginAction,
  logoutAction,
  fetchProfileAction,
  googleAuthAction,
} from "@/actions/auth";
import { hasTokens, clearTokens } from "@/utils/tokens";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  googleLogin: (
    idToken: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/confirm",
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname?.startsWith(route),
  );

  // Restaura sessão na montagem.
  // Todos os setState ficam dentro de .then() para evitar setState síncrono no effect.
  useEffect(() => {
    const init = hasTokens()
      ? fetchProfileAction().then((result) => {
          if (result.success && result.data) {
            setUser(result.data);
          } else {
            clearTokens();
            setUser(null);
          }
        })
      : Promise.resolve();

    init.then(() => setIsLoading(false));
  }, []);

  // Route protection: runs after loading is done
  useEffect(() => {
    if (isLoading) return;

    if (!user && !isPublicRoute && pathname !== "/") {
      router.replace("/login");
    } else if (user && isPublicRoute) {
      router.replace("/boards");
    }
  }, [isLoading, user, isPublicRoute, pathname, router]);

  const login = async (email: string, password: string) => {
    const result = await loginAction(email, password);
    if (result.success && result.data) {
      setUser(result.data);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const googleLogin = async (idToken: string) => {
    const result = await googleAuthAction(idToken);
    if (result.success && result.data) {
      setUser(result.data);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = async () => {
    await logoutAction();
    setUser(null);
    router.replace("/login");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        googleLogin,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
