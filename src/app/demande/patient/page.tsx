"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageHeader } from "../../../components/demande/PageHeader";
import { AddressAutocomplete } from "../../../components/ui/AddressAutocomplete";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useDemandeStore } from "../../../store/demandeStore";

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
  const { setPatient } = useDemandeStore();
  const [civilite, setCivilite] = useState<"Madame" | "Monsieur" | "">("");
  const [pasEmail, setPasEmail] = useState(false);
  const [adresseInput, setAdresseInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

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
        subtitle="* champs obligatoires"
        currentStep={4}
      />

      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
        <p className="text-sm text-gray-700">
          Saisissez vos coordonnées afin qu&apos;un professionnel de santé
          qualifié et disponible prenne contact avec vous pour convenir
          d&apos;un rendez-vous.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6 bg-white rounded-lg border-2 border-gray-200 p-4 sm:p-6"
      >
        {/* Civilité */}
        <div className="">
          <label className="block text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Civilité
          </label>

          <div className="flex gap-2 sm:gap-4">
            <label className="flex-1 flex items-center justify-center p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all">
              <input
                type="radio"
                value="Madame"
                checked={civilite === "Madame"}
                onChange={(e) =>
                  handleCiviliteChange(e.target.value as "Madame" | "Monsieur")
                }
                className="w-5 h-5 border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer mr-2 sm:mr-3 flex-shrink-0"
              />
              <span className="text-sm sm:text-base font-medium text-gray-900">
                Madame
              </span>
            </label>

            <label className="flex-1 flex items-center justify-center p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all">
              <input
                type="radio"
                value="Monsieur"
                checked={civilite === "Monsieur"}
                onChange={(e) =>
                  handleCiviliteChange(e.target.value as "Madame" | "Monsieur")
                }
                className="w-5 h-5 border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer mr-2 sm:mr-3 flex-shrink-0"
              />
              <span className="text-sm sm:text-base font-medium text-gray-900">
                Monsieur
              </span>
            </label>
          </div>
          {errors.civilite && (
            <p className="mt-2 text-sm text-red-500">
              {errors.civilite.message}
            </p>
          )}
        </div>

        {/* Nom et Prénom */}
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label="Prénom"
              {...register("prenom")}
              error={errors.prenom?.message}
              required
              fullWidth
            />
            <Input
              label="Nom"
              {...register("nom")}
              error={errors.nom?.message}
              required
              fullWidth
            />
          </div>
        </div>

        {/* Date de naissance */}
        <div className="">
          <Input
            label="Date de naissance"
            type="date"
            {...register("dateNaissance")}
            error={errors.dateNaissance?.message}
            required
            fullWidth
          />
        </div>

        {/* Contact */}
        <div className="">
          <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Contact
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <Input
              label="Numéro de téléphone"
              type="tel"
              {...register("telephone")}
              error={errors.telephone?.message}
              placeholder="06 12 34 56 78"
              required
              fullWidth
            />
            <p className="text-xs sm:text-sm text-gray-600">
              Le professionnel vous contactera sur ce numéro pour convenir
              d&apos;un rendez-vous
            </p>

            <Input
              label="Confirmer le téléphone"
              type="tel"
              placeholder="06 12 34 56 78"
              required
              fullWidth
            />

            {/* Checkbox "Je n'ai pas d'email" */}
            <label className="flex items-center p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={pasEmail}
                onChange={(e) => {
                  setPasEmail(e.target.checked);
                  if (e.target.checked) {
                    setValue("email", "");
                  }
                }}
                className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
              />
              <span className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-gray-900">
                Je n&apos;ai pas d&apos;email
              </span>
            </label>

            {!pasEmail && (
              <Input
                label="Email (facultatif)"
                type="email"
                {...register("email")}
                error={errors.email?.message}
                placeholder="exemple@email.com"
                fullWidth
              />
            )}
          </div>
        </div>

        {/* Adresse */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Adresse{" "}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
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
              fullWidth
            />

            <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-700">
                💡 <strong>Astuce :</strong> Tapez au moins 3 caractères. Vous
                pouvez commencer par votre code postal (ex: 75002 rue de la
                Paix) ou directement par votre numéro et rue (ex: 15 rue de la
                Paix)
              </p>
            </div>

            <Input
              label="Complément d'adresse (facultatif)"
              {...register("complementAdresse")}
              placeholder="Bâtiment, codes, étage..."
              fullWidth
            />
            <p className="text-xs sm:text-sm text-gray-600">
              Indiquez les informations pour simplifier l&apos;accès au lieu de
              rendez-vous (bâtiment, codes, étage, etc...)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                label="Code postal"
                {...register("codePostal")}
                error={errors.codePostal?.message}
                placeholder="75001"
                fullWidth
              />
              <Input
                label="Ville"
                {...register("ville")}
                error={errors.ville?.message}
                placeholder="Paris"
                fullWidth
              />
            </div>

            <p className="text-xs text-gray-500 italic">
              Les champs Code postal et Ville sont remplis automatiquement lors
              de la sélection de l&apos;adresse
            </p>
          </div>
        </div>

        {/* Numéro de sécurité sociale */}
        <div className="">
          <Input
            label="Numéro de sécurité sociale (facultatif)"
            {...register("numeroSecu")}
            error={errors.numeroSecu?.message}
            placeholder="1 23 45 67 890 123 45"
            fullWidth
          />
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 sm:pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Retour
          </Button>
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Continuer
          </Button>
        </div>
      </form>
    </div>
  );
}
