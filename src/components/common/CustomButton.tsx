"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowAnimation } from "./ArrowAnimation";

// Interface pour le bouton moderne
interface CustomButtonProps {
  href?: string;
  text?: string;
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "outline"
    | "destructive"
    | "success"
    | "warning";
  size?: "sm" | "md" | "lg" | "xl";
  arrow?: "left" | "right" | "none";
  arrowSize?: "small" | "medium" | "large";
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

// Composant bouton moderne avec animations Awwwards
export function CustomButton({
  href,
  text,
  variant = "primary",
  size = "md",
  arrow = "none",
  arrowSize = "medium",
  className = "",
  onClick,
  children,
  disabled = false,
  loading = false,
}: CustomButtonProps) {
  // Configuration des variantes
  const variants = {
    primary: {
      base: "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0",
      hover:
        "hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-500/25",
      active: "active:scale-95",
      disabled:
        "disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed",
    },
    secondary: {
      base: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 border-0 dark:from-gray-800 dark:to-gray-700 dark:text-gray-100",
      hover:
        "hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:shadow-lg",
      active: "active:scale-95",
      disabled:
        "disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed dark:disabled:from-gray-600 dark:disabled:to-gray-500",
    },
    ghost: {
      base: "bg-transparent text-gray-700 border-0 dark:text-gray-300",
      hover:
        "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
      active: "active:scale-95",
      disabled:
        "disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:text-gray-600",
    },
    outline: {
      base: "bg-transparent text-foreground border border-foreground",
      hover:
        "hover:bg-foreground hover:text-background hover:border-foreground",
      active: "active:scale-95",
      disabled:
        "disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed dark:disabled:text-gray-600 dark:disabled:border-gray-700",
    },
    destructive: {
      base: "bg-gradient-to-r from-red-500 to-red-600 text-white border-0",
      hover:
        "hover:from-red-600 hover:to-red-700 hover:shadow-2xl hover:shadow-red-500/25",
      active: "active:scale-95",
      disabled:
        "disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed",
    },
    success: {
      base: "bg-gradient-to-r from-green-500 to-green-600 text-white border-0",
      hover:
        "hover:from-green-600 hover:to-green-700 hover:shadow-2xl hover:shadow-green-500/25",
      active: "active:scale-95",
      disabled:
        "disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed",
    },
    warning: {
      base: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0",
      hover:
        "hover:from-yellow-600 hover:to-orange-600 hover:shadow-2xl hover:shadow-yellow-500/25",
      active: "active:scale-95",
      disabled:
        "disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed",
    },
  };

  // Configuration des tailles
  const sizes = {
    sm: {
      container: "px-3 py-1.5 text-sm",
      icon: "w-4 h-4",
      spacing: "gap-1.5",
    },
    md: {
      container: "px-4 py-2 text-base",
      icon: "w-5 h-5",
      spacing: "gap-2",
    },
    lg: {
      container: "px-6 py-3 text-lg",
      icon: "w-6 h-6",
      spacing: "gap-2.5",
    },
    xl: {
      container: "px-8 py-4 text-xl",
      icon: "w-7 h-7",
      spacing: "gap-3",
    },
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  // Classes CSS finales
  const buttonClasses = `
    group relative inline-flex items-center justify-center font-medium rounded-xs cursor-pointer
    transition-all duration-300 ease-out overflow-hidden
    ${currentVariant.base}
    ${currentVariant.hover}
    ${currentVariant.active}
    ${currentVariant.disabled}
    ${currentSize.container}
    ${currentSize.spacing}
    ${className}
  `.trim();

  // Animation de shimmer
  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: {
      x: "100%",
      transition: {
        duration: 1.5,
        ease: "linear" as const,
        repeat: Infinity,
        repeatDelay: 2,
      },
    },
  };

  // Animation de pulse pour le loading
  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  // Contenu du bouton
  const buttonContent = (
    <>
      {/* Effet shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
      />

      {/* Effet de brillance au hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Contenu principal */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Flèche gauche */}
        {arrow === "left" && (
          <ArrowAnimation
            direction="left"
            size={arrowSize}
            color="currentColor"
            className="mr-2"
          />
        )}

        {/* Texte ou children */}
        {(text || children) && (
          <span className="relative">
            {loading ? (
              <motion.div
                className="flex items-center gap-2"
                variants={pulseVariants}
                animate="animate"
              >
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </motion.div>
            ) : (
              text || children
            )}
          </span>
        )}

        {/* Flèche droite */}
        {arrow === "right" && (
          <ArrowAnimation
            direction="right"
            size={arrowSize}
            color="currentColor"
            className="ml-2"
          />
        )}
      </div>

      {/* Effet de ripple au clic */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-lg"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );

  // Rendu du bouton
  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        className={buttonClasses}
        disabled={disabled || loading}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {buttonContent}
      </motion.button>
    );
  }

  if (href) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Link href={href} className={buttonClasses}>
          {buttonContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      disabled
      className={`${buttonClasses} cursor-not-allowed`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {buttonContent}
    </motion.button>
  );
}
