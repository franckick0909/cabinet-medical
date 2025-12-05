"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import PremiumTextReveal from "./PremiumTextReveal";

gsap.registerPlugin(ScrollTrigger);

export default function PremiumAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      y: -50,
      ease: "none",
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="about" className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <PremiumTextReveal className="text-sm font-medium tracking-widest uppercase text-primary mb-6">
              Notre Philosophie
            </PremiumTextReveal>
            
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-8 leading-tight">
              <PremiumTextReveal>L&apos;HUMAIN AU</PremiumTextReveal>
              <PremiumTextReveal className="italic font-serif text-primary">CŒUR DU SOIN</PremiumTextReveal>
            </h2>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Ensemble, nous assurons des soins de qualité supérieure, tant au sein de notre cabinet que directement à votre domicile. Chacune de nos infirmières possède une spécialité qui lui permet de répondre précisément à vos besoins spécifiques.
              </p>
              <p>
                Que ce soit pour des soins techniques, des suivis chroniques, des soins palliatifs, ou de la rééducation, notre équipe s&apos;engage à vous offrir un service personnalisé avec empathie et professionnalisme.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12 border-t border-border pt-8">
              <div>
                <div className="text-5xl font-serif text-primary mb-2">5</div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground">Expertes</div>
              </div>
              <div>
                <div className="text-5xl font-serif text-primary mb-2">10+</div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground">Années d&apos;Expérience</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative h-[600px] w-full">
            <div ref={imageRef} className="relative w-full h-full rounded-none overflow-hidden">
               <Image
                src="/images/steto1.jpg"
                alt="Cabinet Médical"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
