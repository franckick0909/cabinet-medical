"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function HarmonieAbout() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    // Image Reveal with ClipPath (Top to Bottom)
    gsap.utils.toArray<HTMLElement>(".reveal-img-container").forEach((container) => {
      gsap.fromTo(container,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 20%",
          }
        }
      );
      
      // Optional: Scale effect on image inside
      const img = container.querySelector("img");
      if (img) {
          gsap.fromTo(img,
              { scale: 1.2 },
              {
                  scale: 1,
                  duration: 1.5,
                  ease: "power3.out",
                  scrollTrigger: {
                      trigger: container,
                      start: "top 80%",
                  }
              }
          );
      }
    });

    // Text Reveal
    const textElements = gsap.utils.toArray<HTMLElement>(".reveal-text");
    textElements.forEach((el) => {
        gsap.fromTo(el,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                }
            }
        );
    });

    // Sticky Section
    ScrollTrigger.create({
        trigger: ".sticky-container",
        start: "top top",
        end: "bottom bottom",
        pin: ".sticky-element",
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="about" className="py-32 md:py-48 bg-[#F9F7F2] text-[#1a1a1a] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Intro Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-40">
            <div className="lg:col-span-8 lg:col-start-3 text-center">
                <span className="reveal-text block text-xs font-medium uppercase tracking-[0.2em] text-[#2D5F4F] mb-8">
                    Notre Philosophie
                </span>
                <h2 className="reveal-text text-5xl md:text-7xl lg:text-8xl font-cormorant-garamond font-light leading-[0.9] mb-12">
                    Plus qu'un soin,<br/> 
                    <span className="italic text-[#C8D96F]">une rencontre humaine.</span>
                </h2>
                <p className="reveal-text text-xl md:text-2xl font-light leading-relaxed text-neutral-600 max-w-3xl mx-auto">
                    Au cœur de notre pratique réside une conviction simple : chaque patient est unique. 
                    Nous ne soignons pas seulement des symptômes, nous accompagnons des vies.
                </p>
            </div>
        </div>

        {/* Asymmetric Grid / Sticky Layout */}
        <div className="sticky-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
            
            {/* Left: Sticky Image */}
            <div className="lg:col-span-5 sticky-element lg:h-[80vh] lg:sticky lg:top-24 hidden lg:block">
                <div className="reveal-img-container relative w-full h-full overflow-hidden rounded-lg shadow-2xl">
                    <Image
                        src="https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2070&auto=format&fit=crop"
                        alt="Soin et écoute"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur p-4 max-w-[200px] rounded-lg shadow-lg z-10">
                        <p className="font-cormorant-garamond italic text-lg text-[#2D5F4F]">"L'écoute est le premier soin."</p>
                    </div>
                </div>
            </div>

            {/* Right: Scrolling Content */}
            <div className="lg:col-span-6 lg:col-start-7 space-y-32 pt-12">
                
                {/* Block 1 */}
                <div className="reveal-text">
                    <h3 className="text-4xl font-cormorant-garamond italic mb-6 text-[#2D5F4F]">L'Expertise Technique</h3>
                    <p className="text-lg font-light leading-relaxed text-neutral-600 mb-8">
                        Nos infirmières sont formées aux techniques les plus récentes. 
                        De la gestion de la douleur aux soins palliatifs, en passant par le suivi des maladies chroniques, 
                        nous assurons une prise en charge médicale de haute qualité.
                    </p>
                    <div className="reveal-img-container h-[300px] relative overflow-hidden rounded-lg shadow-xl">
                        <Image
                            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop"
                            alt="Expertise technique"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Block 2 */}
                <div className="reveal-text">
                    <h3 className="text-4xl font-cormorant-garamond italic mb-6 text-[#2D5F4F]">La Proximité</h3>
                    <p className="text-lg font-light leading-relaxed text-neutral-600 mb-8">
                        Ancrées à Nontron, nous connaissons notre territoire et ses habitants. 
                        Cette proximité nous permet une réactivité et une disponibilité sans faille. 
                        Nous sommes vos voisines, vos partenaires de santé.
                    </p>
                    <div className="reveal-img-container h-[300px] relative overflow-hidden rounded-lg shadow-xl">
                        <Image
                            src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop"
                            alt="Proximité"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Block 3 */}
                <div className="reveal-text">
                    <h3 className="text-4xl font-cormorant-garamond italic mb-6 text-[#2D5F4F]">L'Accompagnement</h3>
                    <p className="text-lg font-light leading-relaxed text-neutral-600">
                        Au-delà du soin technique, nous sommes là pour rassurer, expliquer et soutenir. 
                        Nous travaillons en étroite collaboration avec votre médecin traitant et les autres professionnels de santé 
                        pour un parcours de soin cohérent.
                    </p>
                </div>

            </div>

        </div>
      </div>
    </section>
  );
}
