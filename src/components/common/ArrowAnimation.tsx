"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

// Interface pour l'animation de flèche
interface ArrowAnimationProps {
  direction?: "left" | "right";
  className?: string;
  size?: "small" | "medium" | "large";
  color?: string;
}

// Composant animation de flèche simple
export function ArrowAnimation({
  direction = "right",
  className = "",
  size = "medium",
  color = "currentColor",
}: ArrowAnimationProps) {
  const isLeft = direction === "left";

  // Définir les tailles selon la prop size
  const sizeClasses = {
    small: {
      icon: "w-4 h-4",
    },
    medium: {
      icon: "w-6 h-6",
    },
    large: {
      icon: "w-8 h-8",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`group relative inline-flex items-center justify-center overflow-hidden w-6 h-6 ${className}`}
    >
      {/* Flèche principale - sort vers la direction */}
      {isLeft ? (
        <ArrowLeft
          className={`${currentSize.icon} absolute transform transition-all duration-400 ease-out group-hover:-translate-x-5 group-hover:opacity-0`}
          color={color}
        />
      ) : (
        <ArrowRight
          className={`${currentSize.icon} absolute transform transition-all duration-400 ease-out group-hover:translate-x-5 group-hover:opacity-0`}
          color={color}
        />
      )}

      {/* Flèche qui arrive de l'autre côté */}
      {isLeft ? (
        <ArrowLeft
          className={`${currentSize.icon} absolute transform opacity-0 transition-all duration-300 ease-out translate-x-full group-hover:translate-x-0 group-hover:opacity-100`}
          color={color}
        />
      ) : (
        <ArrowRight
          className={`${currentSize.icon} absolute transform opacity-0 transition-all duration-300 ease-out -translate-x-full group-hover:translate-x-0 group-hover:opacity-100`}
          color={color}
        />
      )}
    </div>
  );
}
