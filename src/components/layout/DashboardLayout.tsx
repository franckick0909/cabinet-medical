"use client";

import { SidebarProvider } from "@/contexts/SidebarContext";
import { DashboardHeader } from "./DashboardHeader";
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

export function DashboardLayout({
  children,
  activeTab,
  onTabChange,
  stats,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      {/* Header spécifique au dashboard */}
      <DashboardHeader activeTab={activeTab} onTabChange={onTabChange} />

      <div className="flex h-screen bg-gradient-to-br from-background via-muted to-accent dark:from-background dark:via-muted dark:to-accent">
        {/* Sidebar - caché automatiquement sur mobile/tablette */}
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          stats={stats}
        />

        {/* Contenu principal */}
        <main className="flex-1 overflow-auto mt-20">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
