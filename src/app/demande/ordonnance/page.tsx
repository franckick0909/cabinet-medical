"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormNavigation } from "../../../components/demande/FormNavigation";
import { PageHeader } from "../../../components/demande/PageHeader";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Textarea } from "../../../components/ui/textarea";
import { useDemandeStore } from "../../../store/demandeStore";

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
      <div className="bg-card rounded-lg border border-border p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <Label className="block text-sm sm:text-base font-medium text-foreground mb-3 sm:mb-4">
          Avez-vous une ordonnance ? *
        </Label>

        <RadioGroup
          value={aOrdonnance}
          onValueChange={setAOrdonnance}
          className="space-y-3 sm:space-y-4"
        >
          {/* Option 1 */}
          <div className="flex items-start p-3 sm:p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all">
            <RadioGroupItem
              value="oui-domicile"
              id="oui-domicile"
              className="mt-0.5"
            />
            <Label
              htmlFor="oui-domicile"
              className="ml-2 sm:ml-3 text-sm sm:text-base font-medium cursor-pointer"
            >
              Oui, avec mention &quot;à domicile&quot;
            </Label>
          </div>

          {/* Option 2 */}
          <div className="flex items-start p-3 sm:p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all">
            <RadioGroupItem value="oui-sans" id="oui-sans" className="mt-0.5" />
            <Label
              htmlFor="oui-sans"
              className="ml-2 sm:ml-3 text-sm sm:text-base font-medium cursor-pointer"
            >
              Oui, sans mention &quot;à domicile&quot;
            </Label>
          </div>

          {/* Option 3 */}
          <div className="flex items-start p-3 sm:p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all">
            <RadioGroupItem value="non" id="non" className="mt-0.5" />
            <Label
              htmlFor="non"
              className="ml-2 sm:ml-3 text-sm sm:text-base font-medium cursor-pointer"
            >
              Non
            </Label>
          </div>
        </RadioGroup>

        {/* Note informative */}
        {(aOrdonnance === "oui-domicile" || aOrdonnance === "oui-sans") && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-muted rounded-lg border border-border">
            <p className="text-xs sm:text-sm text-foreground">
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
        <div className="bg-card rounded-lg border border-border p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
            Ajoutez votre ordonnance si vous l&apos;avez à disposition
            (facultatif)
          </h3>

          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              0/6 document(s) - Au format JPG, PNG ou PDF - 6 Mo par fichier
            </p>

            <button
              type="button"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-dashed border-primary rounded-lg text-sm sm:text-base text-primary hover:bg-primary/10 transition-all font-medium"
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
