"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PatientService } from "@/services/patientService";
import type { Demande } from "@/types/demande";
import { useMemo, useState } from "react";
import { NotificationCenter } from "./NotificationCenter";
import { OverviewTab } from "./OverviewTab";
import { PatientTableOptimized } from "./PatientTableOptimized";
import { PlanningView } from "./PlanningView";

interface DashboardTabsOptimizedProps {
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

export function DashboardTabsOptimized({
  demandes,
  selectedDemande: _selectedDemande,
  isModalOpen: _isModalOpen,
  isLoading: _isLoading,
  currentWeekStart,
  onDemandeSelect,
  onModalClose: _onModalClose,
  onWeekChange,
  onDemandeUpdate,
}: DashboardTabsOptimizedProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculer les statistiques pour le sidebar
  const patients = useMemo(() => {
    return PatientService.extractPatientsFromDemandes(demandes);
  }, [demandes]);

  const stats = useMemo(() => {
    return PatientService.calculateStats(patients, demandes);
  }, [patients, demandes]);

  // Fonction pour gérer l'envoi de notifications
  const handleSendNotification = (demandeId: string, type: "sms" | "email") => {
    console.log(`Envoi de notification ${type} pour la demande ${demandeId}`);
    // Ici on pourrait intégrer avec un service de notification réel
    // Par exemple: NotificationService.send(demandeId, type);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab demandes={demandes} />;

      case "patients":
        return (
          <PatientTableOptimized
            demandes={demandes}
            onPatientSelect={(patient) => {
              console.log("Patient sélectionné:", patient);
            }}
          />
        );

      case "planning":
        return (
          <PlanningView
            demandes={demandes}
            onDemandeSelect={onDemandeSelect}
            onDemandeUpdate={onDemandeUpdate}
            currentWeekStart={currentWeekStart}
            onWeekChange={onWeekChange}
          />
        );

      case "notifications":
        return (
          <NotificationCenter
            demandes={demandes}
            onSendNotification={handleSendNotification}
          />
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      stats={stats}
    >
      {renderTabContent()}
    </DashboardLayout>
  );
}
