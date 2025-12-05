"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

export type AnimationType =
  | "clipLeft"
  | "clipRight"
  | "clipTop"
  | "clipBottom"
  | "scale";

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  duration?: number;
  triggerStart?: string;
  animationType?: AnimationType;
  autoPlay?: boolean;
  sizes?: string;
}

export default function RevealImage({
  src,
  alt,
  className = "",
  delay = 0,
  duration = 1,
  triggerStart = "top 75%",
  animationType = "scale",
  autoPlay = false,
  sizes = "100vw",
}: RevealImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!imageRef.current) return;

      const element = imageRef.current;

      const getAnimationConfig = () => {
        switch (animationType) {
          case "clipLeft":
            return {
              from: { clipPath: "inset(0% 100% 0% 0%)" },
              to: { clipPath: "inset(0% 0% 0% 0%)" },
            };
          case "clipRight":
            return {
              from: { clipPath: "inset(0% 0% 0% 100%)" },
              to: { clipPath: "inset(0% 0% 0% 0%)" },
            };
          case "clipTop":
            return {
              from: { clipPath: "inset(100% 0% 0% 0%)" },
              to: { clipPath: "inset(0% 0% 0% 0%)" },
            };
          case "clipBottom":
            return {
              from: { clipPath: "inset(0% 0% 100% 0%)" },
              to: { clipPath: "inset(0% 0% 0% 0%)" },
            };
          case "scale":
          default:
            return {
              from: { scale: 0.8, opacity: 0 },
              to: { scale: 1, opacity: 1 },
            };
        }
      };

      const { from, to } = getAnimationConfig();

      if (autoPlay) {
        // Animation automatique au chargement
        gsap.set(element, from);
        gsap.to(element, {
          ...to,
          duration: duration,
          ease: "power2.out",
          delay: delay,
        });
      } else {
        // Animation au scroll
        gsap.fromTo(element, from, {
          ...to,
          duration: duration,
          ease: "power2.out",
          delay: delay,
          scrollTrigger: {
            trigger: element,
            start: triggerStart,
            toggleActions: "play none none reverse",
          },
        });
      }
    },
    { scope: imageRef }
  );

  return (
    <div
      ref={imageRef}
      className={`relative overflow-hidden w-full h-full ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover w-full h-full"
        priority
      />
    </div>
  );
}
