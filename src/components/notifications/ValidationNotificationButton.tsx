"use client";

import { sendAppointmentValidationNotifications } from "@/actions/notifications";
import { Button } from "@/components/custom/Button";
import { CheckCircle, Send, XCircle } from "lucide-react";
import { useState } from "react";

interface ValidationNotificationButtonProps {
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  onSuccess?: () => void;
}

export function ValidationNotificationButton({
  patientName,
  patientEmail,
  appointmentDate,
  appointmentTime,
  appointmentType,
  onSuccess,
}: ValidationNotificationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSendNotifications = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await sendAppointmentValidationNotifications(
        patientName,
        patientEmail,
        appointmentDate,
        appointmentTime,
        appointmentType
      );

      setResult({ success: true, message: response.message });
      onSuccess?.();
    } catch (error) {
      setResult({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'envoi des notifications",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleSendNotifications}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Envoyer les notifications
          </>
        )}
      </Button>

      {result && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg ${
            result.success
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span
            className={`text-sm ${
              result.success ? "text-green-700" : "text-red-700"
            }`}
          >
            {result.message}
          </span>
        </div>
      )}
    </div>
  );
}
