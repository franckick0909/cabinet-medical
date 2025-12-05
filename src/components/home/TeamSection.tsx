"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import ImageParallax from "../custom/ImageParallax";
import { Badge } from "../ui/badge";
import { TeamSection2 } from "./TeamSection2";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export function TeamSection() {
  // Référence pour l'animation du texte
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const description1Ref = useRef<HTMLParagraphElement>(null);
  const description2Ref = useRef<HTMLParagraphElement>(null);

  // Animation SplitText au scroll
  useGSAP(() => {
    if (!titleRef.current) return;

    // Créer le SplitText
    const splitText = SplitText.create(titleRef.current, {
      type: "words,lines,chars",
      linesClass: "split-line",
      charsClass: "split-char",
      mask: "lines",
    });
    const splitDescription1 = SplitText.create(description1Ref.current, {
      type: "words,lines,chars",
      linesClass: "split-line",
      charsClass: "split-char",
      mask: "lines",
    });
    const splitDescription2 = SplitText.create(description2Ref.current, {
      type: "words,lines,chars",
      linesClass: "split-line",
      charsClass: "split-char",
      mask: "lines",
    });
    // Animer les caractères
    gsap.fromTo(
      splitText.lines,
      {
        filter: "blur(8px)",
        yPercent: 150,
      },
      {
        filter: "blur(0px)",
        yPercent: 0,
        duration: 0.7,
        stagger: 0.075,
        ease: "power1.out",
        scrub: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 75%",
          end: "bottom 80%",
          toggleActions: "play none none reverse",
          markers: false,
        },
      }
    );
    gsap.fromTo(
      splitDescription1.lines,
      {
        y: 50,
      },
      {
        y: 0,
        duration: 0.6,
        stagger: 0.075,
        ease: "power1.out",
        scrub: 1,
        scrollTrigger: {
          trigger: description1Ref.current,
          start: "top 75%",
          end: "bottom 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      splitDescription2.lines,
      {
        y: 50,
      },
      {
        y: 0,
        duration: 0.6,
        stagger: 0.075,
        ease: "power1.out",
        scrub: 1,
        scrollTrigger: {
          trigger: description2Ref.current,
          start: "top 75%",
          end: "bottom 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
    return () => {
      splitText.revert();
      splitDescription1.revert();
      splitDescription2.revert();
    };
  }, []);

  return (
    <div id="team" className="relative overflow-hidden z-10 ">
      <div className="w-full relative z-10">
        <div className="relative">
          <section ref={containerRef} className="w-full py-24">
            {/* Badge */}
            <div className="inline-flex items-center justify-start gap-3 w-full text-center mb-8 px-2 sm:px-4 lg:px-6 xl:px-8 mx-auto max-w-7xl">
              <Badge
                variant="filled"
                size="lg"
                className="w-auto px-4 uppercase font-normal font-oswald text-sm md:text-base lg:text-lg"
              >
                notre équipe
              </Badge>
              <div className="h-px bg-gradient-to-l from-transparent to-primary w-[20%] " />
            </div>

            {/* Section 1 : Texte à gauche + Image Parallax à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[100vh] mb-16">
              <div className="w-full h-full flex flex-col justify-center gap-4 px-2 sm:px-4 lg:px-6 xl:px-8">
                <h2
                  ref={titleRef}
                  aria-label="Notre équipe infirmières pour vos soins de santé et votre bien-être"
                  className="text-[2rem] sm:text-[clamp(2rem,3vw,3rem)] font-medium tracking-[-0.02em] leading-[0.9] font-cormorant-garamond uppercase text-balance"
                >
                  Notre équipe infirmières pour vos soins de santé et votre
                  bien-être
                </h2>

                <p
                  ref={description1Ref}
                  aria-label="Une équipe d'infirmières dévouées, humaines et professionnelles"
                  className="text-sm md:text-base lg:text-lg text-muted-foreground mb-4"
                >
                  Chez notre cabinet, notre équipe infirmière est composée de
                  femmes passionnées, solidaires, et expérimentées qui placent
                  le patient au cœur de leurs priorités. Chacune possède une
                  expertise spécifique et de solides années d&apos;expérience,
                  pour répondre à toutes les situations et garantir un
                  accompagnement personnalisé, humain et rassurant.
                </p>

                <p
                  ref={description2Ref}
                  className="text-sm md:text-base lg:text-lg text-muted-foreground"
                >
                  Disponibles 7 jours sur 7, nous sommes à vos côtés pour
                  assurer la continuité et la qualité de vos soins, en alliant
                  compétence, bienveillance et respect. Nous nous engageons à
                  écouter, conseiller, et soutenir chaque personne qui nous
                  sollicite. Votre bien-être est notre motivation quotidienne,
                  et ensemble, nous faisons de la confiance la priorité de notre
                  accompagnement.
                </p>
              </div>

              {/* Image Parallax à droite */}
              <div className="w-full h-[60vh] lg:h-[113vh]">
                <ImageParallax
                  imgParallax="/medecin.jpeg"
                  title="NOTRE"
                  subtitle="équipe"
                  className="overflow-hidden"
                />
              </div>
            </div>

            {/* Section 2 : Image Parallax à gauche + Texte à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[100vh] mb-16">
              {/* Image Parallax à gauche */}
              <div className="w-full h-[60vh] lg:h-[100vh] lg:order-1">
                <ImageParallax
                  imgParallax="/images/materiel5.jpg"
                  title="SOINS"
                  subtitle="modernes"
                  className="overflow-hidden"
                />
              </div>

              {/* Texte à droite */}
              <div className="w-full h-full flex flex-col justify-center gap-4 px-2 sm:px-4 lg:px-6 xl:px-8 lg:order-2">
                <h2 className="text-[1.5rem] sm:text-[clamp(1.5rem,2.5vw,2.5rem)] font-medium tracking-[-0.02em] leading-[0.9] font-cormorant-garamond uppercase text-foreground">
                  Équipement médical de pointe
                </h2>

                <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-4">
                  Notre cabinet est équipé des dernières technologies médicales
                  pour vous offrir des soins de qualité optimale. Chaque
                  instrument est sélectionné avec soin pour garantir votre
                  sécurité et votre confort lors de chaque intervention.
                </p>

                <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                  De la stérilisation à l&apos;utilisation, nous respectons les
                  protocoles les plus stricts pour assurer une hygiène
                  irréprochable. Notre matériel moderne nous permet
                  d&apos;offrir une prise en charge complète et professionnelle.
                </p>
              </div>
            </div>
          </section>

          <TeamSection2 />
        </div>
      </div>
    </div>
  );
}
