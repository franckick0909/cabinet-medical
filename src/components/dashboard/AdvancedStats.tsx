"use client";

import { Card } from "@/components/custom/Card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Euro,
  MapPin,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "orange" | "red" | "purple";
}

function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = "blue",
}: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400",
    orange:
      "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400",
    red: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400",
    purple:
      "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400",
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  change > 0 ? "text-green-600" : "text-red-600"
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
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function AdvancedStats() {
  // Données simulées - à remplacer par de vraies données
  const stats = {
    totalPatients: 1247,
    patientsChange: 8.2,
    rdvAujourdhui: 12,
    rdvDemain: 15,
    rdvSemaine: 87,
    rdvMois: 342,
    tauxReussite: 96.5,
    tauxAnnulation: 3.2,
    tempsTrajet: 18,
    kmParcourus: 245,
    chiffreAffaires: 12450,
    chiffreChange: 12.5,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Statistiques Avancées
        </h2>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de votre activité
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          change={stats.patientsChange}
          changeLabel="ce mois"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="RDV Aujourd'hui"
          value={stats.rdvAujourdhui}
          icon={<Calendar className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Taux de Réussite"
          value={`${stats.tauxReussite}%`}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Chiffre d'Affaires"
          value={`${stats.chiffreAffaires}€`}
          change={stats.chiffreChange}
          changeLabel="ce mois"
          icon={<Euro className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Planning */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Planning
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Demain</span>
              <Badge variant="secondary">{stats.rdvDemain} RDV</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cette semaine</span>
              <Badge variant="default">{stats.rdvSemaine} RDV</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ce mois</span>
              <Badge variant="outline">{stats.rdvMois} RDV</Badge>
            </div>
          </div>
        </Card>

        {/* Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Taux d&apos;annulation
              </span>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="font-medium">{stats.tauxAnnulation}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Temps trajet moyen</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{stats.tempsTrajet} min</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Km parcourus/mois</span>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{stats.kmParcourus} km</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Alertes et notifications */}
      <Card className="p-6 border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Alertes
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-foreground">
                3 patients à rappeler
              </p>
              <p className="text-sm text-muted-foreground">
                Pour confirmation de RDV demain
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-foreground">
                Planning chargé demain
              </p>
              <p className="text-sm text-muted-foreground">
                15 RDV programmés - prévoir plus de temps
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
