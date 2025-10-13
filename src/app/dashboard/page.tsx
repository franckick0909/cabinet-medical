"use client";

import { useCallback, useEffect, useState } from "react";
import { getDemandes } from "../../actions/dashboard";
import { DemandeModal } from "../../components/dashboard/DemandeModal";
import { WeekView } from "../../components/dashboard/WeekView";
import { Button } from "../../components/ui/button";
import type { Demande } from "../../types/demande";

export default function DashboardPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    // Calculer le début de la semaine (lundi)
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Si dimanche (0), aller à -6, sinon aller au lundi
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const loadDemandes = useCallback(async () => {
    setIsLoading(true);
    try {
      // Calculer la date de fin de la semaine (dimanche)
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const result = await getDemandes({
        dateDebut: currentWeekStart,
        dateFin: weekEnd,
      });

      if (result.success && result.data) {
        setDemandes(result.data as unknown as Demande[]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentWeekStart]);

  useEffect(() => {
    loadDemandes();
  }, [loadDemandes]);

  const handleDemandeClick = (demande: Demande) => {
    setSelectedDemande(demande);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDemande(null);
  };

  const handleDemandeUpdate = () => {
    // Recharger les demandes après une mise à jour
    loadDemandes();
  };

  const handleOptimisticUpdate = (
    demandeId: string,
    newDate: Date,
    newHeureRdv: string
  ) => {
    // Mise à jour optimiste de l'état local
    setDemandes((prevDemandes) =>
      prevDemandes.map((d) =>
        d.id === demandeId
          ? { ...d, dateRdv: newDate, heureRdv: newHeureRdv }
          : d
      )
    );
  };

  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToToday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
  };

  // Calculer la date de fin de la semaine pour l'affichage
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(currentWeekStart.getDate() + 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-background dark:via-background dark:to-background pt-16">
      <div className="w-full px-2 sm:px-4 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                📅 Tableau de bord
              </h1>
              <p className="text-muted-foreground">
                Gérez vos rendez-vous et demandes de soins
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={goToToday} variant="outline">
                Aujourd&apos;hui
              </Button>
            </div>
          </div>

          {/* Navigation de semaine */}
          <div className="flex items-center justify-between bg-card rounded-lg border border-border p-3 sm:p-4 shadow-sm">
            <Button
              onClick={goToPreviousWeek}
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
                  {weekEnd.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Semaine{" "}
                {Math.ceil(
                  (currentWeekStart.getTime() -
                    new Date(currentWeekStart.getFullYear(), 0, 1).getTime()) /
                    (7 * 24 * 60 * 60 * 1000)
                )}
              </div>
            </div>

            <Button
              onClick={goToNextWeek}
              variant="outline"
              className="text-sm"
            >
              <span className="hidden md:inline">Semaine suivante →</span>
              <span className="md:hidden">→</span>
            </Button>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
            <div className="bg-card rounded-lg border border-border p-3 shadow-sm">
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
        </div>

        {/* Vue Semaine */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96 bg-card rounded-lg border border-border shadow-sm">
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
            onDemandeClick={handleDemandeClick}
            onUpdate={loadDemandes}
            onOptimisticUpdate={handleOptimisticUpdate}
          />
        )}

        {/* Modal de détails */}
        <DemandeModal
          demande={selectedDemande}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onUpdate={handleDemandeUpdate}
        />
      </div>
    </div>
  );
}
