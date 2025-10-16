"use client";

import { getDemandes } from "@/actions/dashboard";
import { DashboardTabsOptimized } from "@/components/dashboard/DashboardTabsOptimized";
import { DemandeModal } from "@/components/dashboard/DemandeModal";
import type { Demande } from "@/types/demande";
import { useCallback, useEffect, useState } from "react";

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

  // Ces fonctions sont maintenant gérées dans DashboardTabs

  return (
    <div className="h-screen">
      <DashboardTabsOptimized
        demandes={demandes}
        selectedDemande={selectedDemande}
        isModalOpen={isModalOpen}
        isLoading={isLoading}
        currentWeekStart={currentWeekStart}
        onDemandeSelect={handleDemandeClick}
        onModalClose={handleModalClose}
        onWeekChange={setCurrentWeekStart}
        onDemandeUpdate={handleDemandeUpdate}
      />

      <DemandeModal
        demande={selectedDemande}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handleDemandeUpdate}
      />
    </div>
  );
}
