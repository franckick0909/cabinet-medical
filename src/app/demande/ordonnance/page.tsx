"use client";

import { GroupRadio } from "@/components/custom/GroupRadio";
import { Input } from "@/components/custom/Input";
import { Textarea } from "@/components/custom/Textarea";
import { FormNavigation } from "@/components/demande/FormNavigation";
import { PageHeader } from "@/components/demande/PageHeader";
import { Label } from "@/components/ui/label";
// import { RadioGroup } from "@/components/ui/radio-group";
import { useDemandeStore } from "@/store/demandeStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrdonnancePage() {
  const router = useRouter();
  const { setOrdonnance, setEtapeActuelle } = useDemandeStore();
  const [aOrdonnance, setAOrdonnance] = useState<string>("");
  const [prescritPar, setPrescritPar] = useState("");
  const [dateOrdonnance, setDateOrdonnance] = useState("");
  const [details, setDetails] = useState("");

  // Mettre à jour l'étape actuelle quand la page se charge
  useEffect(() => {
    setEtapeActuelle(2);
  }, [setEtapeActuelle]);

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
        currentStep={2}
      />

      {/* Navigation en haut */}
      <FormNavigation
        onContinue={handleContinue}
        continueDisabled={!aOrdonnance}
      />

      {/* Radio buttons */}
      <div className="bg-white rounded-lg border-none p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <Label className="block text-lg sm:text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] mb-3 sm:mb-4">
          Avez-vous une ordonnance ? *
        </Label>

        <div className="space-y-3 sm:space-y-4">
          {/* Option 1 */}
          <div
            className="flex items-start p-3 sm:p-4 rounded-lg border transition-all cursor-pointer group border-gray-200 hover:border-[#2D5F4F] hover:bg-[#2D5F4F]/5"
            onClick={() => setAOrdonnance("oui-domicile")}
          >
            <GroupRadio
              checked={aOrdonnance === "oui-domicile"}
              className="mt-0.5"
            />
            <Label className="ml-2 sm:ml-3 text-sm sm:text-base font-medium cursor-pointer group-hover:text-primary">
              Oui, avec mention &quot;à domicile&quot;
            </Label>
          </div>

          {/* Option 2 */}
          <div
            className="flex items-start p-3 sm:p-4 rounded-lg border transition-all cursor-pointer group border-gray-200 hover:border-[#2D5F4F] hover:bg-[#2D5F4F]/5"
            onClick={() => setAOrdonnance("oui-sans")}
          >
            <GroupRadio
              checked={aOrdonnance === "oui-sans"}
              className="mt-0.5"
            />
            <Label className="ml-2 sm:ml-3 text-sm sm:text-base font-medium cursor-pointer group-hover:text-primary">
              Oui, sans mention &quot;à domicile&quot;
            </Label>
          </div>

          {/* Option 3 */}
          <div
            className="flex items-start p-3 sm:p-4 rounded-lg border transition-all cursor-pointer group border-gray-200 hover:border-[#2D5F4F] hover:bg-[#2D5F4F]/5"
            onClick={() => setAOrdonnance("non")}
          >
            <GroupRadio checked={aOrdonnance === "non"} className="mt-0.5" />
            <Label className="ml-2 sm:ml-3 text-sm sm:text-base font-medium cursor-pointer group-hover:text-primary">
              Non
            </Label>
          </div>
        </div>

        {/* Note informative */}
        {(aOrdonnance === "oui-domicile" || aOrdonnance === "oui-sans") && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-[#F9F7F2] rounded-lg border border-[#2D5F4F]/20">
            <p className="text-xs sm:text-sm text-[#1a1a1a]">
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
        <div className="bg-white rounded-lg border-none p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <h3 className="text-lg sm:text-xl font-cormorant-garamond font-semibold text-[#2D5F4F] mb-3 sm:mb-4">
            Ajoutez votre ordonnance si vous l&apos;avez à disposition
            (facultatif)
          </h3>

          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              0/6 document(s) - Au format JPG, PNG ou PDF - 6 Mo par fichier
            </p>

            <button
              type="button"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-dashed border-[#2D5F4F]/30 rounded-lg text-sm sm:text-base text-[#2D5F4F] hover:bg-[#2D5F4F]/5 transition-all font-medium"
            >
              + Ajouter un document
            </button>

            <div className="pt-3 sm:pt-4 border-t border-border space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prescritPar">
                  Prescrit par (Nom du médecin)
                </Label>
                <Input
                  id="prescritPar"
                  type="text"
                  value={prescritPar}
                  onChange={(e) => setPrescritPar(e.target.value)}
                  placeholder="Dr. Martin Dupont"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOrdonnance">
                  Date de l&apos;ordonnance
                </Label>
                <Input
                  id="dateOrdonnance"
                  type="date"
                  value={dateOrdonnance}
                  onChange={(e) => setDateOrdonnance(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Détails complémentaires</Label>
                <Textarea
                  id="details"
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Informations supplémentaires sur l'ordonnance..."
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
