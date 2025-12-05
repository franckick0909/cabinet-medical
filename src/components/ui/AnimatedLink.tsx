"use client";

import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useRef } from "react";

// ============================================
// ANIMATED LINK - With underline animation
// ============================================
interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  underlineColor?: string;
}

export const AnimatedLink = ({ href, children, className, underlineColor = "bg-current" }: AnimatedLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-block text-[#1a1a1a] hover:text-teal-900 transition-colors duration-300",
        className
      )}
    >
      <span className="relative">
        {children}
        <span className={cn(
          "absolute bottom-0 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-500 ease-out",
          underlineColor
        )} />
      </span>
    </Link>
  );
};

// ============================================
// MAGNETIC LINK - With magnetic pull effect
// ============================================
interface MagneticLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const MagneticLink = ({ href, children, className }: MagneticLinkProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const link = linkRef.current;
    const text = textRef.current;
    if (!link || !text) return;

    const xTo = gsap.quickTo(link, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(link, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
    
    const textXTo = gsap.quickTo(text, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const textYTo = gsap.quickTo(text, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = link.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      xTo(x * 0.3);
      yTo(y * 0.3);
      textXTo(x * 0.1);
      textYTo(y * 0.1);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      textXTo(0);
      textYTo(0);
    };

    link.addEventListener("mousemove", handleMouseMove);
    link.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      link.removeEventListener("mousemove", handleMouseMove);
      link.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: linkRef });

  return (
    <Link ref={linkRef} href={href} className={cn("relative inline-block p-4", className)}>
      <span ref={textRef} className="relative z-10 block">{children}</span>
    </Link>
  );
};

// ============================================
// MENU LINK - Enhanced for menu with icon animation
// ============================================
interface MenuLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MenuLink = ({ href, children, onClick, className }: MenuLinkProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-block text-3xl md:text-4xl lg:text-5xl font-cormorant-garamond font-light italic leading-none transition-all duration-500",
        className
      )}
    >
      <span className="relative inline-flex items-center gap-4">
        {/* Animated dot */}
        <span className="w-2 h-2 rounded-full bg-[#C8D96F] opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
        
        {/* Text content with underline - will be transformed by SplitText */}
        <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#C8D96F] after:to-[#A8D5BA] group-hover:after:w-full after:transition-all after:duration-700 after:ease-out">
          {children}
        </span>
      </span>
    </Link>
  );
};

// ============================================
// SECONDARY MENU LINK - For smaller menu items
// ============================================
interface SecondaryMenuLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const SecondaryMenuLink = ({ href, children, onClick, className }: SecondaryMenuLinkProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-block text-sm uppercase tracking-widest border-b border-black pb-1 text-[#1a1a1a] transition-all duration-300",
        className
      )}
    >
      <span className="relative">
        {children}
        
        {/* Sliding background */}
        <span className="absolute inset-0 -z-10 bg-teal-800 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
        
        {/* Text color change */}
        <span className="group-hover:text-white transition-colors duration-300">{children}</span>
      </span>
    </Link>
  );
};

// ============================================
// FOOTER LINK - Large with hover effect
// ============================================
interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const FooterLink = ({ href, children, className }: FooterLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-block text-2xl md:text-3xl font-cormorant-garamond text-neutral-300 hover:text-white transition-colors duration-300",
        className
      )}
    >
      <span className="relative inline-flex items-center gap-4">
        {children}
        
        {/* Arrow that appears on hover */}
        <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          →
        </span>
      </span>
    </Link>
  );
};
