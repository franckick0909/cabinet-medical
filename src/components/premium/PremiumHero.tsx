"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import PremiumButton from "./PremiumButton";
import PremiumTextReveal from "./PremiumTextReveal";

gsap.registerPlugin(ScrollTrigger);

export default function PremiumHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax Effect on Scroll
    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: 150,
      scale: 1.1,
      ease: "none",
    });
  }, { scope: containerRef });

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-background flex flex-col justify-center pt-20"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          ref={imageRef}
          className="w-full h-full bg-[url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop')] bg-cover bg-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl">
          <PremiumTextReveal className="text-sm md:text-base font-medium tracking-widest uppercase text-primary mb-4">
            Cabinet Infirmier
          </PremiumTextReveal>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground mb-8 leading-[0.9]">
            <PremiumTextReveal delay={0.1}>L'EXCELLENCE</PremiumTextReveal>
            <PremiumTextReveal delay={0.2} className="text-primary italic font-serif">DU SOIN</PremiumTextReveal>
            <PremiumTextReveal delay={0.3}>À DOMICILE</PremiumTextReveal>
          </h1>
          
          <div className="max-w-xl">
             <PremiumTextReveal delay={0.4} className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-10">
              Une équipe de 5 expertes dédiées à votre santé.
              Soins techniques, palliatifs et suivi chronique avec une approche humaine.
            </PremiumTextReveal>
          </div>

          <div className="flex flex-wrap gap-4">
            <PremiumButton href="#appointment" variant="primary">
                Prendre Rendez-vous
            </PremiumButton>
            <PremiumButton href="#services" variant="outline">
                Nos Services
            </PremiumButton>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 right-10 flex items-center gap-4 text-muted-foreground animate-pulse">
        <span className="text-sm uppercase tracking-widest">Scroll</span>
        <ArrowDown className="w-4 h-4" />
      </div>
    </section>
  );
}
