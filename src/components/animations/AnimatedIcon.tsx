"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface AnimatedIconProps {
  type: "star" | "circle" | "smiley";
  size?: number;
  color?: string;
  position?: { top?: string; right?: string; bottom?: string; left?: string };
  triggerRef?: React.RefObject<HTMLElement | null>;
  delay?: number;
  className?: string;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  type,
  size = 40,
  color,
  position = {},
  triggerRef,
  delay = 0,
  className = "",
}) => {
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!iconRef.current) return;

      const icon = iconRef.current;
      let scrollTriggerInstance: ScrollTrigger | null = null;
      let rotationAnimation: gsap.core.Tween | null = null;

      // Configuration initiale
      gsap.set(icon, {
        opacity: 0,
        scale: 0,
        rotation: 0,
      });

      // Créer une timeline pour l'animation d'entrée
      const entryTL = gsap.timeline({ paused: true });

      // Animation d'entrée
      entryTL.to(icon, {
        opacity: 1,
        scale: 1,
        rotation: type === "star" ? 360 : type === "smiley" ? 180 : 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: delay,
        onComplete: () => {
          // Animation continue pour les étoiles après l'entrée
          if (type === "star" && icon) {
            rotationAnimation = gsap.to(icon, {
              rotation: "+=360",
              duration: 3,
              repeat: -1,
              ease: "none",
            });
          }
        },
      });

      // ScrollTrigger pour l'animation d'entrée
      const trigger = triggerRef?.current || icon.closest(".team-headline-wrapper");
      if (trigger) {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: trigger,
          start: "top 80%",
          end: "top 20%",
          animation: entryTL,
          toggleActions: "play none none none",
          markers: false,
        });
      } else {
        // Si pas de trigger, jouer l'animation directement
        entryTL.play();
      }

      return () => {
        if (scrollTriggerInstance) {
          scrollTriggerInstance.kill();
        }
        if (rotationAnimation) {
          rotationAnimation.kill();
        }
        entryTL.kill();
      };
    },
    { scope: iconRef, dependencies: [type, delay, triggerRef] }
  );

  const getIconContent = () => {
    switch (type) {
      case "star":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={color || "#7828c8"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        );
      case "circle":
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color || "#f97316",
            }}
          />
        );
      case "smiley":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill={color || "#fbbf24"}
              stroke="#000"
              strokeWidth="1.5"
            />
            <circle cx="8" cy="9" r="1.5" fill="#000" />
            <circle cx="16" cy="9" r="1.5" fill="#000" />
            <path
              d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={iconRef}
      className={`animated-icon absolute ${className}`}
      style={{
        ...position,
        width: size,
        height: size,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {getIconContent()}
    </div>
  );
};

