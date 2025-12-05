"use client";

import { Button } from "@/components/custom/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface FormNavigationProps {
  onContinue?: () => void;
  continueDisabled?: boolean;
  continueText?: string;
  showBack?: boolean;
  showFieldsRequired?: boolean;
}

export function FormNavigation({
  onContinue,
  continueDisabled = false,
  continueText = "Continuer",
  showBack = true,
  showFieldsRequired = true,
}: FormNavigationProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      {/* Champs obligatoires */}
      <div className="flex-shrink-0">
        {showFieldsRequired && (
          <p className="text-sm text-muted-foreground">
            <span className="text-destructive">*</span> Champs obligatoires
          </p>
        )}
      </div>

      {/* Boutons de navigation */}
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        {showBack && (
          <Button
            type="button"
            variant="outlined"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        )}
        {onContinue && (
          <Button
            type="button"
            onClick={onContinue}
            disabled={continueDisabled}
            className="w-full sm:w-auto"
          >
            {continueText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
