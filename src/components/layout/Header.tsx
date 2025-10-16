"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { SlideMobileMenu } from "@/components/ui/SlideMobileMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

  // Préparer les items du menu mobile
  const menuItems = [
    {
      id: "header-home",
      href: "/",
      label: "Home",
      icon: "🏠",
      isActive: pathname === "/",
    },
    {
      id: "header-dashboard",
      href: "/dashboard",
      label: "Dashboard",
      icon: "📊",
      isActive: pathname?.includes("/dashboard"),
    },
    {
      id: "header-demande",
      href: "/demande/soins",
      label: "Nouvelle demande",
      icon: "➕",
      isActive: pathname?.includes("/demande"),
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl mx-2 sm:mx-4 lg:mx-auto lg:max-w-7xl h-16 sm:h-18 py-2 sm:py-4 rounded-2xl sm:rounded-full bg-primary-foreground/10 mt-2 sm:mt-4 border border-border px-3 sm:px-4 lg:px-6 xl:px-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity flex-shrink-0"
              onClick={closeMobileMenu}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-200 rounded-lg flex items-center justify-center">
                <span className="text-background text-xs sm:text-sm font-bold">
                  H
                </span>
              </div>
              <span className="text-foreground font-normal text-sm sm:text-lg xl:text-2xl font-kaushan-script truncate">
                <span className="hidden sm:inline">Cabinet Harmonie</span>
                <span className="sm:hidden">Harmonie</span>
              </span>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-8 text-sm lg:text-base xl:text-lg font-kaushan-script font-normal">
              <Link
                href="/"
                className={`transition-colors hover:text-primary px-3 py-1 rounded-md ${
                  pathname === "/"
                    ? "text-primary bg-primary/10"
                    : "text-foreground/80 dark:text-foreground/70 hover:text-foreground hover:bg-primary/5"
                }`}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className={`transition-colors hover:text-primary px-3 py-1 rounded-md ${
                  pathname?.includes("/dashboard")
                    ? "text-primary bg-primary/10"
                    : "text-foreground/80 dark:text-foreground/70 hover:text-foreground hover:bg-primary/5"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/demande/soins"
                className={`transition-colors hover:text-primary px-3 py-1 rounded-md whitespace-nowrap ${
                  pathname?.includes("/demande")
                    ? "text-primary bg-primary/10"
                    : "text-foreground/80 dark:text-foreground/70 hover:text-foreground hover:bg-primary/5"
                }`}
              >
                Nouvelle demande
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="hidden sm:block">
                <ModeToggle />
              </div>

              {/* Menu mobile */}
              <button
                className="lg:hidden px-4 py-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-primary/5 font-kaushan-script text-sm font-medium border border-border/50 hover:border-primary/20"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? "Fermer" : "Menu"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile en glissière */}
      <SlideMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        menuItems={menuItems}
        showModeToggle={true}
      />
    </>
  );
}
