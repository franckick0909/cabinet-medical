"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import PremiumTextReveal from "./PremiumTextReveal";

gsap.registerPlugin(ScrollTrigger);

const services = [
  { title: "Soins Généraux", desc: "Soins adaptés à vos besoins spécifiques." },
  { title: "Soins Techniques", desc: "Expertise pour soins complexes et délicats." },
  { title: "Suivi Diabétique", desc: "Accompagnement et surveillance glycémique." },
  { title: "Soins Palliatifs", desc: "Accompagnement humain et digne." },
  { title: "Post-Opératoire", desc: "Rééducation et suivi de cicatrisation." },
  { title: "Tests & Prélèvements", desc: "PCR, prises de sang, vaccins." },
];

export default function PremiumServices() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLElement>(".service-item");
    
    items.forEach((item, i) => {
      gsap.fromTo(item, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="services" className="py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <PremiumTextReveal className="text-sm font-medium tracking-widest uppercase text-primary mb-6">
            Nos Compétences
          </PremiumTextReveal>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            <PremiumTextReveal>UNE EXPERTISE</PremiumTextReveal>
            <PremiumTextReveal className="italic font-serif text-primary">COMPLÈTE</PremiumTextReveal>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
          {services.map((service, index) => (
            <div key={index} className="service-item group border-t border-border pt-8 hover:border-primary transition-colors duration-500 cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-serif font-medium text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all duration-300" />
              </div>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
