"use client";

import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Demande } from "@/types/demande";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

interface DemandeCardProps {
  demande: Demande;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const urgenceBadgeVariants = {
  FAIBLE: "success", // 🟢 Vert
  NORMALE: "warning", // 🟡 Jaune
  ELEVEE: "info", // 🟣 Violet
  URGENTE: "destructive", // 🔴 Rouge
} as const;

const urgenceLabels = {
  FAIBLE: "Faible",
  NORMALE: "Normale",
  ELEVEE: "Élevée",
  URGENTE: "Urgente",
};

const statutLabels = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

const statutBadgeVariants = {
  EN_ATTENTE: "warning", // 🟡 Jaune
  CONFIRMEE: "info", // 🔵 Bleu
  EN_COURS: "default", // 🟣 Violet (primary)
  TERMINEE: "success", // 🟢 Vert
  ANNULEE: "destructive", // 🔴 Rouge
} as const;

export function DemandeCard({
  demande,
  onClick,
  onDragStart,
  onDragEnd,
}: DemandeCardProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const badge = badgeRef.current;
    if (!badge) return;

    let startX = 0;
    let startY = 0;
    let originalX = 0;
    let originalY = 0;

    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDragging.current = true;
      console.log("🚀 Drag started");
      onDragStart();

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      startX = clientX;
      startY = clientY;

      const rect = badge.getBoundingClientRect();
      originalX = rect.left;
      originalY = rect.top;

      // Animation de début
      gsap.set(badge, {
        zIndex: 1000,
        position: "fixed",
        left: originalX,
        top: originalY,
      });

      gsap.to(badge, {
        scale: 1.1,
        rotation: 5,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;

      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      gsap.set(badge, {
        left: originalX + deltaX,
        top: originalY + deltaY,
      });
    };

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;

      e.preventDefault();
      e.stopPropagation();

      // Détecter la zone de drop
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const elementBelow = document.elementFromPoint(clientX, clientY);
      const dropZone = elementBelow?.closest("[data-drop-zone]");

      if (dropZone) {
        const day = dropZone.getAttribute("data-day");
        const hour = dropZone.getAttribute("data-hour");

        if (day && hour !== null) {
          // Déclencher l'événement de drop
          window.dispatchEvent(
            new CustomEvent("gsap-drop", {
              detail: {
                day: new Date(day),
                hour: parseInt(hour),
                dropZone,
              },
            })
          );
        }
      }

      // Empêcher le onClick pendant un court délai
      if (dragTimeout.current) {
        clearTimeout(dragTimeout.current);
      }
      dragTimeout.current = setTimeout(() => {
        console.log("⏰ Timeout - drag terminé");
        isDragging.current = false;
      }, 100);

      console.log("🛑 Drag ended - timeout démarré");
      onDragEnd();

      // Animation de fin
      gsap.to(badge, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "back.out(1.7)",
        onComplete: () => {
          gsap.set(badge, {
            position: "static",
            zIndex: "auto",
            left: "auto",
            top: "auto",
          });
        },
      });
    };

    // Événements souris
    badge.addEventListener("mousedown", handleStart);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);

    // Événements tactiles
    badge.addEventListener("touchstart", handleStart, { passive: false });
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd, { passive: false });

    return () => {
      badge.removeEventListener("mousedown", handleStart);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      badge.removeEventListener("touchstart", handleStart);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);

      // Nettoyer le timeout
      if (dragTimeout.current) {
        clearTimeout(dragTimeout.current);
      }
    };
  }, [onDragStart, onDragEnd]);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div ref={badgeRef}>
          <Badge
            variant={urgenceBadgeVariants[demande.urgence]}
            onClick={(e) => {
              // Ne pas ouvrir la modal si on vient de faire un drag
              if (isDragging.current) {
                console.log("🚫 Click bloqué - drag en cours");
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              console.log("✅ Click autorisé - ouverture modal");
              onClick();
            }}
            className="cursor-move py-1 h-auto text-[10px] px-1 lg:px-2 lg:text-xs rounded-full select-none touch-none"
            style={{ touchAction: "none" }}
          >
            <span className="font-medium text-[10px] lg:text-xs truncate whitespace-nowrap">
              <span className="lg:hidden uppercase">
                {demande.patient.prenom.charAt(0).toUpperCase()}
                {demande.patient.nom.charAt(0).toUpperCase()}
              </span>
              <span className="hidden lg:inline">
                {demande.patient.prenom} {demande.patient.nom}
              </span>
            </span>
          </Badge>
        </div>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-full elevation-3 bg-surface border-outline-variant"
        side="right"
        align="start"
      >
        <div className="space-y-4">
          {/* Header Material Design 3 */}
          <div>
            <h4 className="title-medium text-on-surface">
              {demande.patient.prenom} {demande.patient.nom}
            </h4>
            <p className="body-small text-on-surface-variant">
              {demande.patient.telephone}
            </p>
          </div>

          {/* Badges Material Design 3 */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={urgenceBadgeVariants[demande.urgence]}
              className="label-small"
            >
              {urgenceLabels[demande.urgence]}
            </Badge>
            <Badge
              variant={statutBadgeVariants[demande.statut]}
              className="label-small"
            >
              {statutLabels[demande.statut]}
            </Badge>
          </div>

          {/* Info Material Design 3 */}
          <div className="space-y-2 body-small">
            <div className="flex items-start gap-3">
              <span className="text-on-surface-variant min-w-[60px]">
                Soin:
              </span>
              <span className="text-on-surface font-medium">
                {demande.typeSoin}
              </span>
            </div>
            {demande.dateRdv && (
              <div className="flex items-start gap-3">
                <span className="text-on-surface-variant min-w-[60px]">
                  Date:
                </span>
                <span className="text-on-surface">
                  {new Date(demande.dateRdv).toLocaleDateString("fr-FR")}
                  {demande.heureRdv && ` à ${demande.heureRdv}`}
                </span>
              </div>
            )}
            {demande.lieu && (
              <div className="flex items-start gap-3">
                <span className="text-on-surface-variant min-w-[60px]">
                  Lieu:
                </span>
                <span className="text-on-surface">📍 {demande.lieu}</span>
              </div>
            )}
          </div>

          {/* CTA Material Design 3 */}
          <div className="pt-3 border-t border-outline-variant body-small text-on-surface-variant">
            Cliquez pour voir les détails complets
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
