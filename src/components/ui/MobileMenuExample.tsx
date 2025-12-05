"use client";

import { useState } from "react";
import { HamburgerButton } from "./HamburgerButton";
import { SlideMobileMenu } from "./SlideMobileMenu";

/**
 * Exemple d'utilisation du menu mobile avec le bouton hamburger
 * 
 * Features:
 * - Bouton hamburger animé (3 barres → croix)
 * - Menu qui slide depuis le top avec clip-path inset
 * - Liens avec animation y: 100% → 0% et rotateY avec stagger 0.2s
 * - Animation de fermeture inversée vers le bottom
 */
export function MobileMenuExample() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Bouton hamburger - toujours visible */}
      <HamburgerButton
        isOpen={isMenuOpen}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-white hover:text-white/70"
      />

      {/* Menu mobile avec animations GSAP */}
      <SlideMobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        showModeToggle={true}
        hideOnDesktop={true}
      />
    </>
  );
}

