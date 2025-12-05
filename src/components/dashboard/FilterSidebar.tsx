"use client";

import { GroupCheckbox } from "@/components/custom/GroupCheckbox";

interface FilterSidebarProps {
  onFilterChange: (filters: { urgence: string[]; statut: string[] }) => void;
}

const urgenceOptions = [
  { value: "URGENTE", label: "🔴 Urgente" },
  { value: "ELEVEE", label: "🟠 Élevée" },
  { value: "NORMALE", label: "🔵 Normale" },
  { value: "FAIBLE", label: "🟢 Faible" },
];

const statutOptions = [
  { value: "EN_ATTENTE", label: "⏳ En attente" },
  { value: "CONFIRMEE", label: "✅ Confirmée" },
  { value: "EN_COURS", label: "🔄 En cours" },
  { value: "TERMINEE", label: "✔️ Terminée" },
  { value: "ANNULEE", label: "❌ Annulée" },
];

export function FilterSidebar({}: FilterSidebarProps) {
  const handleUrgenceChange = (value: string, checked: boolean) => {
    // TODO: Implémenter la logique de filtrage
    console.log("Urgence filter:", value, checked);
  };

  const handleStatutChange = (value: string, checked: boolean) => {
    // TODO: Implémenter la logique de filtrage
    console.log("Statut filter:", value, checked);
  };

  return (
    <div className="material-card bg-surface text-on-surface elevation-1 rounded-xl p-6 space-y-6">
      <div>
        <h3 className="title-large text-on-surface mb-4">🔍 Filtres</h3>
      </div>

      {/* Filtre par Urgence */}
      <div>
        <h4 className="label-large text-on-surface-variant mb-3">
          Niveau d&apos;urgence
        </h4>
        <div className="space-y-3">
          {urgenceOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-3 py-1"
            >
              <GroupCheckbox
                onCheckedChange={(checked) =>
                  handleUrgenceChange(option.value, !!checked)
                }
              />
              <label className="body-medium text-on-surface cursor-pointer transition-colors duration-material-short2 hover:text-primary">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Filtre par Statut */}
      <div>
        <h4 className="label-large text-on-surface-variant mb-3">Statut</h4>
        <div className="space-y-3">
          {statutOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-3 py-1"
            >
              <GroupCheckbox
                onCheckedChange={(checked) =>
                  handleStatutChange(option.value, !!checked)
                }
              />
              <label className="body-medium text-on-surface cursor-pointer transition-colors duration-material-short2 hover:text-primary">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="pt-6 border-t border-outline-variant">
        <h4 className="label-large text-on-surface-variant mb-3">
          📊 Statistiques
        </h4>
        <div className="body-small text-on-surface-variant space-y-1">
          <p>Cette fonctionnalité sera disponible prochainement.</p>
        </div>
      </div>
    </div>
  );
}
