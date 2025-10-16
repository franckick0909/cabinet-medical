"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Définir l'état initial
    setMatches(mediaQuery.matches);

    // Fonction de callback pour les changements
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Ajouter l'écouteur
    mediaQuery.addEventListener("change", handleChange);

    // Nettoyer l'écouteur
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

// Hook spécifique pour les breakpoints Tailwind
export function useBreakpoint() {
  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");
  const is2Xl = useMediaQuery("(min-width: 1536px)");

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    // Helpers
    isMobile: !isSm,
    isTablet: isSm && !isLg,
    isDesktop: isLg,
  };
}
