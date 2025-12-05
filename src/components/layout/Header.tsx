"use client";

import { SlideMobileMenu } from "@/components/ui/SlideMobileMenu";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SimpleThemeToggle } from "../ui/SimpleThemeToggle";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Vérifier si on est sur le dashboard (ne pas afficher le header sur le dashboard)
  const isDashboard = pathname?.includes("/dashboard");

  // Ne pas afficher le header sur le dashboard car il a son propre DashboardHeader
  if (isDashboard) {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mix-blend-difference">
          <div className="flex items-center justify-between h-16 ">
            {/* Logo minimaliste */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={closeMobileMenu}
            >
              <span className="text-xl font-medium text-foreground group-hover:text-primary transition-colors duration-300 font-marcellus uppercase tracking-tight">
                Harmonie
              </span>
            </Link>

            {/* Actions droite */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex items-center py-2 px-4 rounded-full gap-12 mix-blend-difference justify-center bg-foreground backdrop-blur-sm border border-primary-foreground/10"
            >
              {/* Theme toggle - visible partout */}
              <div className="relative z-10">
                <SimpleThemeToggle />
              </div>

              {/* Séparateur élégant avec gradient */}
              <div className="h-full w-px bg-gradient-to-b from-transparent via-background to-transparent absolute left-1/2 -translate-x-1/2" />

              {/* Menu button avec animation - visible partout */}
              <motion.button
                type="button"
                onClick={toggleMobileMenu}
                className="relative z-10 overflow-hidden h-6 flex items-center justify-center text-background"
                aria-label={
                  isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"
                }
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isMobileMenuOpen ? "fermer" : "menu"}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      mass: 0.8,
                    }}
                    className="text-xs font-medium uppercase tracking-wider block"
                  >
                    {isMobileMenuOpen ? "Fermer" : "Menu"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Menu fullscreen avec images */}
      <SlideMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />
    </>
  );
}
