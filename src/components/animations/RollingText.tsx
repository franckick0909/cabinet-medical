"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import React, { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type HeadingTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div";

interface RollingTextProps {
  children: React.ReactNode;
  as?: HeadingTag;
  repeatCount?: number;
  duration?: number;
  ease?: string;
  className?: string;
  fontSize?: string;
  letterSpacing?: string;
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
  color?: string;
  finalColor?: string;
  lineHeight?: number;
  triggerRef?: React.RefObject<HTMLElement>;
  start?: string;
  end?: string;
}

export const RollingText: React.FC<RollingTextProps> = ({
  children,
  as = "h1",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  repeatCount = 8,
  duration = 4,
  ease = "power4.inOut",
  className = "",
  fontSize = "text-[clamp(2rem,9vw,12rem)]",
  letterSpacing = "-0.03em",
  textTransform = "uppercase",
  color = "text-foreground",
  finalColor,
  lineHeight = 1,
  triggerRef,
  start = "top 80%",
  end = "top 20%",
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      // Désactiver les avertissements d'essai
      gsap.config({ nullTargetWarn: false });

      // Créer une timeline principale
      const masterTL = gsap.timeline({ paused: true });
      const rollingTL = gsap.timeline({ paused: true });
      let splitInstance: SplitText | null = null;

      try {
        // Diviser le texte en caractères (y compris les espaces)
        const split = new SplitText(textRef.current, {
          type: "chars",
          charsClass: "rolling-char",
          reduceWhiteSpace: false, // Préserver les espaces
        });

        splitInstance = split;

        if (!split.chars || split.chars.length === 0) return;

        // Compteur pour ignorer les espaces dans l'alternance
        let charIndex = 0;

        // Traiter chaque caractère
        split.chars.forEach((char) => {
          const txt = char.textContent || "";
          const isSpace =
            txt.trim() === "" ||
            txt === " " ||
            txt === "\u00A0" ||
            txt === "\n";

          // Pour les espaces, on les laisse visibles mais on ne leur applique pas l'animation
          if (isSpace) {
            // Configurer l'espace pour qu'il soit visible et permette les retours à la ligne
            gsap.set(char, {
              display: "inline",
              position: "relative",
              overflow: "visible",
              whiteSpace: "pre-wrap",
              width: txt === " " ? "0.25em" : "auto",
            });
            // Restaurer le contenu de l'espace
            char.textContent = txt;
            return;
          }

          // Créer les éléments original et clone
          const original = document.createElement("div");
          original.className = "rolling-original";
          original.textContent = txt;

          const clone = document.createElement("div");
          clone.className = "rolling-clone";
          clone.textContent = txt;

          // Remplacer le contenu du caractère
          char.innerHTML = "";
          char.appendChild(original);
          char.appendChild(clone);

          // Configurer le conteneur du caractère
          gsap.set(char, {
            display: "inline-block",
            position: "relative",
            overflow: "hidden",
          });

          // Configuration initiale du clone
          gsap.set(clone, {
            yPercent: 100,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          });

          // Animation de roulement pour chaque caractère
          rollingTL.to(
            [original, clone],
            {
              yPercent: charIndex % 2 === 0 ? -100 : 0, // Alternance
              duration: duration,
              ease: ease,
              repeat: -1,
              modifiers: {
                yPercent: gsap.utils.wrap(-100, 100),
              },
            },
            0
          ); // Toutes les animations commencent au même moment

          charIndex++;
        });

        // Ajouter la timeline de roulement à la timeline principale
        masterTL.add(rollingTL);

        // Créer le ScrollTrigger
        scrollTriggerRef.current = ScrollTrigger.create({
          trigger: triggerRef?.current || containerRef.current,
          start: start,
          end: end,
          scrub: true,
          onUpdate: (self) => {
            masterTL.progress(self.progress);
          },
        });

        // Animation de la couleur finale si spécifiée
        if (finalColor) {
          gsap.to(textRef.current, {
            color: finalColor,
            scrollTrigger: {
              trigger: triggerRef?.current || containerRef.current,
              start: "bottom 100%", // Commence quand le trigger est en bas de l'écran
              end: "bottom 0%", // Finit quand le trigger quitte l'écran
              scrub: true,
            },
          });
        }
      } catch (error) {
        console.error("Error initializing SplitText or GSAP:", error);
        // Fallback: s'assurer que le texte est visible même sans animation
        if (textRef.current) {
          gsap.set(textRef.current, { opacity: 1, y: 0 });
        }
      }

      return () => {
        splitInstance?.revert();
        masterTL.kill();
        rollingTL.kill();
        scrollTriggerRef.current?.kill();
      };
    },
    { scope: containerRef, dependencies: [children, duration, ease, finalColor, start, end] }
  );

  const Tag = as;

  return (
    <div
      ref={containerRef}
      className={`rolling-text-wrapper ${className}`}
      style={{
        fontSize: fontSize,
        letterSpacing: letterSpacing,
        textTransform: textTransform,
        lineHeight: lineHeight,
        color: color,
      }}
    >
      <Tag ref={textRef} className="rolling-text">
        {children}
      </Tag>
    </div>
  );
};
