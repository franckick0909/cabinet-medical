"use client";

import type { Demande } from "@/types/demande";
import { Badge } from "../ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

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

export function DemandeCard({
  demande,
  onClick,
  onDragStart,
  onDragEnd,
}: DemandeCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Badge
          variant={urgenceBadgeVariants[demande.urgence]}
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onClick={onClick}
          className="cursor-move py-1 h-auto text-[10px] px-1 lg:px-2 lg:text-xs rounded-full"
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
            <Badge variant="outline" className="text-xs">
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
