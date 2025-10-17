"use client";

import { DemandeCardKit } from "@/components/dashboard/DemandeCardKit";
import type { Demande } from "@/types/demande";
import { useDroppable } from "@dnd-kit/core";
import { useCallback } from "react";

interface WeekViewKitProps {
  demandes: Demande[];
  weekStart: Date;
  onDemandeClick: (demande: Demande) => void;
}

const HOURS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export function WeekViewKit({
  demandes,
  weekStart,
  onDemandeClick,
}: WeekViewKitProps) {
  // Générer les 7 jours de la semaine à partir de weekStart
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Debug: Log des informations
  console.log("🔍 WeekViewKit Debug:", {
    weekStart: weekStart.toISOString(),
    weekDays: weekDays.map((d) => d.toISOString()),
    totalDemandes: demandes.length,
    demandesWithDates: demandes.filter((d) => d.dateRdv).length,
    demandesDates: demandes
      .filter((d) => d.dateRdv)
      .map((d) => ({
        id: d.id,
        date: d.dateRdv,
        heure: d.heureRdv,
        patient: `${d.patient.prenom} ${d.patient.nom}`,
      })),
    heuresDisponibles: HOURS,
    demandesParHeure: HOURS.map((hour) => ({
      heure: hour,
      count: demandes.filter((d) => {
        if (!d.dateRdv) return false;
        const demandeDate = new Date(d.dateRdv);
        const isInWeek = weekDays.some((day) => {
          const demandeDateStr = demandeDate.toDateString();
          const dayDateStr = day.toDateString();
          return demandeDateStr === dayDateStr;
        });
        if (!isInWeek) return false;

        const heureMatch = d.heureRdv?.match(/(\d+)h/);
        const demandeHour = heureMatch ? parseInt(heureMatch[1]) : null;
        return demandeHour === hour;
      }).length,
    })),
    demandesTouteLaJournee: demandes
      .filter((d) => {
        if (!d.dateRdv) return false;
        const demandeDate = new Date(d.dateRdv);
        const isInWeek = weekDays.some((day) => {
          const demandeDateStr = demandeDate.toDateString();
          const dayDateStr = day.toDateString();
          return demandeDateStr === dayDateStr;
        });
        if (!isInWeek) return false;

        return !d.heureRdv || d.heureRdv === "Toute la journée";
      })
      .map((d) => ({
        id: d.id,
        date: d.dateRdv,
        heure: d.heureRdv,
        patient: `${d.patient.prenom} ${d.patient.nom}`,
      })),
    demandesSansHeure: demandes
      .filter((d) => {
        if (!d.dateRdv) return false;
        const demandeDate = new Date(d.dateRdv);
        const isInWeek = weekDays.some((day) => {
          const demandeDateStr = demandeDate.toDateString();
          const dayDateStr = day.toDateString();
          return demandeDateStr === dayDateStr;
        });
        if (!isInWeek) return false;

        return (
          d.heureRdv &&
          d.heureRdv !== "Toute la journée" &&
          !HOURS.some((hour) => {
            const heureMatch = d.heureRdv?.match(/(\d+)h/);
            const demandeHour = heureMatch ? parseInt(heureMatch[1]) : null;
            return demandeHour === hour;
          })
        );
      })
      .map((d) => ({
        id: d.id,
        date: d.dateRdv,
        heure: d.heureRdv,
        patient: `${d.patient.prenom} ${d.patient.nom}`,
      })),
  });

  // Fonction pour obtenir les demandes d'un jour et d'une heure spécifiques
  const getDemandesForDayAndHour = useCallback(
    (day: Date, hour: number) => {
      return demandes.filter((demande) => {
        if (!demande.dateRdv) return false;

        // Normaliser les dates pour éviter les problèmes de fuseau horaire
        const demandeDate = new Date(demande.dateRdv);
        const dayDate = new Date(day);

        // Comparer seulement la date (sans l'heure)
        const demandeDateStr = demandeDate.toDateString();
        const dayDateStr = dayDate.toDateString();

        const isSameDay = demandeDateStr === dayDateStr;

        if (!isSameDay) return false;

        // Pour "Toute la journée"
        if (hour === 0) {
          return !demande.heureRdv || demande.heureRdv === "Toute la journée";
        }

        // Pour une heure spécifique
        const heureMatch = demande.heureRdv?.match(/(\d+)h/);
        const demandeHour = heureMatch ? parseInt(heureMatch[1]) : null;
        return demandeHour === hour;
      });
    },
    [demandes]
  );

  // Fonction pour obtenir les demandes "Toute la journée" d'un jour
  const getDemandesAllDay = useCallback(
    (day: Date) => {
      return getDemandesForDayAndHour(day, 0);
    },
    [getDemandesForDayAndHour]
  );

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border shadow-sm overflow-x-auto overflow-y-auto">
      {/* Header avec les jours */}
      <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-card z-10 min-w-[320px] sm:min-w-0">
        {/* Colonne des heures */}
        <div className="px-2 sm:px-4 py-3 text-sm font-semibold text-muted-foreground border-r border-border text-left">
          Heure
        </div>
        {weekDays.map((day, index) => {
          const isToday =
            day.getDate() === new Date().getDate() &&
            day.getMonth() === new Date().getMonth() &&
            day.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={index}
              className={`px-2 sm:px-4 py-3 text-center border-r border-border ${
                isToday ? "bg-primary/10 text-primary font-semibold" : ""
              }`}
            >
              <div className="text-xs sm:text-sm font-medium">
                {day.toLocaleDateString("fr-FR", { weekday: "short" })}
              </div>
              <div className="text-xs text-muted-foreground">
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto">
        {/* Ligne "Toute la journée" */}
        <div className="grid grid-cols-8 border-b border-border min-h-[60px] min-w-[320px] sm:min-w-0">
          <div className="px-2 sm:px-4 py-3 text-xs text-muted-foreground border-r border-border flex items-center">
            Toute la journée
          </div>
          {weekDays.map((day, dayIndex) => {
            return (
              <DropZoneKit
                key={dayIndex}
                day={day}
                hour={0}
                demandes={getDemandesAllDay(day)}
                onDemandeClick={onDemandeClick}
              />
            );
          })}
        </div>

        {/* Grille avec les heures et créneaux */}
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-8 border-b border-border min-h-[60px] min-w-[320px] sm:min-w-0"
          >
            {/* Colonne des heures */}
            <div className="px-2 sm:px-4 py-3 text-xs text-muted-foreground border-r border-border flex items-center">
              {hour}h00
            </div>
            {weekDays.map((day, dayIndex) => {
              return (
                <DropZoneKit
                  key={dayIndex}
                  day={day}
                  hour={hour}
                  demandes={getDemandesForDayAndHour(day, hour)}
                  onDemandeClick={onDemandeClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant DropZone avec @dnd-kit
function DropZoneKit({
  day,
  hour,
  demandes,
  onDemandeClick,
}: {
  day: Date;
  hour: number;
  demandes: Demande[];
  onDemandeClick: (demande: Demande) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `drop-${day.getTime()}-${hour}`,
  });

  const handleClick = () => {
    // Si on clique sur la zone et qu'il y a une demande en cours de drag
    // (cette logique sera gérée par le DragOverlay)
  };

  const isToday =
    day.getDate() === new Date().getDate() &&
    day.getMonth() === new Date().getMonth() &&
    day.getFullYear() === new Date().getFullYear();

  return (
    <div
      ref={setNodeRef}
      className={`p-1 border-r border-border relative min-h-[60px] sm:min-h-[80px] ${
        isToday ? "bg-primary/5" : ""
      } ${isOver ? "bg-blue-100 border-blue-300" : ""}`}
      onClick={handleClick}
    >
      {/* Layout responsive avec CSS Grid */}
      <div
        className="grid gap-1 h-full w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1"
        style={{
          gridAutoRows: "min-content",
        }}
      >
        {demandes.map((demande) => (
          <DemandeCardKit
            key={demande.id}
            demande={demande}
            onClick={() => onDemandeClick(demande)}
          />
        ))}
      </div>
    </div>
  );
}
