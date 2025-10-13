"use client";

import { Checkbox } from "@/components/ui/checkbox";

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
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">🔍 Filtres</h3>
      </div>

      {/* Filtre par Urgence */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Niveau d&apos;urgence
        </h4>
        <div className="space-y-2">
          {urgenceOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                onCheckedChange={(checked) =>
                  handleUrgenceChange(option.value, !!checked)
                }
              />
              <label className="text-sm">{option.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Filtre par Statut */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Statut</h4>
        <div className="space-y-2">
          {statutOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                onCheckedChange={(checked) =>
                  handleStatutChange(option.value, !!checked)
                }
              />
              <label className="text-sm">{option.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          📊 Statistiques
        </h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>Cette fonctionnalité sera disponible prochainement.</p>
        </div>
      </div>
    </div>
  );
}
