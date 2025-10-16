"use client";

import { Button } from "@/components/custom/Button";
import { Badge } from "@/components/ui/badge";
import type { Demande } from "@/types/demande";
import { ChevronLeft, ChevronRight, Grid3X3, List } from "lucide-react";
import { useMemo, useState } from "react";
import { WeekView } from "./WeekView";

interface PlanningViewProps {
  demandes: Demande[];
  onDemandeSelect: (demande: Demande) => void;
  onDemandeUpdate: () => void;
  currentWeekStart?: Date;
  onWeekChange?: (date: Date) => void;
}

type ViewType = "week" | "month";

export function PlanningView({
  demandes,
  onDemandeSelect,
  onDemandeUpdate,
  currentWeekStart,
  onWeekChange,
}: PlanningViewProps) {
  const [viewType, setViewType] = useState<ViewType>("week");
  const [currentDate, setCurrentDate] = useState(
    currentWeekStart || new Date()
  );
  // const [showFilters, setShowFilters] = useState(false); // Unused for now

  // Calculer les dates de début et fin selon la vue
  const { startDate, endDate, title } = useMemo(() => {
    const date = new Date(currentDate);

    if (viewType === "week") {
      // Début de la semaine (lundi)
      const day = date.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      const start = new Date(date);
      start.setDate(date.getDate() + diff);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      const weekTitle = `${start.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
      })} - ${end.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`;

      return { startDate: start, endDate: end, title: weekTitle };
    } else {
      // Début et fin du mois
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);

      const monthTitle = date.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });

      return { startDate: start, endDate: end, title: monthTitle };
    }
  }, [currentDate, viewType]);

  // Filtrer les demandes pour la période
  const filteredDemandes = useMemo(() => {
    return demandes.filter((demande) => {
      if (!demande.dateRdv) return false;
      const demandeDate = new Date(demande.dateRdv);
      return demandeDate >= startDate && demandeDate <= endDate;
    });
  }, [demandes, startDate, endDate]);

  // Statistiques pour la période
  const periodStats = useMemo(() => {
    const total = filteredDemandes.length;
    const confirmees = filteredDemandes.filter(
      (d) => d.statut === "CONFIRMEE"
    ).length;
    const enCours = filteredDemandes.filter(
      (d) => d.statut === "EN_COURS"
    ).length;
    const terminees = filteredDemandes.filter(
      (d) => d.statut === "TERMINEE"
    ).length;
    const urgentes = filteredDemandes.filter(
      (d) => d.urgence === "URGENTE"
    ).length;

    return { total, confirmees, enCours, terminees, urgentes };
  }, [filteredDemandes]);

  // Navigation
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewType === "week") {
      newDate.setDate(currentDate.getDate() - 7);
      if (onWeekChange) {
        onWeekChange(newDate);
      }
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewType === "week") {
      newDate.setDate(currentDate.getDate() + 7);
      if (onWeekChange) {
        onWeekChange(newDate);
      }
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    if (viewType === "week" && onWeekChange) {
      onWeekChange(today);
    }
  };

  // Obtenir les jours pour l'affichage
  const getDaysToDisplay = () => {
    const days = [];

    if (viewType === "week") {
      // 7 jours de la semaine
      for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        days.push(day);
      }
    } else {
      // Tous les jours du mois
      const firstDay = new Date(startDate);
      const lastDay = new Date(endDate);

      // Commencer par le lundi de la première semaine
      const startOfCalendar = new Date(firstDay);
      const dayOfWeek = firstDay.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startOfCalendar.setDate(firstDay.getDate() - daysToSubtract);

      // Aller jusqu'au dimanche de la dernière semaine
      const endOfCalendar = new Date(lastDay);
      const endDayOfWeek = lastDay.getDay();
      const daysToAdd = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
      endOfCalendar.setDate(lastDay.getDate() + daysToAdd);

      const current = new Date(startOfCalendar);
      while (current <= endOfCalendar) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    }

    return days;
  };

  const days = getDaysToDisplay();

  // Obtenir les demandes pour un jour donné
  const getDemandesForDay = (day: Date) => {
    return filteredDemandes.filter((demande) => {
      if (!demande.dateRdv) return false;
      const demandeDate = new Date(demande.dateRdv);
      return (
        demandeDate.getDate() === day.getDate() &&
        demandeDate.getMonth() === day.getMonth() &&
        demandeDate.getFullYear() === day.getFullYear()
      );
    });
  };

  const getUrgenceBadgeVariant = (urgence: string) => {
    switch (urgence) {
      case "FAIBLE":
        return "success"; // 🟢 Vert
      case "NORMALE":
        return "warning"; // 🟡 Jaune
      case "ELEVEE":
        return "info"; // 🔵 Bleu
      case "URGENTE":
        return "destructive"; // 🔴 Rouge
      default:
        return "secondary";
    }
  };

  const getStatutBadgeVariant = (statut: string) => {
    switch (statut) {
      case "EN_ATTENTE":
        return "warning"; // 🟡 Jaune
      case "CONFIRMEE":
        return "info"; // 🔵 Bleu
      case "EN_COURS":
        return "default"; // 🟣 Violet (primary)
      case "TERMINEE":
        return "success"; // 🟢 Vert
      case "ANNULEE":
        return "destructive"; // 🔴 Rouge
      default:
        return "secondary";
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "EN_ATTENTE":
        return "Attente";
      case "CONFIRMEE":
        return "Confirmé";
      case "EN_COURS":
        return "En cours";
      case "TERMINEE":
        return "Terminé";
      case "ANNULEE":
        return "Annulé";
      default:
        return statut;
    }
  };

  // const getUrgenceColor = (urgence: string) => {
  //   switch (urgence) {
  //     case "URGENTE":
  //       return "border-l-red-500";
  //     case "ELEVEE":
  //       return "border-l-orange-500";
  //     case "NORMALE":
  //       return "border-l-blue-500";
  //     case "FAIBLE":
  //       return "border-l-green-500";
  //     default:
  //       return "border-l-gray-500";
  //   }
  // };

  return (
    <div className="h-full flex flex-col">
      {/* Header avec navigation et contrôles */}
      <div className="flex-shrink-0 p-6 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Planning</h1>
            <p className="text-muted-foreground">{title}</p>
          </div>

          {/* Sélecteur de vue */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewType === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("week")}
            >
              <List className="w-4 h-4 mr-2" />
              Semaine
            </Button>
            <Button
              variant={viewType === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("month")}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Mois
            </Button>
          </div>
        </div>

        {/* Navigation et statistiques */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPrevious}>
              <ChevronLeft className="w-4 h-4" />
              {viewType === "week" ? "Semaine précédente" : "Mois précédent"}
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Aujourd&apos;hui
            </Button>
            <Button variant="outline" size="sm" onClick={goToNext}>
              {viewType === "week" ? "Semaine suivante" : "Mois suivant"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Statistiques rapides */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>{periodStats.confirmees} Confirmés</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>{periodStats.enCours} En cours</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>{periodStats.terminees} Terminés</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>{periodStats.urgentes} Urgents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendrier */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {viewType === "week" ? (
            // Vue semaine - Utilisation de l'ancien WeekView
            <WeekView
              demandes={demandes}
              weekStart={startDate}
              onDemandeClick={onDemandeSelect}
              onUpdate={onDemandeUpdate}
              onOptimisticUpdate={(
                demandeId: string,
                newDate: Date,
                newHeureRdv: string
              ) => {
                console.log(
                  "Optimistic update:",
                  demandeId,
                  newDate,
                  newHeureRdv
                );
              }}
            />
          ) : (
            // Vue mois - Grille calendrier
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {/* En-têtes des jours */}
              <div className="grid grid-cols-7 border-b border-border">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-3 text-center font-medium text-muted-foreground bg-muted/30"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Grille des jours */}
              <div className="grid grid-cols-7">
                {days.map((day) => {
                  const dayDemandes = getDemandesForDay(day);
                  const isCurrentMonth =
                    day.getMonth() === currentDate.getMonth();
                  const isToday =
                    day.toDateString() === new Date().toDateString();

                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-[120px] p-2 border-r border-b border-border ${
                        !isCurrentMonth ? "bg-muted/20" : ""
                      } ${isToday ? "bg-primary/5" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-sm font-medium ${
                            !isCurrentMonth
                              ? "text-muted-foreground"
                              : isToday
                              ? "text-primary font-bold"
                              : "text-foreground"
                          }`}
                        >
                          {day.getDate()}
                        </span>
                        {dayDemandes.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {dayDemandes.length}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1">
                        {dayDemandes.slice(0, 2).map((demande) => (
                          <div
                            key={demande.id}
                            className="p-1 cursor-pointer hover:bg-background/50 transition-colors rounded"
                            onClick={() => onDemandeSelect(demande)}
                            title={`${demande.heureRdv || ""} - ${
                              demande.patient.prenom
                            } ${demande.patient.nom} - ${demande.typeSoin}`}
                          >
                            <Badge
                              variant={
                                getUrgenceBadgeVariant(demande.urgence) as
                                  | "default"
                                  | "secondary"
                                  | "destructive"
                                  | "outline"
                              }
                              className="w-full justify-start text-[10px] px-1 py-0.5 h-auto mb-1"
                            >
                              <span className="font-medium truncate">
                                {demande.heureRdv} {demande.patient.prenom}
                              </span>
                            </Badge>
                            <Badge
                              variant={
                                getStatutBadgeVariant(demande.statut) as
                                  | "default"
                                  | "secondary"
                                  | "destructive"
                                  | "outline"
                              }
                              className="w-full justify-start text-[9px] px-1 py-0.5 h-auto"
                            >
                              {getStatutLabel(demande.statut)}
                            </Badge>
                          </div>
                        ))}
                        {dayDemandes.length > 2 && (
                          <div className="text-xs text-muted-foreground p-1 bg-muted/30 rounded text-center">
                            +{dayDemandes.length - 2} autres RDV
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
