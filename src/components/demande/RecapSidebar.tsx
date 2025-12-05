"use client";

import { Button } from "@/components/custom/Button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useDemandeStore } from "@/store/demandeStore";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function RecapSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { soin, ordonnance, disponibilite, patient, reset } = useDemandeStore();

  // Ne pas afficher sur la page de confirmation
  if (pathname?.includes("/confirmation")) {
    return null;
  }

  const isStepCompleted = (step: string) => {
    switch (step) {
      case "soins":
        return !!soin;
      case "ordonnance":
        return ordonnance !== null;
      case "disponibilites":
        return !!disponibilite;
      case "patient":
        return !!patient;
      default:
        return false;
    }
  };

  // Déterminer l'étape précédente
  const getPreviousStep = () => {
    if (pathname?.includes("/ordonnance")) return "/demande/soins";
    if (pathname?.includes("/disponibilites")) return "/demande/ordonnance";
    if (pathname?.includes("/patient")) return "/demande/disponibilites";
    if (pathname?.includes("/recapitulatif")) return "/demande/patient";
    return null;
  };

  const handleRestart = () => {
    reset();
    router.push("/demande/soins");
  };

  return (
    <div className="w-full flex-shrink-0">
      <div className="">
        {/* Boutons d'action */}
        <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3">
          {/* Bouton Retour */}
          {getPreviousStep() && (
            <Button
              type="button"
              variant="outlined"
              onClick={() => router.push(getPreviousStep()!)}
              className="w-full sm:flex-1 lg:w-full h-auto px-3 sm:px-4 py-2 sm:py-3 border-2 text-sm sm:text-base font-medium"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">
                Retour à l&apos;étape précédente
              </span>
              <span className="sm:hidden">Retour</span>
            </Button>
          )}

          {/* Bouton Recommencer */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:flex-1 lg:w-full h-auto px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Recommencer la demande</span>
                <span className="sm:hidden">Recommencer</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-4 sm:mb-6">Recommencer la demande ?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm sm:text-base">
                  Êtes-vous sûr de vouloir recommencer ? Toutes vos données
                  seront perdues et vous devrez remplir à nouveau le formulaire.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter >
                <AlertDialogCancel className="text-sm sm:text-base">Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRestart}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1"
                >
                  Oui, recommencer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-cormorant-garamond font-bold text-[#2D5F4F] mb-4 sm:mb-6">
            Récapitulatif de votre demande
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {/* Section Soins */}
            <div>
              <div className="flex items-start gap-2 sm:gap-3 mb-2">
                {/* Icône de statut */}
                <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                  {isStepCompleted("soins") ? (
                    <Badge
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full p-0 flex items-center justify-center bg-[#C8D96F] hover:bg-[#C8D96F] text-[#1a1a1a]"
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Badge>
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-muted"></div>
                  )}
                </div>

                {/* Titre et bouton modifier */}
                <div className="flex-1 flex items-start sm:items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground leading-tight">
                    Voulez-vous ajouter un autre soin ?
                  </h3>
                  {isStepCompleted("soins") && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="Modifier la section Soins"
                      onClick={() => router.push("/demande/soins")}
                      className="text-xs sm:text-sm h-auto py-1 px-2 flex-shrink-0"
                    >
                      Modifier
                    </Button>
                  )}
                </div>
              </div>
                <div className="ml-7 sm:ml-9">
                {soin ? (
                  <div className="text-sm sm:text-base text-[#1a1a1a] bg-[#F9F7F2] rounded p-2 sm:p-3 border border-[#2D5F4F]/10">
                    <p className="font-medium text-[#2D5F4F]">{soin.details.titre}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Object.entries(soin.details)
                        .filter(([key]) => key !== "titre")
                        .map(([, value]) => String(value))
                        .join(" - ")}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-muted-foreground italic">
                    Aucun soin sélectionné
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border"></div>

            {/* Section Ordonnance */}
            <div>
              <div className="flex items-start gap-2 sm:gap-3 mb-2">
                {/* Icône de statut */}
                <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                  {isStepCompleted("ordonnance") ? (
                    <Badge
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full p-0 flex items-center justify-center bg-[#C8D96F] hover:bg-[#C8D96F] text-[#1a1a1a]"
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Badge>
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-muted"></div>
                  )}
                </div>

                {/* Titre et bouton modifier */}
                <div className="flex-1 flex items-start sm:items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground leading-tight">
                    Avez-vous une ordonnance ?
                  </h3>
                  {isStepCompleted("ordonnance") && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="Modifier la section Ordonnance"
                      onClick={() => router.push("/demande/ordonnance")}
                      className="text-xs sm:text-sm h-auto py-1 px-2 flex-shrink-0"
                    >
                      Modifier
                    </Button>
                  )}
                </div>
              </div>
              <div className="ml-7 sm:ml-9">
                {ordonnance ? (
                  <div className="text-sm sm:text-base text-[#1a1a1a]">
                    {ordonnance.aOrdonnance ? (
                      <div className="bg-[#F9F7F2] rounded p-2 sm:p-3 border border-[#2D5F4F]/10">
                        <p className="font-medium text-[#2D5F4F]">Ordonnance présente</p>
                        {ordonnance.prescritPar && (
                          <p className="text-sm sm:text-base text-muted-foreground mt-1">
                            Dr. {ordonnance.prescritPar}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Aucun document ajouté
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-muted-foreground italic">
                    Non renseigné
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border"></div>

            {/* Section Disponibilités */}
            <div>
              <div className="flex items-start gap-2 sm:gap-3 mb-2">
                {/* Icône de statut */}
                <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                  {isStepCompleted("disponibilites") ? (
                    <Badge
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full p-0 flex items-center justify-center bg-[#C8D96F] hover:bg-[#C8D96F] text-[#1a1a1a]"
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Badge>
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-muted"></div>
                  )}
                </div>

                {/* Titre et bouton modifier */}
                <div className="flex-1 flex items-start sm:items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground leading-tight">
                    Où et quand souhaitez-vous faire vos soins ?
                  </h3>
                  {isStepCompleted("disponibilites") && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="Modifier la section Disponibilités"
                      onClick={() => router.push("/demande/disponibilites")}
                      className="text-xs sm:text-sm h-auto py-1 px-2 flex-shrink-0"
                    >
                      Modifier
                    </Button>
                  )}
                </div>
              </div>
              <div className="ml-7 sm:ml-9">
                {disponibilite ? (
                  <div className="text-sm sm:text-base text-[#1a1a1a] space-y-2">
                    {disponibilite.datePreferee && (
                      <div className="bg-[#F9F7F2] rounded p-2 sm:p-3 border border-[#2D5F4F]/10">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          À partir du
                        </p>
                        <p className="font-medium text-sm sm:text-base">
                          {new Date(
                            disponibilite.datePreferee
                          ).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        {disponibilite.heurePreferee && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {disponibilite.heurePreferee}
                          </p>
                        )}
                        {disponibilite.lieu && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            📍 {disponibilite.lieu}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-muted-foreground italic">
                    Non renseigné
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border"></div>

            {/* Section Patient */}
            <div>
              <div className="flex items-start gap-2 sm:gap-3 mb-2">
                {/* Icône de statut */}
                <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                  {isStepCompleted("patient") ? (
                    <Badge
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full p-0 flex items-center justify-center bg-[#C8D96F] hover:bg-[#C8D96F] text-[#1a1a1a]"
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Badge>
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-muted"></div>
                  )}
                </div>

                {/* Titre et bouton modifier */}
                <div className="flex-1 flex items-start sm:items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground leading-tight">
                    Qui est le patient ?
                  </h3>
                  {isStepCompleted("patient") && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="Modifier la section Patient"
                      onClick={() => router.push("/demande/patient")}
                      className="text-xs sm:text-sm h-auto py-1 px-2 flex-shrink-0"
                    >
                      Modifier
                    </Button>
                  )}
                </div>
              </div>
              <div className="ml-7 sm:ml-9">
                {patient ? (
                  <div className="text-sm sm:text-base text-[#1a1a1a] bg-[#F9F7F2] rounded p-2 sm:p-3 border border-[#2D5F4F]/10">
                    <p className="font-medium text-[#2D5F4F]">
                      {patient.prenom} {patient.nom}
                    </p>
                    {patient.email && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {patient.email}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {patient.telephone}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-muted-foreground italic">
                    Non renseigné
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Note informative */}
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-[#2D5F4F]/5 border border-[#2D5F4F]/10 rounded-lg">
          <p className="text-xs sm:text-sm lg:text-base text-[#2D5F4F]">
            💡 <strong>Astuce :</strong> Vos informations sont sauvegardées
            automatiquement. Vous pouvez modifier chaque section à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}
