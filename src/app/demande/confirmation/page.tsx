"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const demandeId = searchParams.get("id");

  return (
    <div className="max-w-3xl mx-auto px-4">
      <Card className="p-6 sm:p-8 md:p-12 text-center">
        {/* Icône de succès */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Message de confirmation */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Demande envoyée avec succès ! 🎉
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground mb-6">
          Votre demande de soins a bien été enregistrée.
        </p>

        {demandeId && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">
              Numéro de demande
            </p>
            <p className="text-xl font-mono font-semibold text-primary">
              {demandeId}
            </p>
          </div>
        )}

        <div className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-muted-foreground">
            Notre équipe va examiner votre demande et vous contactera très
            prochainement pour confirmer votre rendez-vous.
          </p>

          <p className="text-sm sm:text-base text-muted-foreground">
            Vous recevrez un email de confirmation à l&apos;adresse que vous
            avez indiquée.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 sm:mt-8 space-y-3">
          <Button
            className="w-full"
            onClick={() => router.push("/demande/soins")}
          >
            Faire une nouvelle demande
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Retour à l&apos;accueil
          </Button>
        </div>

        {/* Contact */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Des questions ? Contactez-nous au{" "}
            <a href="tel:0123456789" className="text-primary hover:underline">
              01 23 45 67 89
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4">
          <Card className="p-6 sm:p-8 md:p-12 text-center">
            <div className="animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </Card>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
