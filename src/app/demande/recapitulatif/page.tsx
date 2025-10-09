"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { useDemandeStore } from "../../../store/demandeStore";

export default function RecapitulatifPage() {
  const router = useRouter();
  const { soin, ordonnance, disponibilite, patient, reset } = useDemandeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier que toutes les données sont présentes
  if (!soin || !ordonnance || !disponibilite || !patient) {
    router.push("/demande/soins");
    return null;
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/demandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient: {
            ...patient,
            dateNaissance: new Date(patient.dateNaissance),
          },
          demande: {
            typeSoin: soin.type,
            detailsSoin: soin.details,
            aOrdonnance: ordonnance.aOrdonnance,
            ordonnanceDetails: ordonnance.aOrdonnance ? ordonnance : null,
            datePreferee: disponibilite.datePreferee
              ? new Date(disponibilite.datePreferee)
              : null,
            heurePreferee: disponibilite.heurePreferee,
            urgence: disponibilite.urgence,
            lieu: disponibilite.lieu,
            statut: "EN_ATTENTE",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de la demande");
      }

      const data = await response.json();

      // Réinitialiser le store
      reset();

      // Rediriger vers la page de confirmation
      router.push(`/demande/confirmation?id=${data.id}`);
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
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
          Récapitulatif de votre demande
        </h1>
        <p className="text-sm sm:text-lg text-gray-600">
          Vérifiez vos informations avant de valider
        </p>
      </div>

      {/* Progress - All completed */}
      <div className="mb-6 sm:mb-12 overflow-x-auto pb-2">
        <div className="flex items-center justify-center space-x-1 sm:space-x-2 min-w-max mx-auto px-2">
          {["Soins", "Ordonnance", "Disponibilités", "Patient"].map(
            (step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm sm:text-base">
                    ✓
                  </div>
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-green-600">
                    {step}
                  </span>
                </div>
                {index < 3 && (
                  <div className="w-8 sm:w-16 h-1 bg-green-600 mx-1 sm:mx-2"></div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm sm:text-base">
          {error}
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        {/* Type de soin */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
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
          <p className="text-gray-700 font-medium mb-2 text-sm sm:text-base">
            {soin.details.titre}
          </p>
          <div className="text-sm sm:text-base text-gray-600 space-y-1">
            {Object.entries(soin.details)
              .filter(([key]) => key !== "titre")
              .map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium capitalize">{key}: </span>
                  <span>{String(value)}</span>
                </div>
              ))}
          </div>
        </Card>

        {/* Ordonnance */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
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
            <div className="text-sm sm:text-base text-gray-600 space-y-1">
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
            <p className="text-sm sm:text-base text-gray-600">
              Pas d&apos;ordonnance
            </p>
          )}
        </Card>

        {/* Disponibilités */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
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
          <div className="text-sm sm:text-base text-gray-600 space-y-1">
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
        <Card className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
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
          <div className="text-sm sm:text-base text-gray-600 space-y-1">
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
          variant="secondary"
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
