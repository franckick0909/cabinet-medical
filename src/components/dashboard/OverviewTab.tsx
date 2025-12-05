"use client";

import { Card } from "@/components/custom/Card";
import { AdvancedStats } from "@/components/dashboard/AdvancedStats";
import { Badge } from "@/components/ui/badge";
import { PatientService } from "@/services/patientService";
import type { Demande } from "@/types/demande";
import { AlertTriangle, Calendar, ChevronDown, Clock } from "lucide-react";
import { useMemo, useState } from "react";

interface OverviewTabProps {
  demandes: Demande[];
}

export function OverviewTab({ demandes }: OverviewTabProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "patients-details"
  );

  const patients = useMemo(() => {
    return PatientService.extractPatientsFromDemandes(demandes);
  }, [demandes]);

  const recentPatients = useMemo(() => {
    return patients
      .filter((p) => p.derniereSoin)
      .sort(
        (a, b) =>
          (b.derniereSoin?.getTime() || 0) - (a.derniereSoin?.getTime() || 0)
      )
      .slice(0, 5);
  }, [patients]);

  const urgentPatients = useMemo(() => {
    return patients.filter((p) => p.estUrgent).slice(0, 3);
  }, [patients]);

  const upcomingAppointments = useMemo(() => {
    return patients
      .filter((p) => p.prochainRdv && p.prochainRdv > new Date())
      .sort(
        (a, b) =>
          (a.prochainRdv?.getTime() || 0) - (b.prochainRdv?.getTime() || 0)
      )
      .slice(0, 5);
  }, [patients]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="px-2 py-4 sm:p-4 space-y-4 sm:space-y-6">
      {/* Tableau de bord complet - KPIs et statistiques */}
      <AdvancedStats demandes={demandes} />

      {/* Section détails patients - Collapsible */}
      <div className="space-y-3">
        <div
          onClick={() => toggleSection("patients-details")}
          className="cursor-pointer flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <h3 className="text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] flex items-center gap-2">
            👥 Détails Patients
          </h3>
          <ChevronDown
            className={`w-6 h-6 text-muted-foreground transition-transform ${
              expandedSection === "patients-details" ? "rotate-180" : ""
            }`}
          />
        </div>

        {expandedSection === "patients-details" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Patients urgents */}
            <Card className="p-4 sm:p-6 border-none shadow-md bg-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h4 className="text-lg font-cormorant-garamond font-semibold text-[#2D5F4F]">
                  Patients Urgents
                </h4>
                <Badge variant="destructive" className="ml-auto">
                  {urgentPatients.length}
                </Badge>
              </div>

              {urgentPatients.length === 0 ? (
                <div className="flex items-center gap-2 text-success text-sm">
                  <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center">
                    <span className="text-success text-xs font-bold">✓</span>
                  </div>
                  Aucun patient urgent
                </div>
              ) : (
                <div className="space-y-2">
                  {urgentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg hover:bg-red-50 transition-colors border border-red-100"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {patient.prenom} {patient.nom}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {patient.telephone}
                        </p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Prochains RDV */}
            <Card className="p-4 sm:p-6 border-none shadow-md bg-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#2D5F4F]/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#2D5F4F]" />
                </div>
                <h4 className="text-lg font-cormorant-garamond font-semibold text-[#2D5F4F]">
                  Prochains RDV
                </h4>
                <Badge variant="default" className="ml-auto">
                  {upcomingAppointments.length}
                </Badge>
              </div>

              {upcomingAppointments.length === 0 ? (
                <div className="flex items-center gap-2 text-success text-sm">
                  <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center">
                    <span className="text-success text-xs font-bold">✓</span>
                  </div>
                  Aucun RDV programmé
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingAppointments.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-3 bg-[#F9F7F2] rounded-lg hover:bg-[#F9F7F2]/80 transition-colors border border-[#2D5F4F]/5"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {patient.prenom} {patient.nom}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {patient.telephone}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#2D5F4F]">
                          {patient.prochainRdv?.toLocaleDateString("fr-FR")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {patient.prochainRdv?.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Activité récente */}
            <Card className="p-4 sm:p-6 border-none shadow-md bg-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#C8D96F]/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#2D5F4F]" />
                </div>
                <h4 className="text-lg font-cormorant-garamond font-semibold text-[#2D5F4F]">
                  Activité Récente
                </h4>
                <Badge variant="success" className="ml-auto">
                  {recentPatients.length}
                </Badge>
              </div>

              {recentPatients.length === 0 ? (
                <div className="flex items-center gap-2 text-success text-sm">
                  <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center">
                    <span className="text-success text-xs font-bold">✓</span>
                  </div>
                  Aucune activité récente
                </div>
              ) : (
                <div className="space-y-2">
                  {recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-3 bg-[#F9F7F2] rounded-lg hover:bg-[#F9F7F2]/80 transition-colors border border-[#C8D96F]/20"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {patient.prenom} {patient.nom}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {patient.soinsRecus[patient.soinsRecus.length - 1]
                            ?.soin || "Soin"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#2D5F4F]">
                          {patient.derniereSoin?.toLocaleDateString("fr-FR")}
                        </p>
                        <Badge
                          variant="outlined"
                          className="text-xs mt-1 border-success/30"
                        >
                          {patient.soinsRecus[patient.soinsRecus.length - 1]
                            ?.statut || "Terminé"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
