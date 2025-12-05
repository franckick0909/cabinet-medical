"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Button } from "../custom";

// Enregistrer le plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export function TeamSection2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const teamMembers = [
    {
      id: 1,
      name: "Hélène ROPARS",
      specialties: ["Soins post-opératoires et rééducation"],
      experience: "14 ans d'expérience",
      image: "/hero1.png",
      slug: "helene-ropars",
    },
    {
      id: 2,
      name: "Florence BROUARD",
      specialties: ["Soins techniques et pédiatrie"],
      experience: "12 ans d'expérience",
      image: "/hero2.png",
      slug: "florence-brouard",
    },
    {
      id: 3,
      name: "Émilie CHAPLAIN",
      specialties: ["Soins palliatifs et gériatrie"],
      experience: "10 ans d'expérience",
      image: "/hero3.png",
      slug: "emilie-chaplain",
    },
    {
      id: 4,
      name: "Aude LESTRADE-CARBONNEL",
      specialties: ["Diabétologie et soins chroniques"],
      experience: "10 ans d'expérience",
      image: "/hero4.png",
      slug: "aude-lestrade-carbonnel",
    },
    {
      id: 5,
      name: "Christine LEVA",
      specialties: ["Soins post-opératoires"],
      experience: "14 ans d'expérience",
      image: "/hero5.png",
      slug: "christine-leva",
    },
  ];

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Vérifier si on est sur desktop (largeur >= 768px)
      const isDesktop = window.innerWidth >= 768;

      if (!isDesktop) {
        return; // Pas d'animations sur mobile/tablette
      }

      // Pin de la section work avec l'image sticky (desktop seulement)
      ScrollTrigger.create({
        trigger: ".work",
        start: "top top",
        end: "bottom bottom",
        pin: ".work__right",
        pinSpacing: false,
        invalidateOnRefresh: true,
      });

      // Configuration des z-index pour l'effet de couches
      gsap.set(".work__photo-item", {
        zIndex: (i, target, targets) => targets.length - i,
      });

      // Effet de révélation par couches (desktop seulement)
      const imageItems = gsap.utils.toArray(
        ".work__photo-item:not(:last-child)"
      ) as HTMLElement[];

      imageItems.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: `.work__info:nth-child(${i + 1})`,
          start: "top top",
          end: "bottom center",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(item, {
              clipPath: `inset(${progress * 100}% 0% 0% 0%)`,
            });
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="wrapper w-full overflow-hidden">
      {/* Header Section */}
      <div className="spacer w-full min-h-[15vh] md:min-h-[20vh] py-8 md:py-12 space-y-8 md:space-y-12">
        <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-6 lg:px-4">
          <div className="flex items-center justify-center gap-2 md:gap-3 w-full text-center mb-6 md:mb-8">
            <div className="h-px bg-gradient-to-r from-transparent to-foreground w-full" />
            <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-cormorant-garamond text-foreground whitespace-nowrap">
              L&apos;équipe
            </h2>
            <div className="h-px bg-gradient-to-l from-transparent to-foreground w-full" />
          </div>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-lg mx-auto leading-relaxed">
            Créées pour les personnes et les soins désirant un accompagnement
            d&apos;excellence
          </p>
        </div>
      </div>

      {/* Mobile: Static Grid */}
      <section className="py-12 md:hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-fill-minmax gap-4 md:gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-card overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={member.image}
                    alt={`${member.name} - Équipe médicale`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-base md:text-lg font-cormorant-garamond uppercase text-foreground font-semibold">
                      {member.name}
                    </h3>
                  </div>
                  <ul className="space-y-1 mb-4 text-sm md:text-base font-sans text-muted-foreground">
                    {member.specialties.map((specialty, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-[6px] h-[6px] bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {specialty}
                      </li>
                    ))}
                    <li className="flex items-start">
                      <span className="w-[6px] h-[6px] bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {member.experience}
                    </li>
                  </ul>
                  <Button
                    variant="sidebarActive"
                    className="w-full"
                    onClick={() => router.push(`/team/${member.slug}`)}
                  >
                    En savoir plus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop/Tablet: Animated Layout */}
      <section className="work hidden md:flex relative min-h-screen">
        <div className="work__left relative w-[54%]">
          <div className="work__info h-screen flex flex-col justify-center items-center px-4">
            <div className="work__left-bl flex flex-col items-end max-w-2xl mx-auto w-full">
              <span className="work__number block text-[15vw] text-start w-full leading-[0.9] tracking-[-1rem] mb-12 transform skew-x-[-20deg] font-bold text-stroke text-stroke-foreground">
                01
              </span>
              <h2 className="title text-[4vw] font-cormorant-garamond uppercase text-start w-full leading-[0.9] mb-4 text-foreground">
                Hélène ROPARS
              </h2>
              <ul className="list-disc list-inside flex flex-col gap-2 items-start justify-start w-full font-oswald uppercase tracking-widest text-base">
                <li>Soins post-opératoires et rééducation</li>
                <li>14 ans d&apos;expérience</li>
              </ul>
              <Button
                variant="sidebarActive"
                className="mt-4"
                onClick={() => router.push("/team/helene-ropars")}
              >
                En savoir plus
              </Button>
            </div>
          </div>

          <div className="work__info h-screen flex flex-col justify-center items-center px-4">
            <div className="work__left-bl flex flex-col items-end max-w-2xl mx-auto w-full">
              <span className="work__number block text-[15vw] text-start w-full leading-[0.9] tracking-[-1rem] mb-12 transform skew-x-[-20deg] font-bold text-stroke text-stroke-foreground">
                02
              </span>
              <h2 className="title text-[4vw] font-cormorant-garamond uppercase text-start w-full leading-[0.9] mb-4 text-foreground">
                Florence BROUARD
              </h2>
              <ul className="list-disc list-inside flex flex-col gap-2 items-start justify-start w-full font-oswald uppercase tracking-widest text-base">
                <li>Soins techniques et pédiatrie</li>
                <li>12 ans d&apos;expérience</li>
              </ul>
              <Button
                variant="sidebarActive"
                className="mt-4"
                onClick={() => router.push("/team/florence-brouard")}
              >
                En savoir plus
              </Button>
            </div>
          </div>

          <div className="work__info h-screen flex flex-col justify-center items-center px-4">
            <div className="work__left-bl flex flex-col items-end max-w-2xl mx-auto w-full">
              <span className="work__number block text-[15vw] text-start w-full leading-[0.9] tracking-[-1rem] mb-12 transform skew-x-[-20deg] font-bold text-stroke text-stroke-foreground">
                03
              </span>
              <h2 className="title text-[4vw] font-cormorant-garamond uppercase text-start w-full leading-[0.9] mb-4 text-foreground">
                Émilie CHAPLAIN
              </h2>
              <ul className="list-disc list-inside flex flex-col gap-2 items-start justify-start w-full font-oswald uppercase tracking-widest text-base">
                <li>Soins palliatifs et gériatrie</li>
                <li>10 ans d&apos;expérience</li>
              </ul>
              <Button
                variant="sidebarActive"
                className="mt-4"
                onClick={() => router.push("/team/emilie-chaplain")}
              >
                En savoir plus
              </Button>
            </div>
          </div>

          <div className="work__info h-screen flex flex-col justify-center items-center px-4">
            <div className="work__left-bl flex flex-col items-end max-w-2xl mx-auto w-full">
              <span className="work__number block text-[15vw] text-start w-full leading-[0.9] tracking-[-1rem] mb-12 transform skew-x-[-20deg] font-bold text-stroke text-stroke-foreground">
                04
              </span>
              <h2 className="title text-[4vw] font-cormorant-garamond uppercase text-start w-full leading-[0.9] mb-4 text-foreground">
                Aude LESTRADE-CARBONNEL
              </h2>
              <ul className="list-disc list-inside flex flex-col gap-2 items-start justify-start w-full font-oswald uppercase tracking-widest text-base">
                <li>Diabétologie et soins chroniques</li>
                <li>10 ans d&apos;expérience</li>
              </ul>
              <Button
                variant="sidebarActive"
                className="mt-4"
                onClick={() => router.push("/team/aude-lestrade-carbonnel")}
              >
                En savoir plus
              </Button>
            </div>
          </div>

          <div className="work__info h-screen flex flex-col justify-center items-center px-4">
            <div className="work__left-bl flex flex-col items-end max-w-2xl mx-auto w-full">
              <span className="work__number block text-[15vw] text-start w-full leading-[0.9] tracking-[-1rem] mb-12 transform skew-x-[-20deg] font-bold text-stroke text-stroke-foreground">
                05
              </span>
              <h2 className="title text-[4vw] font-cormorant-garamond uppercase text-start w-full leading-[0.9] mb-4 text-foreground">
                Christine LEVA
              </h2>
              <ul className="list-disc list-inside flex flex-col gap-2 items-start justify-start w-full font-oswald uppercase tracking-widest text-base">
                <li>Soins post-opératoires</li>
                <li>14 ans d&apos;expérience</li>
              </ul>
              <Button
                variant="sidebarActive"
                className="mt-4"
                onClick={() => router.push("/team/christine-leva")}
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </div>

        <div className="work__right w-[46%]">
          <div className="work__right-bl flex flex-col justify-center w-full h-screen">
            <div className="work__photo w-full h-full relative">
              <div className="work__photo-item absolute w-full h-full cursor-pointer overflow-hidden">
                <Image
                  src="/hero1.png"
                  alt="Équipe médicale - Hélène ROPARS"
                  fill
                  className="w-full h-full object-cover"
                  sizes="46vw"
                  priority
                />
              </div>
              <div className="work__photo-item absolute inset-0 w-full h-full cursor-pointer overflow-hidden">
                <Image
                  src="/hero2.png"
                  alt="Équipe médicale - Florence BROUARD"
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="work__photo-item absolute inset-0 w-full h-full cursor-pointer overflow-hidden">
                <Image
                  src="/hero3.png"
                  alt="Équipe médicale - Émilie CHAPLAIN"
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="work__photo-item absolute inset-0 w-full h-full cursor-pointer overflow-hidden">
                <Image
                  src="/hero4.png"
                  alt="Équipe médicale - Aude LESTRADE-CARBONNEL"
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="work__photo-item absolute inset-0 w-full h-full cursor-pointer overflow-hidden">
                <Image
                  src="/hero5.png"
                  alt="Équipe médicale - Christine LEVA"
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
