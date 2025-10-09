"use client";

import { usePathname, useRouter } from "next/navigation";
import { useDemandeStore } from "../../store/demandeStore";

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
    if (
      confirm(
        "Êtes-vous sûr de vouloir recommencer ? Toutes vos données seront perdues."
      )
    ) {
      reset();
      router.push("/demande/soins");
    }
  };

  return (
    <div className="w-full flex-shrink-0">
      <div className="">
        {/* Boutons d'action */}
        <div className="mb-4 flex flex-col gap-3">
          {/* Bouton Retour */}
          {getPreviousStep() && (
            <button
              type="button"
              onClick={() => router.push(getPreviousStep()!)}
              className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 text-blue-700 font-medium rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-lg">←</span>
              Retour à l&apos;étape précédente
            </button>
          )}

          {/* Bouton Recommencer */}
          <button
            type="button"
            onClick={handleRestart}
            className="w-full px-4 py-3 bg-red-50 border-2 border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-100 hover:border-red-300 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-lg">↻</span>
            Recommencer la demande
          </button>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Récapitulatif de votre demande
          </h2>

          <div className="space-y-6">
            {/* Section Soins */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                {/* Icône de statut */}
                <div className="flex-shrink-0 mt-1">
                  {isStepCompleted("soins") ? (
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                  )}
                </div>

                {/* Titre et bouton modifier */}
                <div className="flex-1 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-700">
                    Voulez-vous ajouter un autre soin ?
                  </h3>
                  {isStepCompleted("soins") && (
                    <button
                      type="button"
                      aria-label="Modifier la section Soins"
                      onClick={() => router.push("/demande/soins")}
                      className="text-base text-blue-600 hover:text-blue-700 hover:underline ml-2 flex-shrink-0"
                    >
                      Modifier
                    </button>
                  )}
                </div>
              </div>
              <div className="ml-9">
                {soin ? (
                  <div className="text-base text-gray-900 bg-blue-50 rounded p-3">
                    <p className="font-medium">{soin.details.titre}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Object.entries(soin.details)
                        .filter(([key]) => key !== "titre")
                        .map(([, value]) => String(value))
                        .join(" - ")}
                    </p>
                  </div>
                ) : (
                  <p className="text-base text-gray-400 italic">
                    Aucun soin sélectionné
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Section Ordonnance */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                {/* Icône de statut */}
                <div className="flex-shrink-0 mt-1">
                  {isStepCompleted("ordonnance") ? (
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                  )}
                </div>

                {/* Titre et bouton modifier */}
                <div className="flex-1 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-700">
                    Avez-vous une ordonnance ?
                  </h3>
                  {isStepCompleted("ordonnance") && (
                    <button
                      type="button"
                      aria-label="Modifier la section Ordonnance"
                      onClick={() => router.push("/demande/ordonnance")}
                      className="text-base text-blue-600 hover:text-blue-700 hover:underline ml-2 flex-shrink-0"
                    >
                      Modifier
                    </button>
                  )}
                </div>
              </div>
              <div className="ml-9">
                {ordonnance ? (
                  <div className="text-base text-gray-900">
                    {ordonnance.aOrdonnance ? (
                      <div className="bg-blue-50 rounded p-3">
                        <p className="font-medium">Ordonnance présente</p>
                        {ordonnance.prescritPar && (
                          <p className="text-base text-gray-600 mt-1">
                            Dr. {ordonnance.prescritPar}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-base text-gray-600">
                        Aucun document ajouté
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-base text-gray-400 italic">
                    Non renseigné
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Section Disponibilités */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                {/* Icône de statut */}
                <div className="flex-shrink-0 mt-1">
                  {isStepCompleted("disponibilites") ? (
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                  )}
                </div>

                {/* Titre et bouton modifier */}
                <div className="flex-1 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-700">
                    Où et quand souhaitez-vous faire vos soins ?
                  </h3>
                  {isStepCompleted("disponibilites") && (
                    <button
                      type="button"
                      aria-label="Modifier la section Disponibilités"
                      onClick={() => router.push("/demande/disponibilites")}
                      className="text-base text-blue-600 hover:text-blue-700 hover:underline ml-2 flex-shrink-0"
                    >
                      Modifier
                    </button>
                  )}
                </div>
              </div>
              <div className="ml-9">
                {disponibilite ? (
                  <div className="text-base text-gray-900 space-y-2">
                    {disponibilite.datePreferee && (
                      <div className="bg-blue-50 rounded p-3">
                        <p className="text-base text-gray-600">À partir du</p>
                        <p className="font-medium">
                          {new Date(
                            disponibilite.datePreferee
                          ).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        {disponibilite.heurePreferee && (
                          <p className="text-base text-gray-600 mt-1">
                            {disponibilite.heurePreferee}
                          </p>
                        )}
                        {disponibilite.lieu && (
                          <p className="text-base text-gray-600 mt-1">
                            📍 {disponibilite.lieu}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-base text-gray-400 italic">
                    Non renseigné
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Section Patient */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                {/* Icône de statut */}
                <div className="flex-shrink-0 mt-1">
                  {isStepCompleted("patient") ? (
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                  )}
                </div>

                {/* Titre et bouton modifier */}
                <div className="flex-1 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-700">
                    Qui est le patient ?
                  </h3>
                  {isStepCompleted("patient") && (
                    <button
                      type="button"
                      aria-label="Modifier la section Patient"
                      onClick={() => router.push("/demande/patient")}
                      className="text-base text-blue-600 hover:text-blue-700 hover:underline ml-2 flex-shrink-0"
                    >
                      Modifier
                    </button>
                  )}
                </div>
              </div>
              <div className="ml-9">
                {patient ? (
                  <div className="text-base text-gray-900 bg-blue-50 rounded p-3">
                    <p className="font-medium">
                      {patient.prenom} {patient.nom}
                    </p>
                    {patient.email && (
                      <p className="text-base text-gray-600 mt-1">
                        {patient.email}
                      </p>
                    )}
                    <p className="text-base text-gray-600">
                      {patient.telephone}
                    </p>
                  </div>
                ) : (
                  <p className="text-base text-gray-400 italic">
                    Non renseigné
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Note informative */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-base text-blue-800">
            💡 <strong>Astuce :</strong> Vos informations sont sauvegardées
            automatiquement. Vous pouvez modifier chaque section à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}
