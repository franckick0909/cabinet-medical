"use client";

import TextReveal from "@/components/ui/TextReveal";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function HarmonieHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Split title for character animation
    const title = document.querySelector('.hero-title');
    if (title) {
      const split = new SplitType(title as HTMLElement, {
        types: 'chars',
      });

      gsap.fromTo(
        split.chars,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.03,
          ease: "power3.out",
          delay: 0.3
        }
      );
    }

    // Image parallax on scroll
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        }
      });
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#F9F7F2] text-[#1a1a1a] overflow-hidden flex items-center"
    >
      {/* Background Image - Right side with organic shape */}
      <div className="absolute top-0 right-0 w-1/2 h-full">
        <div 
          ref={imageRef}
          className="relative w-full h-full"
          style={{
            clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)'
          }}
        >
          <Image
            src="/images/plante2.jpg"
            alt="Plante décorative - Cabinet Harmonie"
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F9F7F2] via-transparent to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Title - Large and centered */}
          <div className="mb-16 overflow-hidden">
            <h1 className="hero-title text-[clamp(4rem,12vw,14rem)] font-cormorant-garamond font-light leading-[0.9] tracking-tight text-[#1a1a1a]">
              L'Harmonie
              <br />
              <span className="italic text-[#2D5F4F]">du Soin.</span>
            </h1>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
            
            {/* Left Column: Subtitle & CTA */}
            <div className="space-y-8">
              <TextReveal delay={0.8} type="lines" className="text-xl md:text-2xl text-neutral-600 font-light leading-relaxed max-w-md" mask>
                Une approche humaine et technique des soins infirmiers. À votre domicile ou au cabinet, 7j/7.
              </TextReveal>

              <div className="flex flex-col gap-4 pt-4">
                <Link 
                  href="/demande/soins" 
                  className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#C8D96F] text-[#1a1a1a] rounded-full overflow-hidden hover:shadow-xl transition-all duration-300 w-fit"
                >
                  <span className="relative z-10 font-medium tracking-wider text-sm uppercase flex items-center gap-3">
                    Prendre Rendez-vous
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-[#2D5F4F] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-medium tracking-wider text-sm uppercase text-white gap-3">
                    Prendre Rendez-vous
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                
                <Link 
                  href="#services" 
                  className="group inline-flex items-center gap-3 text-sm uppercase tracking-widest font-medium text-neutral-700 hover:text-[#2D5F4F] transition-colors duration-300 w-fit"
                >
                  <span className="w-12 h-[2px] bg-neutral-300 group-hover:bg-[#C8D96F] group-hover:w-16 transition-all duration-300" />
                  Découvrir nos services
                </Link>
              </div>
            </div>

            {/* Right Column: Stats */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-5xl font-cormorant-garamond font-bold text-[#2D5F4F]">15+</div>
                  <p className="text-sm text-neutral-600 leading-relaxed">Années d'expérience cumulée</p>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-cormorant-garamond font-bold text-[#2D5F4F]">5</div>
                  <p className="text-sm text-neutral-600 leading-relaxed">Infirmières diplômées d'état</p>
                </div>
              </div>

              {/* Location badge */}
              <div className="inline-flex items-center gap-3 bg-white/80 px-6 py-3 rounded-full border border-neutral-200">
                <div className="w-2 h-2 rounded-full bg-[#C8D96F]" />
                <p className="text-sm font-medium text-[#2D5F4F]">Cabinet Infirmier — Nontron</p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#C8D96F]/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-[#2D5F4F]/5 rounded-full blur-3xl -z-10" />
    </section>
  );
}


