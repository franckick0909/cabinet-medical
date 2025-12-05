"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PremiumButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
}

export default function PremiumButton({
  children,
  href,
  onClick,
  className,
  variant = "primary",
}: PremiumButtonProps) {
  
  const baseStyles = "relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-4 font-medium tracking-wide uppercase text-sm group cursor-pointer transition-all duration-300";
  
  const variants = {
    primary: "bg-[#1a1a1a] text-white border border-[#1a1a1a]",
    outline: "bg-transparent text-[#1a1a1a] border border-[#1a1a1a]",
    ghost: "bg-transparent text-[#1a1a1a] hover:bg-neutral-100",
  };

  const content = (
    <>
      {/* Background Flip Layer */}
      <div className="absolute inset-0 bg-teal-700 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
      
      {/* Text Flip Layer */}
      <div className="relative z-10 overflow-hidden h-5 flex flex-col items-center justify-start">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full group-hover:delay-75">
            {children}
        </span>
        <span className="block absolute top-0 left-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
            {children}
        </span>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(baseStyles, variants[variant], className)}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(baseStyles, variants[variant], className)}
    >
      {content}
    </button>
  );
}
