"use client";

import { Sun, Moon } from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#1e2035] bg-[#111120] hover:bg-[#1a1a2e] text-slate-400 hover:text-slate-200 transition-colors"
    >
      {/* Both icons always rendered — CSS controls visibility based on .dark class on <html> */}
      <Sun className="h-4 w-4 hidden dark:block" />
      <Moon className="h-4 w-4 block dark:hidden" />
    </button>
  );
}
