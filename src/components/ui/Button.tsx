"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ButtonHTMLAttributes, forwardRef } from "react";

// ============================================
// PRIMARY BUTTON - Main CTA with slide effect
// ============================================
interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children: React.ReactNode;
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, children, href, ...props }, ref) => {
    const buttonContent = (
      <button
        ref={ref}
        className={cn(
          "group relative px-8 py-4 bg-[#1a1a1a] text-white rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        <span className="relative z-10 font-medium tracking-wider text-sm uppercase transition-colors duration-300">
          {children}
        </span>
      </button>
    );

    if (href) {
      return <Link href={href}>{buttonContent}</Link>;
    }

    return buttonContent;
  }
);
PrimaryButton.displayName = "PrimaryButton";

// ============================================
// OUTLINE BUTTON - Secondary with border animation
// ============================================
interface OutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children: React.ReactNode;
}

export const OutlineButton = forwardRef<HTMLButtonElement, OutlineButtonProps>(
  ({ className, children, href, ...props }, ref) => {
    const buttonContent = (
      <button
        ref={ref}
        className={cn(
          "group relative px-8 py-4 border border-[#1a1a1a] text-[#1a1a1a] rounded-full overflow-hidden transition-all duration-300 hover:bg-[#1a1a1a]/5 hover:shadow-md",
          className
        )}
        {...props}
      >
        <span className="relative z-10 font-medium tracking-wider text-sm uppercase transition-colors duration-300">
          {children}
        </span>
      </button>
    );

    if (href) {
      return <Link href={href}>{buttonContent}</Link>;
    }

    return buttonContent;
  }
);
OutlineButton.displayName = "OutlineButton";

// ============================================
// ARROW BUTTON - Minimal with arrow animation
// ============================================
interface ArrowButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ArrowButton = ({ href, children, className, onClick }: ArrowButtonProps) => {
  const content = (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center gap-4 cursor-pointer text-[#1a1a1a] hover:text-teal-900 transition-colors duration-300",
        className
      )}
    >
      <span className="text-sm uppercase tracking-[0.25em] font-medium border-b border-transparent group-hover:border-current pb-1 transition-all duration-300">
        {children}
      </span>
      <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

// ============================================
// ICON BUTTON - Circular with icon
// ============================================
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, label, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group flex items-center gap-4 text-sm uppercase tracking-widest font-medium text-neutral-800 hover:text-teal-800 transition-colors duration-300",
          className
        )}
        {...props}
      >
        <div className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center group-hover:border-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-all duration-300 group-hover:scale-110">
          {icon}
        </div>
        {label && <span className="group-hover:translate-x-2 transition-transform duration-300">{label}</span>}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

// ============================================
// MAGNETIC BUTTON - With magnetic pull effect
// ============================================
interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative px-10 py-5 bg-[#2D5F4F] text-white rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:bg-[#244a3e]",
          className
        )}
        {...props}
      >
        <span className="relative z-10 font-medium tracking-wider text-sm uppercase">
          {children}
        </span>
      </button>
    );
  }
);
MagneticButton.displayName = "MagneticButton";
