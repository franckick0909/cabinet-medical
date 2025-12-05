"use client";

import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback } from "react";
import Portal from "../Portal";
import { SlideMobileMenu } from "../ui/SlideMobileMenu";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats?: {
    totalPatients: number;
    patientsActifs: number;
    nouveauxPatients: number;
    patientsUrgents: number;
    rdvAujourdhui: number;
    rdvSemaine: number;
    rdvMois: number;
    patientsAujourdhui: number;
    patientsCetteSemaine: number;
    patientsCeMois: number;
    soinsTermines: number;
    soinsEnCours: number;
    soinsEnAttente: number;
    tauxSatisfaction: number;
    nouveauxCetteSemaine: number;
    nouveauxCeMois: number;
    rdvAnnules: number;
    rdvReportes: number;
    urgenceFaible: number;
    urgenceNormale: number;
    urgenceElevee: number;
    urgenceUrgente: number;
    patientsMoyenneAge: number;
    soinsParJour: number;
    tempsAttenteMoyen: number;
    pathologiesFrequentes: Array<{ nom: string; count: number }>;
  };
}

// Composant interne pour accéder au contexte
function DashboardContent({
  children,
  activeTab,
  onTabChange,
  stats,
}: DashboardLayoutProps) {
  const { isMobileMenuOpen, toggleMobileMenu } = useSidebar();

  const handleCloseMenu = useCallback(() => {
    toggleMobileMenu();
  }, [toggleMobileMenu]);

  return (
    <>
      <div className="flex h-screen bg-[#F9F7F2] text-[#1a1a1a] z-[300]">
        {/* Sidebar - toujours visible (collapsed sur tablette, étendu sur desktop) */}
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          stats={stats}
        />

        {/* Contenu principal */}
        <main className="flex-1 overflow-auto relative">
          <div className="h-full pt-20 pb-6">
            <div className="mx-auto max-w-[1600px] px-6 md:px-12">{children}</div>
          </div>
        </main>
      </div>

      {/* Bouton Menu - visible sur tous les supports quand le menu est fermé */}
      {!isMobileMenuOpen && (
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label="Ouvrir le menu"
          className="fixed top-6 right-8 z-[200] group flex font-oswald uppercase text-sm lg:text-base font-normal tracking-wide transition-all duration-500 items-center justify-center text-[var(--foreground)] hover:text-white hover:bg-[var(--primary)] w-auto px-4 py-2 overflow-hidden rounded-full border border-[var(--primary)]"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key="menu"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{
                y: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 0.3 },
              }}
            >
              Menu
            </motion.span>
          </AnimatePresence>
        </button>
      )}

      {/* Menu Mobile - même menu que la homepage (slide depuis la droite) */}
      <SlideMobileMenu isOpen={isMobileMenuOpen} onClose={handleCloseMenu} />

      {/* Bouton Fermer flottant - visible sur tous les supports quand le menu est ouvert */}
      {isMobileMenuOpen && (
        <Portal>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Fermer le menu"
            className="fixed top-6 right-8 z-[99999] group flex font-oswald uppercase text-sm lg:text-base font-normal tracking-wide transition-all duration-500 items-center justify-center backdrop-blur-md text-white overflow-hidden hover:bg-[#C8D96F] hover:text-[var(--foreground)] px-4 py-2 rounded-full border border-[#C8D96F]"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key="fermer"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{
                  y: { duration: 0.3, delay: 0.3, ease: "easeOut" },
                  opacity: { duration: 0.5 },
                }}
              >
                Fermer
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </Portal>
      )}
    </>
  );
}

export function DashboardLayout({
  children,
  activeTab,
  onTabChange,
  stats,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardContent
        activeTab={activeTab}
        onTabChange={onTabChange}
        stats={stats}
      >
        {children}
      </DashboardContent>
    </SidebarProvider>
  );
}
