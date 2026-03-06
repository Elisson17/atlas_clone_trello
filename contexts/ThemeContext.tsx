"use client";

import { createContext, useContext, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

interface ThemeContextType {
  theme: string | undefined;
  resolvedTheme: string | undefined;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <ThemeContextBridge>{children}</ThemeContextBridge>
    </NextThemesProvider>
  );
}

function ThemeContextBridge({ children }: { children: ReactNode }) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
        isDark: resolvedTheme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useThemeContext deve ser usado dentro de ThemeProvider");
  return context;
}
