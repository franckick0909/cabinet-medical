"use client";

import TextReveal from "@/components/ui/TextReveal";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const team = [
  { id: 1, name: "Christine LEVA", role: "Responsable Cabinet", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop", desc: "Coordination et gestion du cabinet. 15 ans d'expérience en soins intensifs." },
  { id: 2, name: "Florence BROUARD", role: "Infirmière D.E.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop", desc: "Expertise en soins techniques et chimiothérapie à domicile." },
  { id: 3, name: "Émilie CHAPLAIN", role: "Infirmière D.E.", img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", desc: "Spécialisée en soins palliatifs et accompagnement de la douleur." },
  { id: 4, name: "Aude LESTRADE-CARBONNEL", role: "Infirmière D.E.", img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop", desc: "Suivi des pathologies chroniques et éducation thérapeutique." },
  { id: 5, name: "Hélène ROPARS", role: "Infirmière D.E.", img: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=2052&auto=format&fit=crop", desc: "Rééducation post-opératoire et soins de plaies complexes." },
];

export default function HarmonieTeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(1);

  useGSAP(() => {
    // Optional: Add specific scroll triggers if needed, 
    // but TextReveal handles the text animations now.
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="team" className="py-32 bg-[#F9F7F2] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div>
                <TextReveal className="block text-xs font-medium uppercase tracking-[0.2em] text-[#2D5F4F] mb-6">L&apos;Équipe</TextReveal>
                <h2 className="text-5xl md:text-7xl font-cormorant-garamond font-light leading-none">
                    <TextReveal>Vos</TextReveal>
                    <TextReveal className="italic text-[#C8D96F]">Soignantes.</TextReveal>
                </h2>
            </div>
            <div className="max-w-md text-right md:text-left">
                <TextReveal type="lines" className="text-lg font-light text-neutral-600">
                    Cinq parcours, cinq expertises, une seule équipe unie pour votre santé au quotidien.
                </TextReveal>
            </div>
        </div>

        {/* Editorial Accordion - Hover Enabled */}
        <div className="flex flex-col lg:flex-row gap-2 h-auto lg:h-[700px] rounded-lg overflow-hidden">
            {team.map((member) => (
                <div 
                    key={member.id}
                    onMouseEnter={() => setActiveId(member.id)}
                    className={cn(
                        "relative flex-1 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group cursor-pointer border-r border-neutral-200 last:border-r-0",
                        activeId === member.id ? "lg:flex-[3]" : "lg:flex-1",
                        "h-[400px] lg:h-auto" // Mobile height fixed
                    )}
                >
                    {/* Image */}
                    <Image
                        src={member.img}
                        alt={member.name}
                        fill
                        className={cn(
                            "object-cover transition-all duration-1000",
                            activeId === member.id ? "grayscale-0 scale-100" : "grayscale scale-110 opacity-50 hover:opacity-70"
                        )}
                    />
                    
                    {/* Overlay */}
                    <div className={cn(
                        "absolute inset-0 bg-black/20 transition-opacity duration-500",
                        activeId === member.id ? "opacity-0" : "opacity-100"
                    )} />

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                        
                        {/* Top: Number */}
                        <div className="flex justify-between items-start">
                             <span className="text-xs font-mono opacity-80">0{member.id}</span>
                             <div className={cn(
                                "w-8 h-8 rounded-full border border-white/30 flex items-center justify-center transition-all duration-500",
                                activeId === member.id ? "opacity-0 rotate-45" : "opacity-100 rotate-0"
                             )}>
                                <Plus className="w-4 h-4" />
                             </div>
                        </div>

                        {/* Bottom: Info */}
                        <div className={cn(
                            "transition-all duration-500 transform",
                            activeId === member.id ? "translate-y-0" : "translate-y-4"
                        )}>
                            <h3 className="text-3xl md:text-4xl font-cormorant-garamond italic mb-2 leading-none">
                                {member.name}
                            </h3>
                            <p className="text-xs uppercase tracking-widest mb-4 opacity-90">{member.role}</p>
                            
                            <div className={cn(
                                "overflow-hidden transition-all duration-700",
                                activeId === member.id ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                            )}>
                                <p className="text-sm font-light leading-relaxed text-neutral-200 max-w-md border-t border-white/20 pt-4 mt-4">
                                    {member.desc}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
}
