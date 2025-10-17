"use client";

import { Button } from "@/components/custom/Button";
import type { Demande } from "@/types/demande";
import { Calendar, Search } from "lucide-react";
import { useState } from "react";
import { PatientTable } from "./PatientTable";
import { WeekView } from "./WeekView";

interface DashboardTabsProps {
  demandes: Demande[];
  selectedDemande: Demande | null;
  isModalOpen: boolean;
  isLoading: boolean;
  currentWeekStart: Date;
  onDemandeSelect: (demande: Demande) => void;
  onModalClose: () => void;
  onWeekChange: (date: Date) => void;
  onDemandeUpdate: () => void;
}

type TabType = "patients" | "planning";

export function DashboardTabs({
  demandes,
  currentWeekStart,
  onDemandeSelect,
  onWeekChange,
  onDemandeUpdate,
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("patients");

  const tabs = [
    {
      id: "patients" as TabType,
      label: "Patients",
      icon: <Search className="w-4 h-4" />,
      description: "Gestion et recherche des patients",
    },
    {
      id: "planning" as TabType,
      label: "Planning",
      icon: <Calendar className="w-4 h-4" />,
      description: "Vue hebdomadaire des rendez-vous",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "patients":
        return (
          <PatientTable
            demandes={demandes}
            onPatientSelect={(patient) => {
              console.log("Patient sélectionné:", patient);
            }}
          />
        );
      case "planning":
        return (
          <div className="space-y-6">
            {/* Navigation de semaine */}
            <div className="flex items-center justify-between bg-card rounded-lg border-border p-3 sm:p-4 shadow-sm">
              <Button
                onClick={() => {
                  const prevWeek = new Date(currentWeekStart);
                  prevWeek.setDate(currentWeekStart.getDate() - 7);
                  onWeekChange(prevWeek);
                }}
                variant="outline"
                className="text-sm"
              >
                <span className="hidden md:inline">← Semaine précédente</span>
                <span className="md:hidden">←</span>
              </Button>

              <div className="text-center">
                <div className="text-base sm:text-lg font-semibold text-foreground">
                  <span className="block sm:inline">
                    {currentWeekStart.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                  <span className="hidden sm:inline">{" - "}</span>
                  <span className="block sm:inline">
                    {(() => {
                      const weekEnd = new Date(currentWeekStart);
                      weekEnd.setDate(currentWeekStart.getDate() + 6);
                      return weekEnd.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                    })()}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Semaine{" "}
                  {Math.ceil(
                    (currentWeekStart.getTime() -
                      new Date(
                        currentWeekStart.getFullYear(),
                        0,
                        1
                      ).getTime()) /
                      (7 * 24 * 60 * 60 * 1000)
                  )}
                </div>
              </div>

              <Button
                onClick={() => {
                  const nextWeek = new Date(currentWeekStart);
                  nextWeek.setDate(currentWeekStart.getDate() + 7);
                  onWeekChange(nextWeek);
                }}
                variant="outline"
                className="text-sm"
              >
                <span className="hidden md:inline">Semaine suivante →</span>
                <span className="md:hidden">→</span>
              </Button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div className="bg-card rounded-lg border-border p-3 shadow-sm">
                <div className="text-2xl font-bold text-foreground">
                  {demandes.filter((d) => d.statut === "EN_ATTENTE").length}
                </div>
                <div className="text-xs text-muted-foreground">En attente</div>
              </div>
              <div className="bg-card rounded-lg border border-border p-3 shadow-sm">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {demandes.filter((d) => d.statut === "CONFIRMEE").length}
                </div>
                <div className="text-xs text-muted-foreground">Confirmées</div>
              </div>
              <div className="bg-card rounded-lg border border-border p-3 shadow-sm">
                <div className="text-2xl font-bold text-primary">
                  {demandes.filter((d) => d.statut === "EN_COURS").length}
                </div>
                <div className="text-xs text-muted-foreground">En cours</div>
              </div>
              <div className="bg-card rounded-lg border border-border p-3 shadow-sm">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {demandes.filter((d) => d.statut === "TERMINEE").length}
                </div>
                <div className="text-xs text-muted-foreground">Terminées</div>
              </div>
            </div>

            {/* Vue Semaine */}
            {false ? (
              <div className="flex items-center justify-center h-96 bg-card rounded-lg border-border shadow-sm">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">
                    Chargement des demandes...
                  </p>
                </div>
              </div>
            ) : (
              <WeekView
                demandes={demandes}
                weekStart={currentWeekStart}
                onDemandeClick={onDemandeSelect}
                onUpdate={onDemandeUpdate}
                onOptimisticUpdate={(
                  demandeId: string,
                  newDate: Date,
                  newHeureRdv: string
                ) => {
                  // Mise à jour optimiste - à implémenter si nécessaire
                  console.log(
                    "Optimistic update:",
                    demandeId,
                    newDate,
                    newHeureRdv
                  );
                }}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation par onglets */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-40 -mx-4 px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Onglets principaux */}
          <div className="flex flex-wrap gap-1 bg-muted/50 p-1 rounded-lg">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>

          {/* Description de l'onglet actif */}
          <div className="flex-1 flex items-center">
            <p className="text-sm text-muted-foreground">
              {tabs.find((tab) => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="min-h-[600px]">{renderTabContent()}</div>
    </div>
  );
}
