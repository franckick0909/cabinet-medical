"use client";

import { updateDemandeDate } from "@/actions/dashboard";
import { DemandeCard } from "@/components/dashboard/DemandeCard";
import type { Demande } from "@/types/demande";
import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());
  const dropZonesRef = useRef<Map<string, HTMLElement>>(new Map());

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

  // GSAP Drag & Drop handlers
  const handleDragStart = (demande: Demande) => {
    setDraggedDemande(demande);

    // Highlight all drop zones
    dropZonesRef.current.forEach((zone) => {
      gsap.to(zone, {
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.3)",
        duration: 0.2,
      });
    });
  };

  const handleDragEnd = () => {
    setDraggedDemande(null);

    // Reset all drop zones
    dropZonesRef.current.forEach((zone) => {
      gsap.to(zone, {
        backgroundColor: "transparent",
        borderColor: "transparent",
        duration: 0.2,
      });
    });
  };

  const handleDrop = useCallback(
    async (day: Date, hour: number, dropZone: HTMLElement) => {
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

      if (isSameSlot) {
        setDraggedDemande(null);
        return;
      }

      // Animation de drop réussie
      gsap.to(dropZone, {
        scale: 1.05,
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.to(dropZone, {
            backgroundColor: "transparent",
            duration: 0.2,
          });
        },
      });

      // Créer la nouvelle date/heure
      const newDate = new Date(day);
      const newHeureRdv = hour === 0 ? "Toute la journée" : `${hour}h00`;

      // Mise à jour optimiste
      onOptimisticUpdate(draggedDemande.id, newDate, newHeureRdv);
      setDraggedDemande(null);

      // Mise à jour en base (simplifiée)
      setIsUpdating(true);
      setPendingUpdates((prev) => new Set(prev).add(draggedDemande.id));

      try {
        const result = await updateDemandeDate(
          draggedDemande.id,
          newDate,
          newHeureRdv
        );
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
    [draggedDemande, isUpdating, pendingUpdates, onOptimisticUpdate, onUpdate]
  );

  // Écouter les événements de drop depuis GSAP
  useEffect(() => {
    const handleGlobalDrop = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { day, hour, dropZone } = customEvent.detail;
      if (draggedDemande) {
        handleDrop(day, hour, dropZone);
      }
    };

    window.addEventListener("gsap-drop", handleGlobalDrop);
    return () => {
      window.removeEventListener("gsap-drop", handleGlobalDrop);
    };
  }, [draggedDemande, handleDrop]);

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
              ref={(el) => {
                if (el) dropZonesRef.current.set(`allday-${dayIndex}`, el);
              }}
              data-drop-zone="true"
              data-day={day.toISOString()}
              data-hour="0"
              className={`p-1 border-r border-border relative min-h-[60px] sm:min-h-[80px] ${
                isToday ? "bg-primary/5" : ""
              }`}
              onMouseEnter={() => {
                if (draggedDemande) {
                  const element = dropZonesRef.current.get(
                    `allday-${dayIndex}`
                  );
                  if (element) {
                    gsap.to(element, {
                      backgroundColor: "rgba(59, 130, 246, 0.2)",
                      duration: 0.2,
                    });
                  }
                }
              }}
              onMouseLeave={() => {
                if (draggedDemande) {
                  const element = dropZonesRef.current.get(
                    `allday-${dayIndex}`
                  );
                  if (element) {
                    gsap.to(element, {
                      backgroundColor: "transparent",
                      duration: 0.2,
                    });
                  }
                }
              }}
              onClick={() => {
                if (draggedDemande) {
                  const dropZone = dropZonesRef.current.get(
                    `allday-${dayIndex}`
                  );
                  if (dropZone) {
                    // Déclencher l'événement global pour GSAP
                    window.dispatchEvent(
                      new CustomEvent("gsap-drop", {
                        detail: { day, hour: 0, dropZone },
                      })
                    );
                  }
                }
              }}
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
                  ref={(el) => {
                    if (el)
                      dropZonesRef.current.set(`hour-${dayIndex}-${hour}`, el);
                  }}
                  data-drop-zone="true"
                  data-day={day.toISOString()}
                  data-hour={hour.toString()}
                  className={`p-1 border-r border-border relative min-h-[60px] sm:min-h-[80px] ${
                    isToday ? "bg-primary/5" : ""
                  }`}
                  onMouseEnter={() => {
                    if (draggedDemande) {
                      const element = dropZonesRef.current.get(
                        `hour-${dayIndex}-${hour}`
                      );
                      if (element) {
                        gsap.to(element, {
                          backgroundColor: "rgba(59, 130, 246, 0.2)",
                          duration: 0.2,
                        });
                      }
                    }
                  }}
                  onMouseLeave={() => {
                    if (draggedDemande) {
                      const element = dropZonesRef.current.get(
                        `hour-${dayIndex}-${hour}`
                      );
                      if (element) {
                        gsap.to(element, {
                          backgroundColor: "transparent",
                          duration: 0.2,
                        });
                      }
                    }
                  }}
                  onClick={() => {
                    if (draggedDemande) {
                      const dropZone = dropZonesRef.current.get(
                        `hour-${dayIndex}-${hour}`
                      );
                      if (dropZone) {
                        // Déclencher l'événement global pour GSAP
                        window.dispatchEvent(
                          new CustomEvent("gsap-drop", {
                            detail: { day, hour, dropZone },
                          })
                        );
                      }
                    }
                  }}
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
