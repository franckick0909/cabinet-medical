"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

interface FlipLinkProps {
  children: string;
  href: string;
  className?: string;
}

const DURATION = 0.25;
const STAGGER = 0.015;

export const FlipLink: React.FC<FlipLinkProps> = ({
  children,
  href,
  className = "",
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!linkRef.current || !topRowRef.current || !bottomRowRef.current) return;

    const topLetters = topRowRef.current.querySelectorAll(".letter");
    const bottomLetters = bottomRowRef.current.querySelectorAll(".letter");

    // État initial
    gsap.set(topLetters, { y: 0 });
    gsap.set(bottomLetters, { y: "100%" });

    const handleMouseEnter = () => {
      // Animation de sortie pour les lettres du haut
      gsap.to(topLetters, {
        y: "-100%",
        duration: DURATION,
        ease: "power4.inOut",
        stagger: STAGGER,
      });

      // Animation d'entrée pour les lettres du bas
      gsap.to(bottomLetters, {
        y: 0,
        duration: DURATION,
        ease: "power4.inOut",
        stagger: STAGGER,
      });
    };

    const handleMouseLeave = () => {
      // Animation de retour pour les lettres du haut
      gsap.to(topLetters, {
        y: 0,
        duration: DURATION,
        ease: "power4.inOut",
        stagger: STAGGER,
      });

      // Animation de sortie pour les lettres du bas
      gsap.to(bottomLetters, {
        y: "100%",
        duration: DURATION,
        ease: "power4.inOut",
        stagger: STAGGER,
      });
    };

    const linkElement = linkRef.current;
    linkElement.addEventListener("mouseenter", handleMouseEnter);
    linkElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      linkElement.removeEventListener("mouseenter", handleMouseEnter);
      linkElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [children]);

  return (
    <Link
      ref={linkRef}
      href={href}
      className={`relative block overflow-hidden whitespace-nowrap   ${className}`}
      style={{ lineHeight: 1.2 }}
    >
      {/* Ligne du haut - visible par défaut */}
      <div ref={topRowRef}>
        {children.split("").map((letter, i) => (
          <span key={`top-${i}`} className="letter inline-block">
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>

      {/* Ligne du bas - cachée par défaut */}
      <div ref={bottomRowRef} className="absolute inset-0">
        {children.split("").map((letter, i) => (
          <span key={`bottom-${i}`} className="letter inline-block">
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
    </Link>
  );
};

interface RevealLinksProps {
  links: Array<{
    text: string;
    href: string;
  }>;
  className?: string;
  containerClassName?: string;
}

export const RevealLinks: React.FC<RevealLinksProps> = ({
  links,
  className = "",
  containerClassName = "",
}) => {
  return (
    <section
      className={`grid place-content-center gap-2 px-2 ${containerClassName}`}
    >
      {links.map((link, index) => (
        <FlipLink key={index} href={link.href} className={className}>
          {link.text}
        </FlipLink>
      ))}
    </section>
  );
};

// Exemple d'utilisation avec des liens par défaut
export const DefaultRevealLinks: React.FC = () => {
  const defaultLinks = [
    { text: "Twitter", href: "#" },
    { text: "Linkedin", href: "#" },
    { text: "Facebook", href: "#" },
    { text: "Instagram", href: "#" },
  ];

  return (
    <RevealLinks
      links={defaultLinks}
      containerClassName="bg-green-300 text-black"
    />
  );
};
