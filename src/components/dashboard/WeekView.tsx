"use client";

import { updateDemandeDate } from "@/actions/dashboard";
import { DemandeCard } from "@/components/dashboard/DemandeCard";
import type { Demande } from "@/types/demande";
import { useState } from "react";

interface WeekViewProps {
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

const HOURS = Array.from({ length: 17 }, (_, i) => i + 5); // 5h à 21h (17 heures)
const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export function WeekView({
  demandes,
  weekStart,
  onDemandeClick,
  onUpdate,
  onOptimisticUpdate,
}: WeekViewProps) {
  const [draggedDemande, setDraggedDemande] = useState<Demande | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Générer les 7 jours de la semaine à partir de weekStart
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getDemandesForDayAndHour = (day: Date, hour: number) => {
    return demandes.filter((demande) => {
      if (!demande.dateRdv) return false;

      const demandeDate = new Date(demande.dateRdv);
      const isSameDay =
        demandeDate.getDate() === day.getDate() &&
        demandeDate.getMonth() === day.getMonth() &&
        demandeDate.getFullYear() === day.getFullYear();

      if (!isSameDay) return false;

      // Ne pas afficher "Toute la journée" dans les créneaux horaires
      if (!demande.heureRdv || demande.heureRdv === "Toute la journée") {
        return false;
      }

      // Parser l'heure de la demande
      const heureMatch = demande.heureRdv.match(/(\d+)h/);
      const demandeHour = heureMatch ? parseInt(heureMatch[1]) : null;

      return demandeHour === hour;
    });
  };

  const getDemandesAllDay = (day: Date) => {
    return demandes.filter((demande) => {
      if (!demande.dateRdv) return false;

      const demandeDate = new Date(demande.dateRdv);
      const isSameDay =
        demandeDate.getDate() === day.getDate() &&
        demandeDate.getMonth() === day.getMonth() &&
        demandeDate.getFullYear() === day.getFullYear();

      // Seulement les demandes "Toute la journée"
      return (
        isSameDay &&
        (!demande.heureRdv || demande.heureRdv === "Toute la journée")
      );
    });
  };

  const handleDragStart = (demande: Demande) => {
    setDraggedDemande(demande);
  };

  const handleDragEnd = () => {
    setDraggedDemande(null);
  };

  const handleDrop = async (day: Date, hour: number) => {
    if (!draggedDemande || isUpdating) return;

    // Empêcher le drop si c'est déjà la même case
    const demandeDate = draggedDemande.dateRdv
      ? new Date(draggedDemande.dateRdv)
      : null;

    // Déterminer l'heure actuelle de la demande
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

    if (isSameSlot) {
      setDraggedDemande(null);
      return;
    }

    // Créer la nouvelle date/heure
    const newDate = new Date(day);
    const newHeureRdv = hour === 0 ? "Toute la journée" : `${hour}h00`;

    // 1. Mise à jour optimiste IMMÉDIATE (pas d'attente)
    onOptimisticUpdate(draggedDemande.id, newDate, newHeureRdv);
    setDraggedDemande(null);

    // 2. Mise à jour en arrière-plan dans la base de données
    setIsUpdating(true);
    try {
      const result = await updateDemandeDate(
        draggedDemande.id,
        newDate,
        newHeureRdv
      );

      if (!result.success) {
        // En cas d'erreur, recharger pour annuler le changement visuel
        alert("Erreur lors du déplacement du rendez-vous");
        onUpdate();
      }
    } catch (error) {
      console.error("Erreur lors du drop:", error);
      alert("Erreur lors du déplacement du rendez-vous");
      // Recharger pour annuler le changement visuel
      onUpdate();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border shadow-sm overflow-x-auto">
      {/* Header avec les jours */}
      <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-card z-10 min-w-[320px] sm:min-w-0">
        {/* Colonne des heures */}
        <div className="px-2 sm:px-4 py-3 text-sm font-semibold text-muted-foreground border-r border-border text-left">
          Horaire
        </div>

        {/* Jours de la semaine */}
        {weekDays.map((day, index) => {
          const isToday =
            day.getDate() === new Date().getDate() &&
            day.getMonth() === new Date().getMonth() &&
            day.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={index}
              className={`px-2 py-3 text-center border-r border-border ${
                isToday ? "bg-primary/10" : ""
              }`}
            >
              <div className="text-xs font-medium text-muted-foreground mb-1">
                <span className="hidden md:inline">{DAYS[index]}</span>
                <span className="md:hidden uppercase">
                  {DAYS[index].charAt(0)}
                </span>
              </div>
              <div
                className={`text-lg font-semibold ${
                  isToday ? "text-primary" : "text-foreground"
                }`}
              >
                {day.getDate()}
              </div>
              <div className="text-xs text-muted-foreground">
                {day.toLocaleDateString("fr-FR", { month: "short" })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ligne "Toute la journée" */}
      <div className="grid grid-cols-8 border-b-2 border-primary/30 bg-primary/5 min-w-[320px] sm:min-w-0">
        {/* Label "Toute la journée" */}
        <div className="px-2 sm:px-4 py-2 text-sm font-semibold text-primary border-r border-border flex items-center text-left">
          <span className="hidden md:inline">📅 Toute la journée</span>
          <span className="md:hidden">📅 J</span>
        </div>

        {/* Cases pour chaque jour */}
        {weekDays.map((day, dayIndex) => {
          const demandesAllDay = getDemandesAllDay(day);
          const isToday =
            day.getDate() === new Date().getDate() &&
            day.getMonth() === new Date().getMonth() &&
            day.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={dayIndex}
              className={`p-1 border-r border-border relative min-h-[60px] sm:min-h-[80px] ${
                isToday ? "bg-primary/5" : ""
              } ${draggedDemande ? "hover:bg-primary/10" : ""}`}
              onDrop={() => handleDrop(day, 0)}
              onDragOver={handleDragOver}
            >
              {demandesAllDay.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {demandesAllDay.map((demande) => (
                    <DemandeCard
                      key={demande.id}
                      demande={demande}
                      onClick={() => onDemandeClick(demande)}
                      onDragStart={() => handleDragStart(demande)}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Grille avec les heures et créneaux */}
      <div className="flex-1 overflow-auto">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-8 border-b border-border min-h-[60px] min-w-[320px] sm:min-w-0"
          >
            {/* Colonne heure */}
            <div className="px-2 sm:px-4 py-2 text-sm font-medium text-muted-foreground border-r border-border flex items-start justify-start text-left">
              <span className="hidden md:inline">{hour}h00</span>
              <span className="md:hidden">{hour}h</span>
            </div>

            {/* Cases pour chaque jour */}
            {weekDays.map((day, dayIndex) => {
              const demandesForSlot = getDemandesForDayAndHour(day, hour);
              const isToday =
                day.getDate() === new Date().getDate() &&
                day.getMonth() === new Date().getMonth() &&
                day.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={dayIndex}
                  className={`p-1 border-r border-border relative min-h-[60px] sm:min-h-[80px] ${
                    isToday ? "bg-primary/5" : ""
                  } ${draggedDemande ? "hover:bg-primary/10" : ""}`}
                  onDrop={() => handleDrop(day, hour)}
                  onDragOver={handleDragOver}
                >
                  {demandesForSlot.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {demandesForSlot.map((demande) => (
                        <DemandeCard
                          key={demande.id}
                          demande={demande}
                          onClick={() => onDemandeClick(demande)}
                          onDragStart={() => handleDragStart(demande)}
                          onDragEnd={handleDragEnd}
                        />
                      ))}
                    </div>
                  ) : (
                    // Zone vide cliquable pour ajouter un RDV (futur)
                    <div className="h-full min-h-[60px] sm:min-h-[80px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-muted text-[10px]">+</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
