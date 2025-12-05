"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: "basic" | "full-screen" | "side-sheet";
  size?: "sm" | "md" | "lg" | "xl";
}

export function SimpleModal({
  isOpen,
  onClose,
  title,
  children,
  variant = "basic",
  size = "md",
}: SimpleModalProps) {
  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Classes par variant
  const variantClasses = {
    basic: "items-center justify-center p-4",
    "full-screen": "items-stretch justify-stretch p-0",
    "side-sheet": "items-stretch justify-end pr-0",
  };

  // Classes par taille
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  // Classes du modal selon le variant
  const modalClasses = {
    basic: `relative w-full ${sizeClasses[size]} max-h-[90vh] bg-white text-on-surface elevation-5 rounded-xl flex flex-col overflow-hidden animate-material-fade-in`,
    "full-screen":
      "relative w-full h-full bg-white text-on-surface flex flex-col overflow-hidden animate-material-slide-in-from-bottom",
    "side-sheet":
      "relative w-full max-w-md h-full bg-white text-on-surface flex flex-col overflow-hidden animate-material-slide-in-from-right",
  };

  return (
    <div className={`fixed inset-0 z-50 flex ${variantClasses[variant]}`}>
      {/* Overlay Material Design 3 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-material-short4 ease-material-standard"
        onClick={onClose}
      />

      {/* Modal Material Design 3 */}
      <div className={modalClasses[variant]}>
        {/* Bouton fermer custom */}
        <div className="absolute right-2 top-2 sm:right-4 sm:top-4 z-[60]">
          <button
            onClick={onClose}
            className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/50 hover:bg-[#C8D96F]/30 hover:text-[#2D5F4F] transition-all duration-400 ease-in-out hover:rotate-180 text-foreground"
            type="button"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
            <span className="sr-only">Fermer</span>
          </button>
        </div>

        {/* Header Material Design 3 */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-outline-variant flex-shrink-0">
            <h2 className="headline-small text-on-surface font-medium">
              {title}
            </h2>
          </div>
        )}

        {/* Content Material Design 3 */}
        <div className="flex-1 overflow-y-auto p-6 body-medium text-on-surface">
          {children}
        </div>
      </div>
    </div>
  );
}
