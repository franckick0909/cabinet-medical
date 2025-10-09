"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "../../../components/demande/PageHeader";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { useDemandeStore } from "../../../store/demandeStore";

export default function OrdonnancePage() {
  const router = useRouter();
  const { setOrdonnance } = useDemandeStore();
  const [aOrdonnance, setAOrdonnance] = useState<string>("");
  const [prescritPar, setPrescritPar] = useState("");
  const [dateOrdonnance, setDateOrdonnance] = useState("");
  const [details, setDetails] = useState("");

  const handleContinue = () => {
    if (!aOrdonnance) return;

    const hasOrdonnance =
      aOrdonnance === "oui-domicile" || aOrdonnance === "oui-sans";

    setOrdonnance({
      aOrdonnance: hasOrdonnance,
      prescritPar: hasOrdonnance ? prescritPar : undefined,
      dateOrdonnance: hasOrdonnance ? dateOrdonnance : undefined,
      details: hasOrdonnance ? details : undefined,
    });

    router.push("/demande/disponibilites");
  };

  return (
    <div className="w-full">
      <PageHeader
        step="Étape 2 sur 4"
        title="Avez-vous une ordonnance ?"
        subtitle="* champs obligatoires"
        currentStep={2}
      />

      {/* Radio buttons */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <label className="block text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">
          Avez-vous une ordonnance ? *
        </label>

        <div className="space-y-3 sm:space-y-4">
          {/* Option 1 */}
          <label className="flex items-start p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all">
            <input
              type="radio"
              name="ordonnance"
              value="oui-domicile"
              checked={aOrdonnance === "oui-domicile"}
              onChange={(e) => setAOrdonnance(e.target.value)}
              className="w-5 h-5 mt-0.5 border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
            />
            <div className="ml-2 sm:ml-3 flex-1">
              <span className="text-sm sm:text-base font-medium text-gray-900">
                Oui, avec mention &quot;à domicile&quot;
              </span>
            </div>
          </label>

          {/* Option 2 */}
          <label className="flex items-start p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all">
            <input
              type="radio"
              name="ordonnance"
              value="oui-sans"
              checked={aOrdonnance === "oui-sans"}
              onChange={(e) => setAOrdonnance(e.target.value)}
              className="w-5 h-5 mt-0.5 border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
            />
            <div className="ml-2 sm:ml-3 flex-1">
              <span className="text-sm sm:text-base font-medium text-gray-900">
                Oui, sans mention &quot;à domicile&quot;
              </span>
            </div>
          </label>

          {/* Option 3 */}
          <label className="flex items-start p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all">
            <input
              type="radio"
              name="ordonnance"
              value="non"
              checked={aOrdonnance === "non"}
              onChange={(e) => setAOrdonnance(e.target.value)}
              className="w-5 h-5 mt-0.5 border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
            />
            <div className="ml-2 sm:ml-3 flex-1">
              <span className="text-sm sm:text-base font-medium text-gray-900">
                Non
              </span>
            </div>
          </label>
        </div>

        {/* Note informative */}
        {(aOrdonnance === "oui-domicile" || aOrdonnance === "oui-sans") && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-700">
              {aOrdonnance === "oui-sans" && (
                <>
                  ℹ️ Si l&apos;ordonnance ne précise pas &quot;à domicile&quot;,
                  le déplacement du praticien sera à vos frais (2,50€ en
                  général). Vous pouvez demander à votre médecin de refaire
                  l&apos;ordonnance en ajoutant la mention pour éviter ces
                  frais.
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Détails ordonnance */}
      {(aOrdonnance === "oui-domicile" || aOrdonnance === "oui-sans") && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Ajoutez votre ordonnance si vous l&apos;avez à disposition
            (facultatif)
          </h3>

          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-gray-600">
              0/6 document(s) - Au format JPG, PNG ou PDF - 6 Mo par fichier
            </p>

            <button
              type="button"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-dashed border-blue-400 rounded-lg text-sm sm:text-base text-blue-600 hover:bg-blue-50 transition-all font-medium"
            >
              + Ajouter un document
            </button>

            <div className="pt-3 sm:pt-4 border-t border-gray-200 space-y-3 sm:space-y-4">
              <Input
                label="Prescrit par (Nom du médecin)"
                type="text"
                value={prescritPar}
                onChange={(e) => setPrescritPar(e.target.value)}
                placeholder="Dr. Martin Dupont"
                fullWidth
              />

              <Input
                label="Date de l'ordonnance"
                type="date"
                value={dateOrdonnance}
                onChange={(e) => setDateOrdonnance(e.target.value)}
                fullWidth
              />

              <Textarea
                label="Détails complémentaires"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Informations supplémentaires sur l'ordonnance..."
                fullWidth
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 sm:pt-6 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="w-full sm:w-auto"
        >
          Retour
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!aOrdonnance}
          size="lg"
          className="w-full sm:w-auto"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}
