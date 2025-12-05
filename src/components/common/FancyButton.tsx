"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

interface FancyButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  variant?:
    | "outline-primary"
    | "outline-secondary"
    | "outline-tertiary"
    | "solid-primary"
    | "solid-success"
    | "solid-tertiary";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

export function FancyButton({
  onClick,
  disabled = false,
  className,
  children,
  variant = "outline-primary",
  size = "md",
  icon,
  iconPosition = "left",
  href,
  target = "_self",
}: FancyButtonProps) {
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    "outline-primary":
      "border-1 border-primary bg-transparent text-primary hover:text-primary-foreground",
    "outline-secondary":
      "border-1 border-secondary bg-transparent text-secondary hover:text-secondary-foreground",
    "outline-tertiary":
      "border-1 border-tertiary bg-transparent text-tertiary hover:text-tertiary-foreground",
    "solid-primary":
      "border-1 border-primary bg-primary text-primary-foreground",
    "solid-success": "border-1 border-success bg-success text-success-foreground",
    "solid-tertiary":
      "border-1 border-tertiary bg-tertiary text-tertiary-foreground",
  };

  // Couleurs de remplissage pour les variantes outline
  const fillClasses = {
    "outline-primary": "bg-primary",
    "outline-secondary": "bg-secondary",
    "outline-tertiary": "bg-tertiary",
    "solid-primary": "bg-secondary",
    "solid-success": "bg-success",
    "solid-tertiary": "bg-tertiary",
  };

  // Overlay sombre pour les boutons solid (effet hover)
  const overlayClasses = {
    "outline-primary": "",
    "outline-secondary": "",
    "outline-tertiary": "",
    "solid-primary": "bg-black/10 dark:bg-tertiary",
    "solid-success": "bg-black/15",
    "solid-tertiary": "bg-black/10 dark:bg-white/10",
  };

  const baseClasses = cn(
    // Base styles - Four Sigmatic inspired
    "relative inline-flex items-center justify-center overflow-hidden group",
    "box-border whitespace-nowrap font-medium font-syne tracking-wide",
    "rounded-[44px]", // Very rounded like Four Sigmatic
    "transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
    // Disabled state
    disabled && "opacity-50 cursor-not-allowed",
    // Sizes (matching Four Sigmatic dimensions)
    sizeClasses[size],
    // Variants
    variantClasses[variant],
    className
  );

  const content = (
    <>
      {/* Fill effect - Du bas vers le haut au hover, sort par le haut */}
      <span
        className={cn(
          "absolute inset-0 pointer-events-none rounded-[44px] overflow-hidden"
        )}
      >
        <span
          className={cn(
            "absolute inset-0 w-full h-full",
            // Scale légèrement plus grand pour éviter les gaps
            "scale-x-[1.02]",
            // État initial : origin-top pour partir du haut quand on quitte le hover
            "origin-top scale-y-0",
            // Au hover : origin-bottom pour entrer par le bas
            "group-hover:origin-bottom group-hover:scale-y-100",
            "transition-transform duration-500 ease-out",
            // Pour les outline : remplissage avec la couleur principale
            variant.startsWith("outline") && fillClasses[variant],
            // Pour les solid : overlay sombre subtil
            variant.startsWith("solid") && overlayClasses[variant]
          )}
        />
      </span>

      {/* Content */}
      <span className="relative flex items-center justify-center gap-2">
        {/* Icon à gauche */}
        {icon && iconPosition === "left" && (
          <span className="flex-shrink-0">{icon}</span>
        )}

        {/* Text */}
        <span>{children}</span>

        {/* Icon à droite */}
        {icon && iconPosition === "right" && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </span>
    </>
  );

  // Si un href est fourni, utiliser Link ou a selon le type de lien
  if (href) {
    // Lien interne (commence par /)
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={baseClasses} target={target}>
          {content}
        </Link>
      );
    }

    // Lien externe
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={baseClasses}
      >
        {content}
      </a>
    );
  }

  // Bouton standard
  return (
    <button onClick={handleClick} disabled={disabled} className={baseClasses}>
      {content}
    </button>
  );
}
