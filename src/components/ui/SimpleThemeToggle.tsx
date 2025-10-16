"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Éviter l'hydratation mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full bg-muted/50 transition-colors"
        aria-label="Changer le thème"
        title="Changer le thème"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-muted/50 hover:bg-muted/80 transition-all duration-200 hover:scale-105"
      aria-label="Changer le thème"
      title={`Passer en mode ${theme === "dark" ? "clair" : "sombre"}`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-foreground transition-transform duration-200" />
      ) : (
        <Moon className="h-4 w-4 text-foreground transition-transform duration-200" />
      )}
    </button>
  );
}
