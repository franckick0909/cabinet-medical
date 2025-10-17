"use client";

import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Demande } from "@/types/demande";
import { useDraggable } from "@dnd-kit/core";

interface DemandeCardKitProps {
  demande: Demande;
  onClick: () => void;
}

const urgenceBadgeVariants = {
  FAIBLE: "success",
  NORMALE: "warning",
  ELEVEE: "info",
  URGENTE: "destructive",
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
  EN_ATTENTE: "warning",
  CONFIRMEE: "info",
  EN_COURS: "default",
  TERMINEE: "success",
  ANNULEE: "destructive",
} as const;

export function DemandeCardKit({ demande, onClick }: DemandeCardKitProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: demande.id,
      data: {
        demande,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleClick = (e: React.MouseEvent) => {
    // Ne pas ouvrir la modal si on vient de faire un drag
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick();
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          className="cursor-move"
        >
          <Badge
            variant={urgenceBadgeVariants[demande.urgence]}
            onClick={handleClick}
            className={`py-1 h-auto text-[10px] px-1 lg:px-2 lg:text-xs rounded-full select-none ${
              isDragging ? "opacity-50" : ""
            }`}
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

      <HoverCardContent className="w-full" side="right" align="start">
        <div className="space-y-3">
          {/* Header */}
          <div>
            <h4 className="text-sm font-semibold">
              {demande.patient.prenom} {demande.patient.nom}
            </h4>
            <p className="text-xs text-muted-foreground">
              {demande.patient.telephone}
            </p>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={urgenceBadgeVariants[demande.urgence]}
              className="text-xs"
            >
              {urgenceLabels[demande.urgence]}
            </Badge>
            <Badge
              variant={statutBadgeVariants[demande.statut]}
              className="text-xs"
            >
              {statutLabels[demande.statut]}
            </Badge>
          </div>

          {/* Info */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground min-w-[60px]">Soin:</span>
              <span className="font-medium">{demande.typeSoin}</span>
            </div>
            {demande.dateRdv && (
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-[60px]">
                  Date:
                </span>
                <span>
                  {new Date(demande.dateRdv).toLocaleDateString("fr-FR")}
                  {demande.heureRdv && ` à ${demande.heureRdv}`}
                </span>
              </div>
            )}
            {demande.lieu && (
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-[60px]">
                  Lieu:
                </span>
                <span>📍 {demande.lieu}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="pt-2 border-t text-xs text-muted-foreground">
            Cliquez pour voir les détails complets
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
