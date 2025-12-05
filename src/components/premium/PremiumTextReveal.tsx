"use client";

import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface PremiumTextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  width?: "fit-content" | "100%";
}

export default function PremiumTextReveal({
  children,
  className,
  delay = 0,
  width = "fit-content",
}: PremiumTextRevealProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const text = textRef.current;
    if (!text) return;

    // Split text into words manually to avoid external library dependency for now
    // In a real production env with SplitType, we would use that.
    // Here we just animate the container or use a simple clip-path reveal.
    
    gsap.fromTo(
      text,
      {
        y: 100,
        opacity: 0,
        rotateX: -20,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        delay: delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: text,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [delay]);

  return (
    <div style={{ width }} className="overflow-hidden">
      <span
        ref={textRef}
        className={cn("inline-block transform-style-3d", className)}
      >
        {children}
      </span>
    </div>
  );
}
