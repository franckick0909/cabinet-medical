"use client";

import { DemandeCardKit } from "@/components/dashboard/DemandeCardKit";
import type { Demande } from "@/types/demande";
import { useDroppable } from "@dnd-kit/core";
import { useCallback, useState } from "react";

interface WeekViewKitProps {
  demandes: Demande[];
  weekStart: Date;
  onDemandeClick: (demande: Demande) => void;
  onUpdate: () => void;
  onOptimisticUpdate: (
    demandeId: string,
    newDate: Date,
    newHeureRdv: string
  ) => void;
}

const HOURS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export function WeekViewKit({
  demandes,
  weekStart,
  onDemandeClick,
  onUpdate,
  onOptimisticUpdate,
}: WeekViewKitProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

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

  const handleDrop = useCallback(
    async (demandeId: string, day: Date, hour: number) => {
      const draggedDemande = demandes.find((d) => d.id === demandeId);
      if (
        !draggedDemande ||
        isUpdating ||
        pendingUpdates.has(draggedDemande.id)
      )
        return;

      // Vérifier si c'est le même créneau
      const demandeDate = draggedDemande.dateRdv
        ? new Date(draggedDemande.dateRdv)
        : null;
      const isAllDay =
        !draggedDemande.heureRdv ||
        draggedDemande.heureRdv === "Toute la journée";
      const heureMatch = draggedDemande.heureRdv?.match(/(\d+)h/);
      const demandeHour = isAllDay
        ? 0
        : heureMatch
        ? parseInt(heureMatch[1])
        : null;

      const isSameSlot =
        demandeDate &&
        demandeDate.getDate() === day.getDate() &&
        demandeDate.getMonth() === day.getMonth() &&
        demandeDate.getFullYear() === day.getFullYear() &&
        demandeHour === hour;

      if (isSameSlot) return;

      // Créer la nouvelle date/heure
      const newDate = new Date(day);
      const newHeureRdv = hour === 0 ? "Toute la journée" : `${hour}h00`;

      // Mise à jour optimiste
      onOptimisticUpdate(draggedDemande.id, newDate, newHeureRdv);

      // Mise à jour en base
      setIsUpdating(true);
      setPendingUpdates((prev) => new Set(prev).add(draggedDemande.id));

      try {
        // Utiliser fetch directement au lieu de Server Action
        const response = await fetch("/api/demandes/update-date", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: draggedDemande.id,
            dateRdv: newDate.toISOString(),
            heureRdv: newHeureRdv,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          alert(`Erreur: ${result.error}`);
          onUpdate();
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors du déplacement");
        onUpdate();
      } finally {
        setIsUpdating(false);
        setPendingUpdates((prev) => {
          const newSet = new Set(prev);
          newSet.delete(draggedDemande.id);
          return newSet;
        });
      }
    },
    [demandes, isUpdating, pendingUpdates, onOptimisticUpdate, onUpdate]
  );

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border shadow-sm overflow-x-auto">
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
                _onDrop={handleDrop}
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
                  _onDrop={handleDrop}
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
  _onDrop,
}: {
  day: Date;
  hour: number;
  demandes: Demande[];
  onDemandeClick: (demande: Demande) => void;
  _onDrop: (demandeId: string, day: Date, hour: number) => void;
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
      className={`p-1 border-r border-border relative min-h-[60px] sm:min-h-[80px] touch-none ${
        isToday ? "bg-primary/5" : ""
      } ${isOver ? "bg-blue-100 border-blue-300" : ""}`}
      onClick={handleClick}
      onTouchStart={(e) => {
        // Permettre le drop sur mobile
        e.preventDefault();
      }}
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
