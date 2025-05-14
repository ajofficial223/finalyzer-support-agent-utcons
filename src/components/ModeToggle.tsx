import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/ThemeProvider";

export function ModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-background/80 backdrop-blur-md border border-border/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-foreground transition-all" />
      ) : (
        <Sun className="h-5 w-5 text-foreground transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
} 