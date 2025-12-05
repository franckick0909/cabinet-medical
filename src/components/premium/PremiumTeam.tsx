"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import PremiumTextReveal from "./PremiumTextReveal";

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    name: "Christine LEVA",
    role: "Responsable du cabinet",
    image: "/hero1.png",
  },
  {
    name: "Florence BROUARD",
    role: "Spécialiste Soins Techniques",
    image: "/hero2.png",
  },
  {
    name: "Émilie CHAPLAIN",
    role: "Experte Soins Palliatifs",
    image: "/hero3.png",
  },
  {
    name: "Aude LESTRADE",
    role: "Référente Diabétologie",
    image: "/hero4.png",
  },
  {
    name: "Hélène ROPARS",
    role: "Spécialiste Post-opératoire",
    image: "/hero5.png",
  },
];

export default function PremiumTeam() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".team-card");
    
    gsap.fromTo(cards, 
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="team" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <PremiumTextReveal className="text-sm font-medium tracking-widest uppercase text-primary mb-6 mx-auto">
            L&apos;Équipe
          </PremiumTextReveal>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mx-auto">
            <PremiumTextReveal>VOS EXPERTES</PremiumTextReveal>
            <PremiumTextReveal className="italic font-serif text-primary">DÉDIÉES</PremiumTextReveal>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {team.map((member, index) => (
            <div key={index} className="team-card group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-secondary/20">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
              </div>
              <h3 className="text-2xl font-serif font-medium text-foreground">{member.name}</h3>
              <p className="text-primary text-sm uppercase tracking-wider mt-2">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
