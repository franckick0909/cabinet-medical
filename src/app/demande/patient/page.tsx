"use client";

import { FormNavigation } from "@/components/demande/FormNavigation";
import { PageHeader } from "@/components/demande/PageHeader";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDemandeStore } from "@/store/demandeStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const patientSchema = z.object({
  civilite: z.enum(["Madame", "Monsieur"]).refine((val) => val !== undefined, {
    message: "Veuillez sélectionner une civilité",
  }),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  dateNaissance: z.string().min(1, "Date de naissance requise"),
  telephone: z.string().min(10, "Numéro de téléphone invalide"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  adresse: z.string().optional(),
  complementAdresse: z.string().optional(),
  codePostal: z.string().optional(),
  ville: z.string().optional(),
  numeroSecu: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function PatientPage() {
  const router = useRouter();
  const { setPatient, setEtapeActuelle } = useDemandeStore();
  const [civilite, setCivilite] = useState<"Madame" | "Monsieur" | "">("");
  const [pasEmail, setPasEmail] = useState(false);
  const [adresseInput, setAdresseInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    mode: "onChange",
  });

  // Mettre à jour l'étape actuelle quand la page se charge
  useEffect(() => {
    setEtapeActuelle(4);
  }, [setEtapeActuelle]);

  const handleCiviliteChange = (value: "Madame" | "Monsieur") => {
    setCivilite(value);
    setValue("civilite", value);
  };

  const onSubmit = (data: PatientFormData) => {
    setPatient(data);
    router.push("/demande/recapitulatif");
  };

  return (
    <div className="w-full">
      <PageHeader
        step="Étape 4 sur 4"
        title="Qui est le patient ?"
        currentStep={4}
      />

      {/* Navigation en haut */}
      <FormNavigation
        onContinue={handleSubmit(onSubmit)}
        continueDisabled={!isValid}
        continueText="Voir le récapitulatif"
      />

      <div className="bg-muted rounded-lg border border-border p-4 mb-6">
        <p className="text-sm text-muted-foreground">
          Saisissez vos coordonnées afin qu&apos;un professionnel de santé
          qualifié et disponible prenne contact avec vous pour convenir
          d&apos;un rendez-vous.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6 bg-card rounded-lg border border-border p-4 sm:p-6 shadow-sm"
      >
        {/* Civilité */}
        <div className="">
          <Label className="block text-base sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
            Civilité
          </Label>

          <RadioGroup
            value={civilite}
            onValueChange={handleCiviliteChange}
            className="flex gap-2 sm:gap-4"
          >
            <div className="flex-1 flex items-center justify-center p-3 sm:p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all">
              <RadioGroupItem
                value="Madame"
                id="civilite-madame"
                className="mr-2 sm:mr-3 flex-shrink-0"
              />
              <Label
                htmlFor="civilite-madame"
                className="text-sm sm:text-base font-medium text-foreground cursor-pointer"
              >
                Madame
              </Label>
            </div>

            <div className="flex-1 flex items-center justify-center p-3 sm:p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all">
              <RadioGroupItem
                value="Monsieur"
                id="civilite-monsieur"
                className="mr-2 sm:mr-3 flex-shrink-0"
              />
              <Label
                htmlFor="civilite-monsieur"
                className="text-sm sm:text-base font-medium text-foreground cursor-pointer"
              >
                Monsieur
              </Label>
            </div>
          </RadioGroup>
          {errors.civilite && (
            <p className="mt-2 text-sm text-destructive">
              {errors.civilite.message}
            </p>
          )}
        </div>

        {/* Nom et Prénom */}
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 capitalize">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" {...register("prenom")} required />
              {errors.prenom && (
                <p className="text-sm text-destructive">
                  {errors.prenom.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" {...register("nom")} required />
              {errors.nom && (
                <p className="text-sm text-destructive">{errors.nom.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Date de naissance */}
        <div className="space-y-2">
          <Label htmlFor="dateNaissance">Date de naissance</Label>
          <Input
            id="dateNaissance"
            type="date"
            {...register("dateNaissance")}
            required
            className="w-full"
          />
          {errors.dateNaissance && (
            <p className="text-sm text-destructive">
              {errors.dateNaissance.message}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="">
          <h3 className="text-base sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
            Contact
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telephone">Numéro de téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                {...register("telephone")}
                placeholder="06 12 34 56 78"
                required
              />
              {errors.telephone && (
                <p className="text-sm text-destructive">
                  {errors.telephone.message}
                </p>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Le professionnel vous contactera sur ce numéro pour convenir
              d&apos;un rendez-vous
            </p>

            <div className="space-y-2">
              <Label htmlFor="telephone-confirm">Confirmer le téléphone</Label>
              <Input
                id="telephone-confirm"
                type="tel"
                placeholder="06 12 34 56 78"
                required
              />
            </div>

            {/* Checkbox "Je n'ai pas d'email" */}
            <div className="flex items-center p-3 sm:p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all">
              <Checkbox
                id="pas-email"
                checked={pasEmail}
                onCheckedChange={(checked) => {
                  setPasEmail(checked as boolean);
                  if (checked) {
                    setValue("email", "");
                  }
                }}
              />
              <Label
                htmlFor="pas-email"
                className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-foreground cursor-pointer"
              >
                Je n&apos;ai pas d&apos;email
              </Label>
            </div>

            {!pasEmail && (
              <div className="space-y-2">
                <Label htmlFor="email">Email (facultatif)</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="exemple@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Adresse */}
        <div className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
            Adresse{" "}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Lieu où les soins &quot;à domicile&quot; seront réalisés
          </p>

          <div className="space-y-3 sm:space-y-4">
            <AddressAutocomplete
              label="Adresse"
              value={adresseInput}
              onChange={setAdresseInput}
              onSelect={(address) => {
                setValue("adresse", address.street);
                setValue("codePostal", address.postcode);
                setValue("ville", address.city);
              }}
              error={errors.adresse?.message}
              placeholder="Ex: 75002 15 rue de la Paix ou 15 rue de la Paix"
            />

            <div className="bg-primary/10 rounded-lg border-2 border-primary/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-foreground">
                💡 <strong>Astuce :</strong> Tapez au moins 3 caractères. Vous
                pouvez commencer par votre code postal (ex: 75002 rue de la
                Paix) ou directement par votre numéro et rue (ex: 15 rue de la
                Paix)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complementAdresse">
                Complément d&apos;adresse (facultatif)
              </Label>
              <Input
                id="complementAdresse"
                {...register("complementAdresse")}
                placeholder="Bâtiment, codes, étage..."
              />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Indiquez les informations pour simplifier l&apos;accès au lieu de
              rendez-vous (bâtiment, codes, étage, etc...)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="codePostal">Code postal</Label>
                <Input
                  id="codePostal"
                  {...register("codePostal")}
                  placeholder="75001"
                />
                {errors.codePostal && (
                  <p className="text-sm text-destructive">
                    {errors.codePostal.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input id="ville" {...register("ville")} placeholder="Paris" />
                {errors.ville && (
                  <p className="text-sm text-destructive">
                    {errors.ville.message}
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic">
              Les champs Code postal et Ville sont remplis automatiquement lors
              de la sélection de l&apos;adresse
            </p>
          </div>
        </div>

        {/* Numéro de sécurité sociale */}
        <div className="space-y-2">
          <Label htmlFor="numeroSecu">
            Numéro de sécurité sociale (facultatif)
          </Label>
          <Input
            id="numeroSecu"
            {...register("numeroSecu")}
            placeholder="1 23 45 67 890 123 45"
            className="w-full"
          />
          {errors.numeroSecu && (
            <p className="text-sm text-destructive">
              {errors.numeroSecu.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
