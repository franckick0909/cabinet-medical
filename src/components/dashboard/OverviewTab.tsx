"use client";

import { Card } from "@/components/custom/Card";
import { Badge } from "@/components/ui/badge";
import { PatientService } from "@/services/patientService";
import type { Demande } from "@/types/demande";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo } from "react";

interface OverviewTabProps {
  demandes: Demande[];
}

export function OverviewTab({ demandes }: OverviewTabProps) {
  const patients = useMemo(() => {
    return PatientService.extractPatientsFromDemandes(demandes);
  }, [demandes]);

  const stats = useMemo(() => {
    return PatientService.calculateStats(patients, demandes);
  }, [patients, demandes]);

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

  return (
    <div className="p-4 space-y-4">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          📅 Tableau de bord
        </h1>
        <p className="text-muted-foreground">
          Vue &apos;ensemble de votre cabinet médical
        </p>
      </div>

       {/* Statistiques principales */}
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
         <Card className="p-4 ">
           <div className="flex items-center gap-3">
             <Users className="w-8 h-8 text-blue-500 " />
             <div>
               <p className="text-2xl font-bold text-blue-600">
                 {stats.totalPatients}
               </p>
               <p className="text-sm text-blue-600">Total patients</p>
             </div>
           </div>
         </Card>

         <Card className="p-4">
           <div className="flex items-center gap-3">
             <Activity className="w-8 h-8 text-green-500" />
             <div>
               <p className="text-2xl font-bold text-green-600">
                 {stats.patientsActifs}
               </p>
               <p className="text-sm text-green-600">Actifs</p>
             </div>
           </div>
         </Card>

         <Card className="p-4">
           <div className="flex items-center gap-3">
             <TrendingUp className="w-8 h-8 text-purple-500" />
             <div>
               <p className="text-2xl font-bold text-purple-600">
                 {stats.nouveauxPatients}
               </p>
               <p className="text-sm text-purple-600">Nouveaux ce mois</p>
             </div>
           </div>
         </Card>

         <Card className="p-4">
           <div className="flex items-center gap-3">
             <AlertTriangle className="w-8 h-8 text-red-500" />
             <div>
               <p className="text-2xl font-bold text-red-600">
                 {stats.patientsUrgents}
               </p>
               <p className="text-sm text-red-600">Urgents</p>
             </div>
           </div>
         </Card>

         <Card className="p-4">
           <div className="flex items-center gap-3">
             <Calendar className="w-8 h-8 text-orange-500" />
             <div>
               <p className="text-2xl font-bold text-orange-600">
                 {stats.rdvAujourdhui}
               </p>
               <p className="text-sm text-orange-600">RDV aujourd&apos;hui</p>
             </div>
           </div>
         </Card>

         <Card className="p-4">
           <div className="flex items-center gap-3">
             <CheckCircle className="w-8 h-8 text-teal-500" />
             <div>
               <p className="text-2xl font-bold text-teal-600">
                 {stats.rdvSemaine}
               </p>
               <p className="text-sm text-teal-600">RDV semaine</p>
             </div>
           </div>
         </Card>
       </div>

       {/* Statistiques détaillées */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
         {/* Soins */}
         <Card className="p-6">
           <div className="flex items-center gap-2 mb-4">
             <CheckCircle className="w-5 h-5 text-blue-500" />
             <h3 className="text-lg font-semibold text-foreground">Soins</h3>
           </div>
           <div className="space-y-3">
             <div className="flex justify-between items-center">
               <span className="text-sm text-muted-foreground">Terminés</span>
               <span className="font-semibold text-green-600">{stats.soinsTermines}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-muted-foreground">En cours</span>
               <span className="font-semibold text-blue-600">{stats.soinsEnCours}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-muted-foreground">En attente</span>
               <span className="font-semibold text-orange-600">{stats.soinsEnAttente}</span>
             </div>
           </div>
         </Card>

         {/* Urgences */}
         <Card className="p-6">
           <div className="flex items-center gap-2 mb-4">
             <AlertTriangle className="w-5 h-5 text-red-500" />
             <h3 className="text-lg font-semibold text-foreground">Urgences</h3>
           </div>
           <div className="space-y-3">
             <div className="flex justify-between items-center">
               <span className="text-sm text-muted-foreground">Urgente</span>
               <span className="font-semibold text-red-600">{stats.urgenceUrgente}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-muted-foreground">Élevée</span>
               <span className="font-semibold text-orange-600">{stats.urgenceElevee}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-muted-foreground">Normale</span>
               <span className="font-semibold text-blue-600">{stats.urgenceNormale}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-muted-foreground">Faible</span>
               <span className="font-semibold text-green-600">{stats.urgenceFaible}</span>
             </div>
           </div>
         </Card>

         {/* Performance */}
         <Card className="p-6">
           <div className="flex items-center gap-2 mb-4">
             <TrendingUp className="w-5 h-5 text-purple-500" />
             <h3 className="text-lg font-semibold text-foreground">Performance</h3>
           </div>
           <div className="space-y-3">
             <div className="flex justify-between items-center">
               <span className="text-sm text-muted-foreground">Satisfaction</span>
               <span className="font-semibold text-green-600">{stats.tauxSatisfaction}%</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-muted-foreground">Soins/jour</span>
               <span className="font-semibold text-blue-600">{stats.soinsParJour}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-muted-foreground">Attente moy.</span>
               <span className="font-semibold text-orange-600">{stats.tempsAttenteMoyen}h</span>
             </div>
           </div>
         </Card>

         {/* Démographie */}
         <Card className="p-6">
           <div className="flex items-center gap-2 mb-4">
             <Users className="w-5 h-5 text-indigo-500" />
             <h3 className="text-lg font-semibold text-foreground">Démographie</h3>
           </div>
           <div className="space-y-3">
             <div className="flex justify-between items-center">
               <span className="text-sm text-muted-foreground">Âge moyen</span>
               <span className="font-semibold text-indigo-600">{stats.patientsMoyenneAge} ans</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-muted-foreground">Nouveaux/semaine</span>
               <span className="font-semibold text-purple-600">{stats.nouveauxCetteSemaine}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-muted-foreground">RDV ce mois</span>
               <span className="font-semibold text-teal-600">{stats.rdvMois}</span>
             </div>
           </div>
         </Card>
       </div>

      {/* Grille de contenu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {/* Patients urgents */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-foreground">
              Patients urgents
            </h3>
          </div>

          {urgentPatients.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Aucun patient urgent
            </p>
          ) : (
            <div className="space-y-3">
              {urgentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 bg-red-50/50 dark:bg-red-950/10 rounded-lg"
                >
                  <div>
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
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-foreground">
              Prochains RDV
            </h3>
          </div>

          {upcomingAppointments.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucun RDV programmé</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-950/10 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {patient.prenom} {patient.nom}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {patient.telephone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">
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
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-foreground">
              Activité récente
            </h3>
          </div>

          {recentPatients.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Aucune activité récente
            </p>
          ) : (
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 bg-green-50/50 dark:bg-green-950/10 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {patient.prenom} {patient.nom}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {patient.soinsRecus[patient.soinsRecus.length - 1]
                        ?.soin || "Soin"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {patient.derniereSoin?.toLocaleDateString("fr-FR")}
                    </p>
                    <Badge variant="outline" className="text-xs">
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
    </div>
  );
}
