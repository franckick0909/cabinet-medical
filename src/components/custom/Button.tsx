import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import * as React from "react";
import { useState } from "react";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "variant"> {
  variant?:
    | "filled"
    | "outlined"
    | "text"
    | "elevated"
    | "tonal"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "ghost"
    | "link"
    | "sidebar"
    | "sidebarActive"
    | "menu"
    | "adaptive"
    | "social";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "filled",
      size = "md",
      elevation = 0,
      asChild,
      ...props
    },
    ref
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = asChild;
    const [isHovered, setIsHovered] = useState(false);

    // Classes de base
    const baseClasses =
      "group relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2D5F4F] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden rounded-full";

    // Classes par variant
    const variantClasses = {
      filled:
        "bg-[#C8D96F] text-[#1a1a1a] hover:shadow-xl border-none", // Hero Style Base
      outlined:
        "bg-transparent border border-[#1a1a1a]/10 text-[#1a1a1a] hover:border-[#2D5F4F]", // Header Style Base
      text: "bg-transparent text-[#2D5F4F] hover:bg-[#2D5F4F]/5",
      elevated:
        "bg-white text-[#1a1a1a] shadow-md hover:shadow-lg",
      tonal:
        "bg-[#F9F7F2] text-[#1a1a1a] hover:bg-[#EFEADD]",
      destructive:
        "bg-red-500 text-white hover:bg-red-600",
      success:
        "bg-green-500 text-white hover:bg-green-600",
      warning:
        "bg-yellow-500 text-white hover:bg-yellow-600",
      info: "bg-blue-500 text-white hover:bg-blue-600",
      ghost:
        "bg-transparent hover:bg-[#2D5F4F]/5 text-[#2D5F4F]",
      link: "bg-transparent text-[#2D5F4F] hover:underline underline-offset-4",
      sidebar:
        "bg-transparent text-white/70 hover:text-white hover:bg-white/10 border-none",
      sidebarActive:
        "bg-white text-[#2D5F4F] shadow-md border-none",
      menu: "bg-[#2D5F4F] text-white hover:bg-[#244a3e] border-none",
      adaptive:
        "bg-white text-black mix-blend-difference border-0",
      social:
        "bg-transparent text-foreground border border-foreground/30 hover:bg-accent hover:text-accent-foreground",
    };

    // Classes par taille
    const sizeClasses = {
      sm: "h-9 px-4 text-sm gap-2",
      md: "h-11 px-6 text-base gap-2.5",
      lg: "h-12 px-8 text-lg gap-3",
      xl: "h-14 px-10 text-xl gap-3.5",
      icon: "h-11 w-11",
    };

    // Classes d'élévation (pour variants non-animés ou supplémentaires)
    const elevationClasses = {
      0: "shadow-none",
      1: "shadow-sm",
      2: "shadow-md",
      3: "shadow-lg",
      4: "shadow-xl",
      5: "shadow-2xl",
    };

    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      elevation > 0 ? elevationClasses[elevation] : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <motion.button
        className={combinedClasses}
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {/* Overlay Animations */}
        {variant === "filled" && (
          <div className="absolute inset-0 bg-[#2D5F4F] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
        )}
        {variant === "outlined" && (
          <div className="absolute inset-0 bg-[#2D5F4F] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
        )}

        {/* Content */}
        <span className={`relative z-10 flex items-center justify-center gap-inherit transition-colors duration-300 ${
          variant === "filled" ? "group-hover:text-white" : ""
        } ${
          variant === "outlined" ? "group-hover:text-[#F9F7F2]" : ""
        }`}>
          {props.children as React.ReactNode}
        </span>
      </motion.button>
    );
  }
);
Button.displayName = "Button";

// Export pour compatibilité
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const buttonVariants = (props?: any) => {
  return "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2D5F4F] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed rounded-full";
};

export { Button };

