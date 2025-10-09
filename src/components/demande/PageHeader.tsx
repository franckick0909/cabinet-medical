"use client";

import { useDemandeStore } from "../../store/demandeStore";

interface PageHeaderProps {
  step: string;
  title: string;
  subtitle?: string;
  currentStep?: number; // Optionnel, pour compatibilité
}

export function PageHeader({ step, title, subtitle }: PageHeaderProps) {
  const { soin, ordonnance, disponibilite, patient } = useDemandeStore();

  // Calculer le nombre d'étapes complétées
  const completedSteps = [
    !!soin,
    ordonnance !== null,
    !!disponibilite,
    !!patient,
  ].filter(Boolean).length;

  const totalSteps = 4;

  return (
    <div className="mb-8">
      {/* Texte "Étape X sur Y" */}
      <p className="text-sm text-gray-500 mb-3">{step}</p>

      {/* Barre de progression simple */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Titre et sous-titre */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      {subtitle && <p className="text-base text-red-500">{subtitle}</p>}
    </div>
  );
}
