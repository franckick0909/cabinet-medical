"use client";

import { useDemandeStore } from "@/store/demandeStore";
import { Check } from "lucide-react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

interface PageHeaderProps {
  step: string;
  title: string;
  subtitle?: string;
  currentStep?: number; // Optionnel, pour compatibilité
  showProgressSteps?: boolean; // Nouveau prop pour afficher les étapes individuelles
}

export function PageHeader({
  step,
  title,
  subtitle,
  showProgressSteps = false,
}: PageHeaderProps) {
  const { soin, ordonnance, disponibilite, patient } = useDemandeStore();

  // Calculer le nombre d'étapes complétées
  const completedSteps = [
    !!soin,
    ordonnance !== null,
    !!disponibilite,
    !!patient,
  ].filter(Boolean).length;

  const totalSteps = 4;
  const stepNames = ["Soins", "Ordonnance", "Disponibilités", "Patient"];

  return (
    <div className="mb-8">
      {/* Texte "Étape X sur Y" */}
      <p className="text-sm text-muted-foreground mb-3">{step}</p>

      {/* Progress bar avec ou sans étapes individuelles */}
      {showProgressSteps ? (
        /* Version avec étapes individuelles (pour récapitulatif) */
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 min-w-max mx-auto px-2">
            {stepNames.map((stepName, index) => {
              const isCompleted = index < completedSteps;
              return (
                <div key={stepName} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isCompleted ? "default" : "outline"}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center p-0 text-sm sm:text-base transition-all duration-300 ${
                        isCompleted ? "bg-primary hover:bg-primary" : "border-2"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        index + 1
                      )}
                    </Badge>
                    <span
                      className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
                        isCompleted
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {stepName}
                    </span>
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 rounded-full transition-all duration-300 ${
                        isCompleted ? "bg-primary" : "bg-muted"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Version simple avec barre de progression shadcn/ui */
        <div className="mb-6 space-y-2">
          <Progress
            value={(completedSteps / totalSteps) * 100}
            className="h-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {completedSteps} étape{completedSteps > 1 ? "s" : ""} complétée
              {completedSteps > 1 ? "s" : ""}
            </span>
            <span>{totalSteps} étapes au total</span>
          </div>
        </div>
      )}

      {/* Titre et sous-titre */}
      <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
