"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "../../../components/demande/PageHeader";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useDemandeStore } from "../../../store/demandeStore";

export default function DisponibilitesPage() {
  const router = useRouter();
  const { setDisponibilite } = useDemandeStore();
  const [lieuSoins, setLieuSoins] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [duree, setDuree] = useState("");
  const [dureePersonnalisee, setDureePersonnalisee] = useState("");
  const [lieu, setLieu] = useState("");
  const [touteLaJournee, setTouteLaJournee] = useState(false);
  const [creneaux, setCreneaux] = useState<
    Array<{ debut: string; fin: string }>
  >([{ debut: "7", fin: "21" }]);

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
    if (lieuSoins === "Autre" && !lieu) return;

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
      lieu: lieu || lieuSoins,
    });

    router.push("/demande/patient");
  };

  return (
    <div className="w-full">
      <PageHeader
        step="Étape 3 sur 4"
        title="Où et quand souhaitez-vous faire vos soins ?"
        subtitle="* champs obligatoires"
        currentStep={3}
      />

      <div className="space-y-4 sm:space-y-6">
        {/* Lieu des soins */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 sm:p-6">
          <label className="block text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">
            Lieu des soins *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {[
              { value: "À domicile", label: "À domicile" },
              { value: "En cabinet", label: "En cabinet" },
              { value: "En EHPAD", label: "En EHPAD" },
              { value: "Autre", label: "Autre lieu" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-start p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all"
              >
                <input
                  type="radio"
                  name="lieuSoins"
                  value={option.value}
                  checked={lieuSoins === option.value}
                  onChange={(e) => setLieuSoins(e.target.value)}
                  className="w-5 h-5 mt-0.5 border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                />
                <span className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-gray-900 leading-tight">
                  {option.label}
                </span>
              </label>
            ))}
          </div>

          {lieuSoins === "Autre" && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Précisez le lieu :
              </label>
              <Input
                type="text"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
                placeholder="Entrez l'adresse complète..."
                fullWidth
              />
            </div>
          )}
        </div>

        {/* Date de début */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 sm:p-6">
          <Input
            label="Date de début des soins"
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
            fullWidth
          />
        </div>

        {/* Durée des soins */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 sm:p-6">
          <label className="block text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">
            Durée des soins (en jours) *
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {[
              { value: "1", label: "1 jour" },
              { value: "7", label: "7 jours" },
              { value: "10", label: "10 jours" },
              { value: "15", label: "15 jours" },
              { value: "30", label: "30 jours" },
              { value: "60", label: "Longue durée (60 jours ou +)" },
              { value: "autre", label: "Autre durée" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-start p-2 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all"
              >
                <input
                  type="radio"
                  name="duree"
                  value={option.value}
                  checked={duree === option.value}
                  onChange={(e) => setDuree(e.target.value)}
                  className="w-5 h-5 mt-0.5 border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                />
                <span className="ml-2 sm:ml-3 text-xs sm:text-base font-medium text-gray-900 leading-tight">
                  {option.label}
                </span>
              </label>
            ))}
          </div>

          {/* Champ conditionnel pour durée personnalisée */}
          {duree === "autre" && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Précisez la durée en jours :
              </label>
              <Input
                type="number"
                min="1"
                value={dureePersonnalisee}
                onChange={(e) => setDureePersonnalisee(e.target.value)}
                placeholder="Ex: 45"
                fullWidth
              />
            </div>
          )}
        </div>

        {/* Disponibilités horaires */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 sm:p-6">
          <label className="block text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">
            Disponibilités horaires *
          </label>

          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            L&apos;heure de passage précise sera à définir avec le professionnel
            de santé
          </p>

          {/* Checkbox "Toute la journée" */}
          <label className="flex items-center p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all mb-3 sm:mb-4">
            <input
              type="checkbox"
              checked={touteLaJournee}
              onChange={(e) => setTouteLaJournee(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-gray-900">
              Disponible toute la journée
            </span>
          </label>

          {!touteLaJournee && (
            <>
              <p className="text-xs sm:text-sm font-medium text-gray-900 mb-3">
                Sélectionnez un créneau d&apos;au moins 2 heures.
              </p>

              {/* Liste des créneaux */}
              <div className="space-y-3 sm:space-y-4">
                {creneaux.map((creneau, index) => (
                  <div key={index} className="flex items-end gap-2 sm:gap-4">
                    <div className="flex-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        De
                      </label>
                      <select
                        value={creneau.debut}
                        onChange={(e) => {
                          const newCreneaux = [...creneaux];
                          newCreneaux[index].debut = e.target.value;
                          setCreneaux(newCreneaux);
                        }}
                        className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white text-gray-900"
                        aria-label="Heure de début"
                      >
                        {Array.from({ length: 15 }, (_, i) => i + 7).map(
                          (h) => (
                            <option key={h} value={h}>
                              {h}h
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        À
                      </label>
                      <select
                        value={creneau.fin}
                        onChange={(e) => {
                          const newCreneaux = [...creneaux];
                          newCreneaux[index].fin = e.target.value;
                          setCreneaux(newCreneaux);
                        }}
                        className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white text-gray-900"
                        aria-label="Heure de fin"
                      >
                        {Array.from({ length: 15 }, (_, i) => i + 7).map(
                          (h) => (
                            <option key={h} value={h}>
                              {h}h
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {creneaux.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newCreneaux = creneaux.filter(
                            (_, i) => i !== index
                          );
                          setCreneaux(newCreneaux);
                        }}
                        className="px-2 sm:px-4 py-2 sm:py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all font-medium border-2 border-transparent hover:border-red-200 flex-shrink-0"
                        aria-label="Supprimer ce créneau"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setCreneaux([...creneaux, { debut: "7", fin: "21" }]);
                  }}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                  + Ajouter un créneau
                </button>
              </div>
            </>
          )}
        </div>

        {/* Note informative si domicile */}
        {lieuSoins === "À domicile" && (
          <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-800">
              ℹ️ <strong>À l&apos;étape suivante</strong>, nous vous demanderons
              l&apos;adresse complète où les soins seront réalisés.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="w-full sm:w-auto"
        >
          Retour
        </Button>
        <Button
          onClick={handleContinue}
          disabled={
            !lieuSoins ||
            !dateDebut ||
            !duree ||
            (duree === "autre" && !dureePersonnalisee) ||
            (lieuSoins === "Autre" && !lieu)
          }
          size="lg"
          className="w-full sm:w-auto"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}
