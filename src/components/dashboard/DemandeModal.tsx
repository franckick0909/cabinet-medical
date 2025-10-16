"use client";

import { deleteDemande, updateDemandeStatut } from "@/actions/dashboard";
import { Button } from "@/components/custom/Button";
import { Card } from "@/components/custom/Card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Demande } from "@/types/demande";
import {
  Calendar,
  Clock,
  LucideBriefcaseMedical,
  Mail,
  Phone,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

interface DemandeModalProps {
  demande: Demande | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const urgenceLabels = {
  FAIBLE: "Faible",
  NORMALE: "Normale",
  ELEVEE: "Élevée",
  URGENTE: "Urgente",
};

const urgenceBadgeVariants = {
  FAIBLE: "success" as const, // 🟢 Vert
  NORMALE: "warning" as const, // 🟡 Jaune
  ELEVEE: "info" as const, // 🟣 Violet
  URGENTE: "destructive" as const, // 🔴 Rouge
};

const statutLabels = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

const statutBadgeVariants = {
  EN_ATTENTE: "secondary" as const,
  CONFIRMEE: "default" as const,
  EN_COURS: "outline" as const,
  TERMINEE: "secondary" as const,
  ANNULEE: "destructive" as const,
};

// Composant helper pour afficher une ligne d'info
function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <span className="text-muted-foreground text-xs">{label}</span>
      <p className={`text-foreground mt-0.5 ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export function DemandeModal({
  demande,
  isOpen,
  onClose,
  onUpdate,
}: DemandeModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!demande) return null;

  const handleUpdateStatut = async (
    newStatut: "EN_ATTENTE" | "CONFIRMEE" | "EN_COURS" | "TERMINEE" | "ANNULEE"
  ) => {
    setIsUpdating(true);
    try {
      const result = await updateDemandeStatut(demande.id, newStatut);
      if (result.success) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsUpdating(true);
    setShowDeleteDialog(false);

    try {
      const result = await deleteDemande(demande.id);
      if (result.success) {
        onUpdate();
        onClose();
      } else {
        alert("Erreur lors de la suppression de la demande");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de la demande");
    } finally {
      setIsUpdating(false);
    }
  };

  // Parser la description JSON si elle existe
  let descriptionData = null;
  try {
    descriptionData = demande.description
      ? JSON.parse(demande.description)
      : null;
  } catch (e) {
    console.error("Erreur parsing description:", e);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] p-0 flex flex-col overflow-hidden [&>button]:hidden">
        {/* Header fixe */}
        <div className="px-6 pt-6 pb-4 border-b border-border relative">
          {/* Bouton fermer custom */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute sm:right-2 sm:top-2 right-4 top-4 sm:h-12 sm:w-12 h-10 w-10 rounded-full hover:bg-accent z-50 group border-0 shadow-none"
          >
            <X
              className="sm:!h-8 !h-6 sm:!w-8 !w-6 group-hover:rotate-180 transition-all duration-400"
              strokeWidth={1.5}
            />
            <span className="sr-only">Fermer</span>
          </Button>

          <DialogHeader>
            <div className="flex items-start justify-between pr-10">
              <div className="flex-1">
                <DialogTitle className="text-2xl">
                  {demande.patient.prenom} {demande.patient.nom}
                </DialogTitle>
                <DialogDescription>
                  Demande créée le{" "}
                  {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap pr-4">
                <Badge variant={urgenceBadgeVariants[demande.urgence]}>
                  {urgenceLabels[demande.urgence]}
                </Badge>
                <Badge variant={statutBadgeVariants[demande.statut]}>
                  {statutLabels[demande.statut]}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {/* Actions rapides */}
          <div className="flex gap-2 mt-4">
            <Button asChild variant="default" size="sm">
              <a href={`tel:${demande.patient.telephone}`} className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:block">Appeler</span>
              </a>
            </Button>  
            {demande.patient.email &&
              !demande.patient.email.includes("@temp.local") && (
                <Button asChild variant="secondary" size="sm">
                  <a href={`mailto:${demande.patient.email}`} className="flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span className="hidden sm:block">Email</span>
                  </a>
                </Button>
              )}
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Layout en 2 colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Colonne gauche: Patient + RDV */}
            <div className="space-y-4">
              {/* Informations Patient */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <User className="w-4 h-4" />
                  Informations Patient
                </h3>
                <div className="space-y-3 text-sm">
                  <InfoRow
                    label="Date de naissance"
                    value={new Date(
                      demande.patient.dateNaissance
                    ).toLocaleDateString("fr-FR")}
                  />
                  <InfoRow
                    label="Téléphone"
                    value={demande.patient.telephone}
                  />
                  {demande.patient.email &&
                    !demande.patient.email.includes("@temp.local") && (
                      <InfoRow label="Email" value={demande.patient.email} />
                    )}
                  {demande.patient.numeroSecu && (
                    <InfoRow
                      label="N° Sécurité Sociale"
                      value={demande.patient.numeroSecu}
                      mono
                    />
                  )}
                  {demande.patient.adresse && (
                    <div>
                      <span className="text-muted-foreground text-xs">
                        Adresse
                      </span>
                      <p className="text-foreground mt-0.5">
                        {demande.patient.adresse}
                        {demande.patient.complementAdresse && (
                          <>
                            <br />
                            {demande.patient.complementAdresse}
                          </>
                        )}
                        {demande.patient.codePostal &&
                          demande.patient.ville && (
                            <>
                              <br />
                              {demande.patient.codePostal}{" "}
                              {demande.patient.ville}
                            </>
                          )}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Rendez-vous */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4" />
                  Rendez-vous
                </h3>
                <div className="space-y-3 text-sm">
                  {demande.dateRdv && (
                    <InfoRow
                      label="Date"
                      value={new Date(demande.dateRdv).toLocaleDateString(
                        "fr-FR",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    />
                  )}
                  {demande.heureRdv && (
                    <InfoRow label="Heure" value={demande.heureRdv} />
                  )}
                  {demande.lieu && (
                    <InfoRow label="Lieu" value={`📍 ${demande.lieu}`} />
                  )}
                </div>
              </Card>
            </div>

            {/* Colonne droite: Soins + Notes */}
            <div className="space-y-4">
              {/* Détails du soin */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <LucideBriefcaseMedical className="w-4 h-4" />
                  Détails du Soin
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">
                      Type de soin
                    </span>
                    <p className="text-foreground font-semibold mt-0.5">
                      {demande.typeSoin}
                    </p>
                  </div>

                  {descriptionData && (
                    <>
                      {descriptionData.titre && (
                        <div>
                          <span className="text-muted-foreground text-xs">
                            Titre
                          </span>
                          <p className="text-foreground mt-0.5">
                            {descriptionData.titre}
                          </p>
                        </div>
                      )}
                      {descriptionData.details && (
                        <div>
                          <span className="text-muted-foreground text-xs">
                            Détails
                          </span>
                          <div className="bg-muted rounded p-2 mt-1 space-y-1">
                            {Object.entries(descriptionData.details)
                              .filter(([key]) => key !== "titre")
                              .map(([key, value]) => (
                                <p
                                  key={key}
                                  className="text-foreground text-xs"
                                >
                                  <span className="font-medium">{key}:</span>{" "}
                                  {String(value)}
                                </p>
                              ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {demande.notes && (
                    <div>
                      <span className="text-muted-foreground text-xs">
                        Notes
                      </span>
                      <p className="text-foreground mt-0.5 bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded">
                        {demande.notes}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Ordonnance */}
              {descriptionData?.ordonnanceDetails && (
                <Card className="p-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    Ordonnance
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs">
                        Présence d&apos;ordonnance
                      </span>
                      <p className="text-foreground mt-0.5 font-medium">
                        {descriptionData.ordonnanceDetails.aOrdonnance
                          ? "✅ Oui"
                          : "❌ Non"}
                      </p>
                    </div>

                    {descriptionData.ordonnanceDetails.aOrdonnance && (
                      <>
                        {descriptionData.ordonnanceDetails.prescritPar && (
                          <div>
                            <span className="text-muted-foreground text-xs">
                              Prescrit par
                            </span>
                            <p className="text-foreground mt-0.5">
                              Dr.{" "}
                              {descriptionData.ordonnanceDetails.prescritPar}
                            </p>
                          </div>
                        )}
                        {descriptionData.ordonnanceDetails.dateOrdonnance && (
                          <div>
                            <span className="text-muted-foreground text-xs">
                              Date de l&apos;ordonnance
                            </span>
                            <p className="text-foreground mt-0.5">
                              {new Date(
                                descriptionData.ordonnanceDetails.dateOrdonnance
                              ).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        )}
                        {descriptionData.ordonnanceDetails.details && (
                          <div>
                            <span className="text-muted-foreground text-xs">
                              Détails complémentaires
                            </span>
                            <p className="text-foreground mt-0.5 bg-primary/10 p-2 rounded">
                              {descriptionData.ordonnanceDetails.details}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Actions: Changer le statut */}
          <Separator className="my-4" />
          <div>
            <h3 className="text-sm font-semibold mb-3">Modifier le statut</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {(
                [
                  "EN_ATTENTE",
                  "CONFIRMEE",
                  "EN_COURS",
                  "TERMINEE",
                  "ANNULEE",
                ] as const
              ).map((statut) => {
                const isActive = demande.statut === statut;
                return (
                  <Button
                    key={statut}
                    variant={isActive ? statutBadgeVariants[statut] : "outline"}
                    size="sm"
                    onClick={() => handleUpdateStatut(statut)}
                    disabled={isUpdating || isActive}
                    className={isActive ? "ring-2 ring-ring ring-offset-2" : ""}
                  >
                    {statutLabels[statut]}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer fixe: Bouton supprimer + Dates */}
        <div className="px-6 py-3 border-t border-border bg-muted/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isUpdating}
              className="w-full sm:w-auto border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer cette demande
            </Button>
            <div className="text-xs text-muted-foreground text-center sm:text-right">
              <p>
                Créée le{" "}
                {new Date(demande.createdAt).toLocaleDateString("fr-FR")} à{" "}
                {new Date(demande.createdAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="mt-1">
                Modifiée le{" "}
                {new Date(demande.updatedAt).toLocaleDateString("fr-FR")} à{" "}
                {new Date(demande.updatedAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* AlertDialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la demande de{" "}
              <span className="font-semibold text-foreground">
                {demande.patient.prenom} {demande.patient.nom}
              </span>{" "}
              ?
              <br />
              <br />
              <span className="text-destructive font-medium">
                Cette action est irréversible.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
