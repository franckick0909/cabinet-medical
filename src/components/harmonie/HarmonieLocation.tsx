"use client";

import TextReveal from "@/components/ui/TextReveal";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Clock, MapPin, Phone, Stethoscope } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function HarmonieLocation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Bento cards fade in
    gsap.fromTo(".bento-card:not(.scale-anim)",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );

    // Image scale animation
    gsap.fromTo(".scale-anim",
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".scale-anim",
          start: "top 85%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="infos" className="py-32 bg-[#F9F7F2] text-[#1a1a1a]">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
            <div>
                <TextReveal className="block text-xs uppercase tracking-[0.2em] text-[#2D5F4F] mb-4 font-bold">Informations Pratiques</TextReveal>
                <h2 className="text-5xl md:text-7xl font-cormorant-garamond font-light leading-none">
                    <TextReveal>Nous</TextReveal>
                    <TextReveal className="italic text-[#C8D96F]">Trouver.</TextReveal>
                </h2>
            </div>
            <div className="max-w-sm text-right md:text-left">
                <TextReveal type="lines" className="text-neutral-700 font-medium">
                    Au cœur de la Maison de Santé de Nontron.
                    Un accès facile et un accueil chaleureux.
                </TextReveal>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(250px,auto)]">
            
            {/* 1. Address - Large */}
            <div className="bento-card md:col-span-2 bg-white p-8 rounded-lg border border-neutral-200 flex flex-col justify-between group hover:shadow-xl hover:shadow-[#C8D96F]/10 transition-all duration-500">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100 group-hover:bg-[#C8D96F]/20 group-hover:text-[#2D5F4F] transition-colors">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-6 h-6 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500" />
                </div>
                <div>
                    <h3 className="text-3xl font-cormorant-garamond mb-2 text-black">Maison de Santé</h3>
                    <p className="text-neutral-600 font-medium">Place des Droits de l&apos;Homme<br/>24300 Nontron</p>
                </div>
            </div>

            {/* 2. Hours */}
            <div className="bento-card bg-[#1a1a1a] text-[#F9F7F2] p-8 rounded-lg flex flex-col justify-between group hover:bg-black transition-colors duration-500 shadow-lg">
                <Clock className="w-8 h-8 text-[#C8D96F]" />
                <div className="space-y-3">
                    <div className="flex justify-between text-sm border-b border-white/20 pb-2">
                        <span className="text-neutral-300">Lun - Ven</span>
                        <span className="font-medium">08h - 18h</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-white/20 pb-2">
                        <span className="text-neutral-300">Samedi</span>
                        <span className="font-medium">Sur RDV</span>
                    </div>
                    <div className="flex justify-between text-sm pt-1 text-[#C8D96F] font-bold">
                        <span>Urgences</span>
                        <span>24h/7j</span>
                    </div>
                </div>
            </div>

            {/* 3. Phone */}
            <div className="bento-card bg-[#2D5F4F] text-white p-8 rounded-lg flex flex-col justify-between group cursor-pointer hover:bg-[#1e4035] transition-colors duration-500 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <Phone className="w-8 h-8 relative z-10" />
                <div className="relative z-10">
                    <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-medium">Secrétariat</p>
                    <p className="text-2xl font-cormorant-garamond">05 53 56 04 56</p>
                </div>
            </div>

            {/* 4. CMSI - Wide */}
            <div className="bento-card md:col-span-2 lg:col-span-2 bg-white p-8 rounded-lg border border-neutral-200 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group hover:border-[#B85C4F]/30 transition-colors duration-500">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#B85C4F]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-3 text-[#B85C4F] mb-4">
                        <Stethoscope className="w-5 h-5" />
                        <span className="font-bold tracking-widest text-[10px] uppercase bg-[#B85C4F]/10 px-2 py-1 rounded-full border border-[#B85C4F]/20">Soins Non Programmés</span>
                    </div>
                    <h3 className="text-3xl font-cormorant-garamond mb-2 text-black">Point CMSI</h3>
                    <p className="text-neutral-600 font-medium text-sm leading-relaxed">
                        Pour les petites urgences (traumatologie, infections, plaies).
                        <br/>Sans rendez-vous du Lundi au Vendredi : 14h00 - 17h30.
                    </p>
                </div>
                <div className="relative z-10">
                    <a href="tel:0553560456" className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-full text-sm font-medium hover:bg-[#B85C4F] hover:text-white hover:border-[#B85C4F] transition-all duration-300">
                        Appeler le CMSI
                    </a>
                </div>
            </div>

            {/* 5. Specialists List - Tall */}
            <div className="bento-card md:col-span-2 lg:col-span-2 row-span-2 bg-white p-8 rounded-lg border border-neutral-200 flex flex-col justify-between group hover:shadow-lg transition-all duration-500">
                <div>
                    <h3 className="text-2xl font-cormorant-garamond mb-8 text-black">Médecins & Spécialistes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-4">Généralistes</h4>
                            <ul className="space-y-3">
                                <li className="flex justify-between text-sm border-b border-neutral-200 pb-2">
                                    <span className="font-medium text-neutral-800">Dr. CHRAÏBI</span>
                                </li>
                                <li className="flex justify-between text-sm border-b border-neutral-200 pb-2">
                                    <span className="font-medium text-neutral-800">Dr. IONICA</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-4">Consultants</h4>
                            <ul className="space-y-3">
                                <li className="flex justify-between text-sm border-b border-neutral-200 pb-2">
                                    <span className="font-medium text-neutral-800">Dr. LAZAR</span>
                                    <span className="text-neutral-500 text-xs font-medium">Pneumologue</span>
                                </li>
                                <li className="flex justify-between text-sm border-b border-neutral-200 pb-2">
                                    <span className="font-medium text-neutral-800">Dr. LESSUEUR</span>
                                    <span className="text-neutral-500 text-xs font-medium">Urologue</span>
                                </li>
                                <li className="flex justify-between text-sm border-b border-neutral-200 pb-2">
                                    <span className="font-medium text-neutral-800">Mme GARCIA</span>
                                    <span className="text-neutral-500 text-xs font-medium">Sage-Femme</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-between items-center">
                    <span className="text-xs text-neutral-500 font-medium">Prise de RDV Secrétariat</span>
                    <span className="font-mono text-sm font-bold text-[#2D5F4F]">05 53 56 03 03</span>
                </div>
            </div>

            {/* 6. Image Maison de Santé - Scale Animation */}
            <div className="bento-card md:col-span-2 relative h-full min-h-[250px] rounded-lg overflow-hidden scale-anim opacity-0">
                <Image 
                    src="/images/maison-de-santé.png" 
                    alt="Maison de Santé de Nontron" 
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                />
            </div>
        </div>
      </div>
    </section>
  );
}
