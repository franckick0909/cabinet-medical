"use client";

import { submitDemande } from "@/actions/demandes";
import { Button } from "@/components/custom/Button";
import { Card } from "@/components/custom/Card";
import { PageHeader } from "@/components/demande/PageHeader";
import { useDemandeStore } from "@/store/demandeStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RecapitulatifPage() {
  const router = useRouter();
  const { soin, ordonnance, disponibilite, patient, reset, setEtapeActuelle } =
    useDemandeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mettre à jour l'étape actuelle quand la page se charge
  useEffect(() => {
    setEtapeActuelle(5);
  }, [setEtapeActuelle]);

  // Vérifier que toutes les données sont présentes
  useEffect(() => {
    if (!soin || !ordonnance || !disponibilite || !patient) {
      router.push("/demande/soins");
    }
  }, [soin, ordonnance, disponibilite, patient, router]);

  // Afficher un loader pendant la vérification
  if (!soin || !ordonnance || !disponibilite || !patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des données...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Appel de la Server Action
      const result = await submitDemande({
        soin,
        ordonnance,
        disponibilite,
        patient,
      });

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de l'envoi de la demande");
      }

      // Réinitialiser le store
      reset();

      // Rediriger vers la page de confirmation
      router.push(`/demande/confirmation?id=${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const urgenceLabels = {
    FAIBLE: { label: "Pas urgent", color: "text-green-600" },
    NORMALE: { label: "Normal", color: "text-blue-600" },
    ELEVEE: { label: "Prioritaire", color: "text-orange-600" },
    URGENTE: { label: "Urgent", color: "text-red-600" },
  };

  return (
    <div className="w-full">
      {/* Header avec progress bar améliorée */}
      <PageHeader
        step="Étape 5 sur 5"
        title="Récapitulatif de votre demande"
        subtitle="Vérifiez vos informations avant de valider"
        showProgressSteps={true}
      />

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm sm:text-base">
          {error}
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        {/* Type de soin */}
        <Card className="p-4 sm:p-6 bg-white border-none shadow-sm">
          <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
            <h3 className="text-lg sm:text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] truncate">
              🩺 Type de soin
            </h3>
            <Button
              variant="ghost"
              size="md"
              onClick={() => router.push("/demande/soins")}
              className="flex-shrink-0"
            >
              Modifier
            </Button>
          </div>
          <p className="text-[#2D5F4F] font-medium mb-2 text-sm sm:text-base">
            {soin.details.titre}
          </p>
          <div className="text-sm sm:text-base text-muted-foreground space-y-1">
            {Object.entries(soin.details)
              .filter(([key]) => key !== "titre")
              .map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium capitalize">
                    {key === "creneau"
                      ? "Créneaux souhaités"
                      : key === "type"
                        ? "Type de prélèvement"
                        : key === "jeun"
                          ? "À jeun"
                          : key === "analyses"
                            ? "Analyses prescrites"
                            : key}
                    :
                  </span>
                  <span>
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </span>
                </div>
              ))}
          </div>
        </Card>

        {/* Ordonnance */}
        <Card className="p-4 sm:p-6 bg-white border-none shadow-sm">
          <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
            <h3 className="text-lg sm:text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] truncate">
              📄 Ordonnance
            </h3>
            <Button
              variant="ghost"
              size="md"
              onClick={() => router.push("/demande/ordonnance")}
              className="flex-shrink-0"
            >
              Modifier
            </Button>
          </div>
          {ordonnance.aOrdonnance ? (
            <div className="text-sm sm:text-base text-muted-foreground space-y-1">
              <p>
                <span className="font-medium">Statut:</span> Ordonnance présente
              </p>
              {ordonnance.prescritPar && (
                <p>
                  <span className="font-medium">Prescrit par:</span>{" "}
                  {ordonnance.prescritPar}
                </p>
              )}
              {ordonnance.dateOrdonnance && (
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(ordonnance.dateOrdonnance).toLocaleDateString(
                    "fr-FR"
                  )}
                </p>
              )}
              {ordonnance.details && (
                <p>
                  <span className="font-medium">Détails:</span>{" "}
                  {ordonnance.details}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm sm:text-base text-muted-foreground">
              Pas d&apos;ordonnance
            </p>
          )}
        </Card>

        {/* Disponibilités */}
        <Card className="p-4 sm:p-6 bg-white border-none shadow-sm">
          <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
            <h3 className="text-lg sm:text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] truncate">
              📅 Disponibilités
            </h3>
            <Button
              variant="ghost"
              size="md"
              onClick={() => router.push("/demande/disponibilites")}
              className="flex-shrink-0"
            >
              Modifier
            </Button>
          </div>
          <div className="text-sm sm:text-base text-muted-foreground space-y-1">
            {disponibilite.datePreferee && (
              <p>
                <span className="font-medium">Date souhaitée:</span>{" "}
                {new Date(disponibilite.datePreferee).toLocaleDateString(
                  "fr-FR"
                )}
              </p>
            )}
            {disponibilite.heurePreferee && (
              <p>
                <span className="font-medium">Moment:</span>{" "}
                {disponibilite.heurePreferee}
              </p>
            )}
            <p>
              <span className="font-medium">Urgence:</span>{" "}
              <span className={urgenceLabels[disponibilite.urgence].color}>
                {urgenceLabels[disponibilite.urgence].label}
              </span>
            </p>
            {disponibilite.lieu && (
              <p>
                <span className="font-medium">Lieu:</span> {disponibilite.lieu}
              </p>
            )}
          </div>
        </Card>

        {/* Patient */}
        <Card className="p-4 sm:p-6 bg-white border-none shadow-sm">
          <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
            <h3 className="text-lg sm:text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] truncate">
              👤 Informations patient
            </h3>
            <Button
              variant="ghost"
              size="md"
              onClick={() => router.push("/demande/patient")}
              className="flex-shrink-0"
            >
              Modifier
            </Button>
          </div>
          <div className="text-sm sm:text-base text-muted-foreground space-y-1">
            <p>
              <span className="font-medium">Nom:</span> {patient.nom}{" "}
              {patient.prenom}
            </p>
            {patient.email && (
              <p>
                <span className="font-medium">Email:</span> {patient.email}
              </p>
            )}
            <p>
              <span className="font-medium">Téléphone:</span>{" "}
              {patient.telephone}
            </p>
            <p>
              <span className="font-medium">Date de naissance:</span>{" "}
              {new Date(patient.dateNaissance).toLocaleDateString("fr-FR")}
            </p>
            {patient.adresse && (
              <p>
                <span className="font-medium">Adresse:</span> {patient.adresse}
              </p>
            )}
            {patient.ville && patient.codePostal && (
              <p>
                <span className="font-medium">Ville:</span> {patient.codePostal}{" "}
                {patient.ville}
              </p>
            )}
            {patient.numeroSecu && (
              <p>
                <span className="font-medium">N° Sécu:</span>{" "}
                {patient.numeroSecu}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 sm:mt-8">
        <Button
          variant="outlined"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Retour
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto sm:min-w-[200px]"
        >
          {isSubmitting ? "Envoi en cours..." : "Valider ma demande"}
        </Button>
      </div>
    </div>
  );
}
