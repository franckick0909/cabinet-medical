"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useEffect } from "react";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function HamburgerButton({ isOpen, onClick, className = "" }: HamburgerButtonProps) {
  const bar1Ref = useRef<SVGPathElement>(null);
  const bar2Ref = useRef<SVGPathElement>(null);
  const bar3Ref = useRef<SVGPathElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Créer la timeline une seule fois
    if (!timelineRef.current && bar1Ref.current && bar2Ref.current && bar3Ref.current) {
      const tl = gsap.timeline({ paused: true });

      tl.to(bar1Ref.current, {
        duration: 0.5,
        attr: { d: "M8,2 L2,8" },
        x: 1,
        ease: "power2.inOut",
      }, 'start');

      tl.to(bar2Ref.current, {
        duration: 0.5,
        autoAlpha: 0,
      }, 'start');

      tl.to(bar3Ref.current, {
        duration: 0.5,
        attr: { d: "M8,8 L2,2" },
        x: 1,
        ease: "power2.inOut",
      }, 'start');

      timelineRef.current = tl;
    }
  }, []);

  useGSAP(() => {
    if (timelineRef.current) {
      if (isOpen) {
        timelineRef.current.play();
      } else {
        timelineRef.current.reverse();
      }
    }
  }, [isOpen]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-[10000] p-2 ${className}`}
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 10 10"
        className="overflow-visible"
      >
        <path
          ref={bar1Ref}
          d="M0,2 L10,2"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
        <path
          ref={bar2Ref}
          d="M0,5 L10,5"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
        <path
          ref={bar3Ref}
          d="M0,8 L10,8"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

