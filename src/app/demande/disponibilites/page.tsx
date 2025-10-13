"use client";

import { Button } from "@/components/custom/Button";
import { Checkbox } from "@/components/custom/Checkbox";
import { FormNavigation } from "@/components/demande/FormNavigation";
import { PageHeader } from "@/components/demande/PageHeader";
import { Input } from "@/components/custom/Input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/custom/Select";
import { useDemandeStore } from "@/store/demandeStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DisponibilitesPage() {
  const router = useRouter();
  const { setDisponibilite, setEtapeActuelle } = useDemandeStore();
  const [lieuSoins, setLieuSoins] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [duree, setDuree] = useState("");
  const [dureePersonnalisee, setDureePersonnalisee] = useState("");

  const [touteLaJournee, setTouteLaJournee] = useState(false);
  const [creneaux, setCreneaux] = useState<
    Array<{ debut: string; fin: string }>
  >([{ debut: "", fin: "" }]);

  // Mettre à jour l'étape actuelle quand la page se charge
  useEffect(() => {
    setEtapeActuelle(3);
  }, [setEtapeActuelle]);

  const urgenceMapping = {
    "1": "URGENTE" as const,
    "7": "ELEVEE" as const,
    "10": "NORMALE" as const,
    "15": "FAIBLE" as const,
    "30": "FAIBLE" as const,
    "60": "FAIBLE" as const,
  };

  const handleContinue = () => {
    if (!lieuSoins || !dateDebut || !duree) return;

    // Vérifier si "autre" est sélectionné et qu'une durée ou lieu personnalisé est fourni
    if (duree === "autre" && !dureePersonnalisee) return;

    const urgence =
      urgenceMapping[duree as keyof typeof urgenceMapping] || "NORMALE";

    // Construire la chaîne des créneaux
    const heurePreferee = touteLaJournee
      ? "Toute la journée"
      : creneaux.map((c) => `De ${c.debut}h à ${c.fin}h`).join(", ");

    setDisponibilite({
      datePreferee: dateDebut,
      heurePreferee,
      urgence,
      lieu: lieuSoins,
    });

    router.push("/demande/patient");
  };

  return (
    <div className="w-full">
      <PageHeader
        step="Étape 3 sur 4"
        title="Où et quand souhaitez-vous faire vos soins ?"
        currentStep={3}
      />

      {/* Navigation en haut */}
      <FormNavigation
        onContinue={handleContinue}
        continueDisabled={
          !lieuSoins ||
          !dateDebut ||
          !duree ||
          (duree === "autre" && !dureePersonnalisee) ||
          (!touteLaJournee && creneaux.some((c) => !c.debut || !c.fin))
        }
      />

      <div className="space-y-4 sm:space-y-6">
        {/* Lieu des soins */}
        <div className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-sm">
          <Label className="block text-sm sm:text-base font-medium text-foreground mb-3 sm:mb-4">
            Lieu des soins *
          </Label>

          <RadioGroup
            value={lieuSoins}
            onValueChange={setLieuSoins}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
          >
            {[
              { value: "À domicile", label: "À domicile" },
              { value: "En cabinet", label: "En cabinet" },
            ].map((option) => (
              <div
                key={option.value}
                className="flex items-start p-3 sm:p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all"
              >
                <RadioGroupItem
                  value={option.value}
                  id={`lieu-${option.value}`}
                  className="mt-0.5"
                />
                <Label
                  htmlFor={`lieu-${option.value}`}
                  className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-foreground leading-tight cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Date de début */}
        <div className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-sm space-y-2">
          <Label
            htmlFor="date-debut"
            className="block text-sm sm:text-base font-medium text-foreground"
          >
            Date de début des soins *
          </Label>
          <Input
            id="date-debut"
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        {/* Durée des soins */}
        <div className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-sm">
          <Label className="block text-sm sm:text-base font-medium text-foreground mb-3 sm:mb-4">
            Durée des soins (en jours) *
          </Label>

          <RadioGroup
            value={duree}
            onValueChange={setDuree}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3"
          >
            {[
              { value: "1", label: "1 jour" },
              { value: "7", label: "7 jours" },
              { value: "10", label: "10 jours" },
              { value: "15", label: "15 jours" },
              { value: "30", label: "30 jours" },
              { value: "60", label: "Longue durée (60 jours ou +)" },
              { value: "autre", label: "Autre durée" },
            ].map((option) => (
              <div
                key={option.value}
                className="flex items-start p-2 sm:p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all"
              >
                <RadioGroupItem
                  value={option.value}
                  id={`duree-${option.value}`}
                  className="mt-0.5"
                />
                <Label
                  htmlFor={`duree-${option.value}`}
                  className="ml-2 sm:ml-3 text-xs sm:text-base font-medium text-foreground leading-tight cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Champ conditionnel pour durée personnalisée */}
          {duree === "autre" && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
              <Label
                htmlFor="duree-personnalisee"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Précisez la durée en jours :
              </Label>
              <Input
                id="duree-personnalisee"
                type="number"
                min="1"
                value={dureePersonnalisee}
                onChange={(e) => setDureePersonnalisee(e.target.value)}
                placeholder="Ex: 45"
              />
            </div>
          )}
        </div>

        {/* Disponibilités horaires */}
        <div className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-sm">
          <Label className="block text-sm sm:text-base font-medium text-foreground mb-3 sm:mb-4">
            Disponibilités horaires *
          </Label>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            L&apos;heure de passage précise sera à définir avec le professionnel
            de santé
          </p>

          {/* Checkbox "Toute la journée" */}
          <div className="flex items-center p-3 sm:p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all mb-3 sm:mb-4">
            <Checkbox
              id="toute-la-journee"
              checked={touteLaJournee}
              onCheckedChange={(checked) => setTouteLaJournee(checked === true)}
            />
            <Label
              htmlFor="toute-la-journee"
              className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-foreground cursor-pointer"
            >
              Disponible toute la journée
            </Label>
          </div>

          {!touteLaJournee && (
            <>
              <p className="text-xs sm:text-sm font-medium text-foreground mb-3">
                Sélectionnez un créneau d&apos;au moins 2 heures.
              </p>

              {/* Liste des créneaux */}
              <div className="space-y-3 sm:space-y-4">
                {creneaux.map((creneau, index) => (
                  <div key={index} className="flex items-end gap-2 sm:gap-4">
                    <div className="flex-1">
                      <Label
                        htmlFor={`creneau-debut-${index}`}
                        className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2"
                      >
                        De
                      </Label>
                      <Select
                        value={creneau.debut}
                        onValueChange={(value) => {
                          const newCreneaux = [...creneaux];
                          newCreneaux[index].debut = value;
                          setCreneaux(newCreneaux);
                        }}
                      >
                        <SelectTrigger className="w-full h-12">
                          <SelectValue placeholder="Sélectionner l'heure" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 17 }, (_, i) => i + 5).map(
                            (h) => (
                              <SelectItem key={h} value={h.toString()}>
                                {h}h
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1">
                      <Label
                        htmlFor={`creneau-fin-${index}`}
                        className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2"
                      >
                        À
                      </Label>
                      <Select
                        value={creneau.fin}
                        onValueChange={(value) => {
                          const newCreneaux = [...creneaux];
                          newCreneaux[index].fin = value;
                          setCreneaux(newCreneaux);
                        }}
                      >
                        <SelectTrigger className="w-full h-12">
                          <SelectValue placeholder="Sélectionner l'heure" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 15 }, (_, i) => i + 7).map(
                            (h) => (
                              <SelectItem key={h} value={h.toString()}>
                                {h}h
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {creneaux.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newCreneaux = creneaux.filter(
                            (_, i) => i !== index
                          );
                          setCreneaux(newCreneaux);
                        }}
                        className="px-2 sm:px-4 py-2 sm:py-3 flex-shrink-0"
                        aria-label="Supprimer ce créneau"
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCreneaux([...creneaux, { debut: "", fin: "" }]);
                  }}
                  className="text-xs sm:text-sm"
                >
                  + Ajouter un créneau
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Note informative si domicile */}
        {lieuSoins === "À domicile" && (
          <div className="bg-primary/10 rounded-lg border-2 border-primary/30 p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-foreground">
              ℹ️ <strong>À l&apos;étape suivante</strong>, nous vous demanderons
              l&apos;adresse complète où les soins seront réalisés.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
