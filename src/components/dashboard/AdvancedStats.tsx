"use client";

import { Card } from "@/components/custom/Card";
import { Badge } from "@/components/ui/badge";
import type { Demande } from "@/types/demande";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useMemo } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "orange" | "red" | "purple";
  subtext?: string;
}

function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = "blue",
  subtext,
}: StatCardProps) {
  const colorClasses = {
    blue: "dark:text-blue-500",
    green: "dark:text-green-500",
    orange: "dark:text-orange-500",
    red: "dark:text-red-500",
    purple: "dark:text-purple-500",
  };

  return (
    <Card className="p-6 transition-all duration-300 flex flex-col justify-between h-full bg-white shadow-sm hover:shadow-md border-none">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-base sm:text-lg font-cormorant-garamond font-semibold text-[#2D5F4F] mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtext && (
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          {change > 0 ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-destructive" />
          )}
          <span
            className={`text-sm font-medium ${
              change > 0 ? "text-success" : "text-destructive"
            }`}
          >
            {change > 0 ? "+" : ""}
            {change}%
          </span>
          {changeLabel && (
            <span className="text-sm text-muted-foreground ml-1">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}

// Composant pour afficher un mini graphique textuel
function MiniChart({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}</span>
      </div>
      <div className="w-full bg-primary/20 rounded-full h-2 overflow-hidden shadow-inner">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

interface AdvancedStatsProps {
  demandes?: Demande[];
}

export function AdvancedStats({ demandes = [] }: AdvancedStatsProps) {
  // Statistiques complètes
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Semaine (lundi -> dimanche)
    const weekStart = new Date(today);
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    weekStart.setDate(today.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Mois
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    // Hier
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // Compter par statut et période
    const filterByPeriod = (startDate: Date, endDate: Date) => {
      return demandes.filter((d) => {
        if (!d.dateRdv) return false;
        const rdvDate = new Date(d.dateRdv);
        return rdvDate >= startDate && rdvDate <= endDate;
      });
    };

    // Soins par période
    const demandesAujourdhui = demandes.filter((d) => {
      if (!d.dateRdv) return false;
      const rdvDate = new Date(d.dateRdv);
      return rdvDate >= today && rdvDate < tomorrow;
    });

    const demandesHier = filterByPeriod(yesterday, today);
    const demandesSemaine = filterByPeriod(weekStart, weekEnd);
    const demandesMois = filterByPeriod(monthStart, monthEnd);

    // Fonction pour compter par statut
    const countByStatus = (demandesArray: Demande[]) => ({
      enAttente: demandesArray.filter((d) => d.statut === "EN_ATTENTE").length,
      confirmee: demandesArray.filter((d) => d.statut === "CONFIRMEE").length,
      enCours: demandesArray.filter((d) => d.statut === "EN_COURS").length,
      terminee: demandesArray.filter((d) => d.statut === "TERMINEE").length,
      annulee: demandesArray.filter((d) => d.statut === "ANNULEE").length,
    });

    // Statistiques de statut
    const statusToday = countByStatus(demandesAujourdhui);
    const statusWeek = countByStatus(demandesSemaine);
    const statusMonth = countByStatus(demandesMois);
    const statusAll = countByStatus(demandes);

    // Calcul des patients uniques
    const uniquePatientsFilter = (demandesArray: Demande[]) => {
      const patientSet = new Set<string>();
      demandesArray.forEach((d) => {
        if (d.patient) {
          patientSet.add(
            `${d.patient.nom}-${d.patient.prenom}-${d.patient.telephone}`.toLowerCase()
          );
        }
      });
      return patientSet.size;
    };

    // Urgences par statut
    const countByUrgency = (demandesArray: Demande[]) => ({
      faible: demandesArray.filter((d) => d.urgence === "FAIBLE").length,
      normale: demandesArray.filter((d) => d.urgence === "NORMALE").length,
      elevee: demandesArray.filter((d) => d.urgence === "ELEVEE").length,
      urgente: demandesArray.filter((d) => d.urgence === "URGENTE").length,
    });

    const urgencyAll = countByUrgency(demandes);
    const urgencyToday = countByUrgency(demandesAujourdhui);

    // Calcul des pourcentages de réussite
    const tauxReussite =
      demandes.length > 0
        ? Math.round(
            (statusAll.terminee /
              (statusAll.terminee + statusAll.annulee || 1)) *
              100
          )
        : 0;

    // Moyenne soins par jour (sur semaine complète)
    const soinsParJour =
      demandesSemaine.length > 0
        ? (demandesSemaine.length / 7).toFixed(1)
        : "0";

    // Évolution jour à jour
    const changeFromYesterday =
      demandesHier.length > 0
        ? Math.round(
            ((demandesAujourdhui.length - demandesHier.length) /
              demandesHier.length) *
              100
          )
        : 0;

    return {
      // Aujourd'hui
      demandesAujourdhui: demandesAujourdhui.length,
      statusToday,
      urgencyToday,
      patientsAujourdhui: uniquePatientsFilter(demandesAujourdhui),

      // Hier
      demandesHier: demandesHier.length,
      changeFromYesterday,

      // Semaine
      demandesSemaine: demandesSemaine.length,
      statusWeek,
      patientsSemaine: uniquePatientsFilter(demandesSemaine),

      // Mois
      demandesMois: demandesMois.length,
      statusMonth,
      patientsMois: uniquePatientsFilter(demandesMois),

      // Global
      demandesTotal: demandes.length,
      statusAll,
      patientsTotal: uniquePatientsFilter(demandes),
      urgencyAll,
      tauxReussite,
      soinsParJour,

      // Détections pour alertes
      demandesEnAttente: statusAll.enAttente,
      demandesEnCours: statusAll.enCours,
      demandesAnnulees: statusAll.annulee,
      demandesTerminees: statusAll.terminee,
      urgencesElevees: urgencyAll.elevee + urgencyAll.urgente,
    };
  }, [demandes]);

  // Alertes intelligentes
  const alerts = useMemo(() => {
    const alertsList: Array<{
      type: "warning" | "error" | "info";
      title: string;
      description: string;
      icon: React.ReactNode;
    }> = [];

    if (stats.demandesEnAttente > 5) {
      alertsList.push({
        type: "warning",
        title: `${stats.demandesEnAttente} demandes en attente`,
        description:
          "Plusieurs demandes attendent une confirmation. Vérifiez-les rapidement.",
        icon: <AlertTriangle className="w-5 h-5" />,
      });
    }

    if (stats.demandesAnnulees > stats.demandesTerminees * 0.2) {
      alertsList.push({
        type: "error",
        title: `Taux d'annulation élevé (${Math.round((stats.demandesAnnulees / (stats.demandesTerminees + stats.demandesAnnulees)) * 100) || 0}%)`,
        description: "Vérifiez vos confirmations et rappels avant RDV.",
        icon: <AlertCircle className="w-5 h-5" />,
      });
    }

    if (stats.urgencesElevees > 3) {
      alertsList.push({
        type: "error",
        title: `${stats.urgencesElevees} soins urgents`,
        description: "Plusieurs demandes nécessitent une action prioritaire.",
        icon: <Zap className="w-5 h-5" />,
      });
    }

    if (stats.demandesAujourdhui === 0) {
      alertsList.push({
        type: "info",
        title: "Aucun rendez-vous aujourd'hui",
        description: "Votre agenda est dégagé. Parfait pour la prévention !",
        icon: <CheckCircle className="w-5 h-5" />,
      });
    }

    return alertsList;
  }, [stats]);

  return (
    <div className="space-y-4">
      {/* Vue additionnelle avec détails patients - OPTIONNEL */}
      <div>
        {/* En-tête */}
        <div>
          <h1 className="text-4xl font-cormorant-garamond font-bold text-[#2D5F4F] mb-2">
            📅 Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Vue d&apos;ensemble de votre cabinet médical
          </p>
        </div>
      </div>

      {/* Alertes intelligentes */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, idx) => {
            const bgColor = {
              warning:
                "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
              error:
                "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
              info: "bg-[#2D5F4F]/5 border-[#2D5F4F]/10",
              success:
                "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
            }[alert.type];

            const textColor = {
              warning: "text-orange-700 dark:text-orange-400",
              error: "text-red-700 dark:text-red-400",
              info: "text-[#2D5F4F]",
              success: "text-green-700 dark:text-green-400",
            }[alert.type];

            return (
              <Card key={idx} className={`${bgColor} p-4 border flex gap-3 `}>
                <div className={textColor}>{alert.icon}</div>
                <div className="flex-1 space-y-2">
                  <p className={`font-cormorant-garamond font-bold text-xl ${textColor}`}>{alert.title}</p>
                  <p className={`text-sm ${textColor}`}>
                    {alert.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* KPIs Principaux - Aujourd'hui vs Hier */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Soins Aujourd'hui"
          value={stats.demandesAujourdhui}
          change={stats.changeFromYesterday}
          changeLabel="vs hier"
          icon={<Calendar className="w-6 h-6" />}
          color="blue"
          subtext={`${stats.patientsAujourdhui} patient(s) unique(s)`}
        />
        <StatCard
          title="Soins Cette Semaine"
          value={stats.demandesSemaine}
          icon={<BarChart3 className="w-6 h-6" />}
          color="green"
          subtext={`Moy: ${stats.soinsParJour}/jour`}
        />
        <StatCard
          title="Soins Ce Mois"
          value={stats.demandesMois}
          icon={<Target className="w-6 h-6" />}
          color="purple"
          subtext={`${stats.patientsMois} patient(s) unique(s)`}
        />
        <StatCard
          title="Total Patients"
          value={stats.patientsTotal}
          icon={<Users className="w-6 h-6" />}
          color="orange"
          subtext={`${stats.demandesTotal} soins au total`}
        />
      </div>

      {/* Répartition par Statut - Vue Globale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statut - Global */}
        <Card className="p-6 lg:col-span-1 bg-white shadow-sm border-none">
          <h3 className="text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#C8D96F]" />
            État Global
          </h3>
          <div className="space-y-3">
            <MiniChart
              label="En attente"
              value={stats.statusAll.enAttente}
              max={Math.max(
                stats.statusAll.enAttente,
                stats.statusAll.confirmee,
                stats.statusAll.enCours,
                stats.statusAll.terminee,
                stats.statusAll.annulee,
                1
              )}
              color="bg-warning"
            />
            <MiniChart
              label="Confirmée"
              value={stats.statusAll.confirmee}
              max={Math.max(
                stats.statusAll.enAttente,
                stats.statusAll.confirmee,
                stats.statusAll.enCours,
                stats.statusAll.terminee,
                stats.statusAll.annulee,
                1
              )}
              color="bg-chart-1"
            />
            <MiniChart
              label="En cours"
              value={stats.statusAll.enCours}
              max={Math.max(
                stats.statusAll.enAttente,
                stats.statusAll.confirmee,
                stats.statusAll.enCours,
                stats.statusAll.terminee,
                stats.statusAll.annulee,
                1
              )}
              color="bg-chart-2"
            />
            <MiniChart
              label="Terminée"
              value={stats.statusAll.terminee}
              max={Math.max(
                stats.statusAll.enAttente,
                stats.statusAll.confirmee,
                stats.statusAll.enCours,
                stats.statusAll.terminee,
                stats.statusAll.annulee,
                1
              )}
              color="bg-success"
            />
            <MiniChart
              label="Annulée"
              value={stats.statusAll.annulee}
              max={Math.max(
                stats.statusAll.enAttente,
                stats.statusAll.confirmee,
                stats.statusAll.enCours,
                stats.statusAll.terminee,
                stats.statusAll.annulee,
                1
              )}
              color="bg-destructive"
            />
          </div>
        </Card>

        {/* Statut - Aujourd'hui */}
        <Card className="p-6 lg:col-span-1 bg-white shadow-sm border-none">
          <h3 className="text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#C8D96F]" />
            Aujourd&apos;hui
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-chart-1/10 rounded">
              <span className="text-sm font-medium">Confirmées</span>
              <Badge className="bg-chart-1 text-white">
                {stats.statusToday.confirmee}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-chart-2/10 rounded">
              <span className="text-sm font-medium">En cours</span>
              <Badge className="bg-chart-2 text-white">
                {stats.statusToday.enCours}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-warning/10 rounded">
              <span className="text-sm font-medium">En attente</span>
              <Badge className="bg-warning text-white">
                {stats.statusToday.enAttente}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-success/10 rounded">
              <span className="text-sm font-medium">Terminées</span>
              <Badge className="bg-success text-white">
                {stats.statusToday.terminee}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-destructive/10 rounded">
              <span className="text-sm font-medium">Annulées</span>
              <Badge className="bg-destructive text-white">
                {stats.statusToday.annulee}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Urgences */}
        <Card className="p-6 lg:col-span-1 bg-white shadow-sm border-none">
          <h3 className="text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Urgences
          </h3>
          <div className="space-y-3">
            <MiniChart
              label="Faible"
              value={stats.urgencyAll.faible}
              max={Math.max(
                stats.urgencyAll.faible,
                stats.urgencyAll.normale,
                stats.urgencyAll.elevee,
                stats.urgencyAll.urgente,
                1
              )}
              color="bg-success"
            />
            <MiniChart
              label="Normale"
              value={stats.urgencyAll.normale}
              max={Math.max(
                stats.urgencyAll.faible,
                stats.urgencyAll.normale,
                stats.urgencyAll.elevee,
                stats.urgencyAll.urgente,
                1
              )}
              color="bg-chart-1"
            />
            <MiniChart
              label="Élevée"
              value={stats.urgencyAll.elevee}
              max={Math.max(
                stats.urgencyAll.faible,
                stats.urgencyAll.normale,
                stats.urgencyAll.elevee,
                stats.urgencyAll.urgente,
                1
              )}
              color="bg-warning"
            />
            <MiniChart
              label="Urgente"
              value={stats.urgencyAll.urgente}
              max={Math.max(
                stats.urgencyAll.faible,
                stats.urgencyAll.normale,
                stats.urgencyAll.elevee,
                stats.urgencyAll.urgente,
                1
              )}
              color="bg-destructive"
            />
          </div>
        </Card>
      </div>

      {/* Performance et Statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Taux de réussite */}
        <Card className="p-6 bg-white shadow-sm border-none">
          <h3 className="text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#C8D96F]" />
            Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Taux de Réussite</span>
              <Badge className="text-lg px-3 py-1 bg-success">
                {stats.tauxReussite}%
              </Badge>
            </div>
            <div className="w-full bg-primary/20 rounded-full h-3 shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-300 bg-success"
                style={{ width: `${stats.tauxReussite}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Terminées</p>
                <p className="text-2xl font-bold text-success">
                  {stats.statusAll.terminee}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Annulées</p>
                <p className="text-2xl font-bold text-destructive">
                  {stats.statusAll.annulee}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Charge de travail */}
        <Card className="p-6 bg-white shadow-sm border-none">
          <h3 className="text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C8D96F]" />
            Charge de Travail
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary/20 rounded-lg">
              <span className="text-muted-foreground">Moyenne/jour</span>
              <span className="font-bold text-foreground text-lg">
                {stats.soinsParJour} soins
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center p-3 bg-warning-light rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Aujourd&apos;hui
                </p>
                <p className="text-2xl font-bold text-warning">
                  {stats.demandesAujourdhui}
                </p>
              </div>
              <div className="text-center p-3 bg-chart-2-light rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Semaine</p>
                <p className="text-2xl font-bold text-chart-2">
                  {stats.demandesSemaine}
                </p>
              </div>
              <div className="text-center p-3 bg-success-light rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Mois</p>
                <p className="text-2xl font-bold text-success">
                  {stats.demandesMois}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Statuts détaillés par période */}
      <Card className="p-6 bg-white shadow-sm border-none">
        <h3 className="text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#C8D96F]" />
          Résumé des Périodes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Aujourd'hui */}
          <div className="p-4 bg-[#F9F7F2] rounded-lg">
            <p className="font-cormorant-garamond font-semibold mb-3 text-[#2D5F4F]">
              📅 Aujourd&apos;hui
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-foreground">
                  Total
                </span>
                <span className="font-bold">{stats.demandesAujourdhui}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-foreground">
                  Confirmées
                </span>
                <span className="font-bold text-chart-1">
                  {stats.statusToday.confirmee}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-foreground">
                  En cours
                </span>
                <span className="font-bold text-chart-2">
                  {stats.statusToday.enCours}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-foreground">
                  En attente
                </span>
                <span className="font-bold text-warning">
                  {stats.statusToday.enAttente}
                </span>
              </div>
            </div>
          </div>

          {/* Cette semaine */}
          <div className="p-4 bg-[#F9F7F2] rounded-lg">
            <p className="font-cormorant-garamond font-semibold mb-3 text-[#2D5F4F]">📆 Cette Semaine</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-foreground">
                  Total
                </span>
                <span className="font-bold">{stats.demandesSemaine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-foreground">
                  Patients uniques
                </span>
                <span className="font-bold text-success">
                  {stats.patientsSemaine}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-foreground">
                  Moyenne/jour
                </span>
                <span className="font-bold text-success">
                  {stats.soinsParJour}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-foreground">
                  Confirmées
                </span>
                <span className="font-bold text-chart-1">
                  {stats.statusWeek.confirmee}
                </span>
              </div>
            </div>
          </div>

          {/* Ce mois */}
          <div className="p-4 bg-[#F9F7F2] rounded-lg">
            <p className="font-cormorant-garamond font-semibold mb-3 text-[#2D5F4F]">📊 Ce Mois</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-foreground">
                  Total
                </span>
                <span className="font-bold">{stats.demandesMois}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-foreground">
                  Patients uniques
                </span>
                <span className="font-bold text-chart-3">
                  {stats.patientsMois}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-foreground">
                  Terminées
                </span>
                <span className="font-bold text-success">
                  {stats.statusMonth.terminee}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-foreground ">
                  Annulées
                </span>
                <span className="font-bold text-destructive">
                  {stats.statusMonth.annulee}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Légende des statuts */}
      <Card className="p-6 bg-white shadow-sm border-none">
        <h3 className="text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] mb-4">
          Légende des Statuts
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span>En attente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-1"></div>
            <span>Confirmée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-2"></div>
            <span>En cours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span>Terminée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span>Annulée</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
