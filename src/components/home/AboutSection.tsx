"use client";

import { SectionTitle } from "@/components/common/SectionTitle";
import { Slider } from "@/components/common/Slider";
import Image from "next/image";

export function AboutSection() {
  const images = [
    {
      id: 1,
      src: "/slider/table1.jpg",
      alt: "Tableau de soins",
      title: "Soins Généraux",
      description:
        "Des soins adaptés à vos besoins spécifiques avec professionnalisme.",
    },
    {
      id: 2,
      src: "/slider/osculte.jpg",
      alt: "Oscultation du bras",
      title: "Soins Techniques",
      description:
        "Expertise et précision pour vos soins complexes et délicats.",
    },
    {
      id: 3,
      src: "/slider/table2.jpg",
      alt: "Lit de soins",
      title: "Lit d'observation",
      description: "Lit pour observation des patients.",
    },
    {
      id: 4,
      src: "/slider/bureau2.jpg",
      alt: "Bureau de soins",
      title: "Planification Personnalisée",
      description: "Rendez-vous adaptés à votre agenda et vos disponibilités.",
    },
    {
      id: 5,
      src: "/slider/testpcr.jpg",
      alt: "Test PCR",
      title: "Test PCR",
      description: "Test PCR pour la détection des virus et bactéries.",
    },
    {
      id: 6,
      src: "/slider/prise-de-sang.jpg",
      alt: "Prise de sang",
      title: "Prise de sang",
      description: "Prise de sang pour la détection des maladies.",
    },
    {
      id: 7,
      src: "/slider/vaccin.jpg",
      alt: "Vaccin",
      title: "Vaccin",
      description: "Vaccin pour la protection contre les maladies.",
    },
    {
      id: 8,
      src: "/slider/gellule.jpg",
      alt: "Gélules",
      title: "Médicaments",
      description: "Médicaments pour la prévention des maladies.",
    },
    {
      id: 9,
      src: "/slider/glycemie.jpg",
      alt: "Glycémie",
      title: "Glycémie",
      description: "Glycémie pour la détection des diabètes.",
    },
  ];

  return (
    <section id="about" className="py-24 lg:py-32 w-full relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Titre de section */}
        <SectionTitle
          subtitle="Notre Cabinet"
          title="Une équipe de"
          highlight="5 expertes à votre service"
          align="center"
          className="mb-16 lg:mb-24"
        />

        {/* Contenu Principal : Image + Texte */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-24 lg:mb-32">
          
          {/* Image */}
          <div className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
            <Image
              src="/images/steto1.jpg"
              alt="Stéthoscope et équipe médicale"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Texte et Highlights */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Ensemble, nous assurons des soins de qualité supérieure, tant
                au sein de notre cabinet que directement à votre domicile.
                Chacune de nos infirmières possède une spécialité qui lui
                permet de répondre précisément à vos besoins spécifiques.
              </p>
              <p>
                Que ce soit pour des soins techniques, des suivis chroniques, des
                soins palliatifs, ou de la rééducation, notre équipe
                s&apos;engage à vous offrir un service personnalisé avec
                empathie et professionnalisme. Votre bien-être et votre
                confort sont nos priorités absolues.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              {[
                "Soins à domicile et en cabinet",
                "Professionnelles diplômées d'État",
                "Spécialisées dans plusieurs domaines",
                "Expérience de plus de 10 ans",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-secondary/10 p-4 rounded-xl border border-secondary/20 transition-colors hover:bg-secondary/20">
                  <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <p className="text-base font-medium text-foreground/90">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slider réutilisable */}
      <div className="w-full mb-24 lg:mb-32">
        <Slider slides={images} />
      </div>

      {/* Section chiffres du cabinet médical */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Trait horizontal */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-16" />

          {/* Chiffres du cabinet */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-start">
            <div className="space-y-3">
              <div className="text-5xl md:text-6xl lg:text-7xl font-normal text-primary font-stardom">
                5
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Infirmières Expertes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Diplômées d&apos;État et spécialisées
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-5xl md:text-6xl lg:text-7xl font-normal text-primary font-stardom">
                10+
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Années d&apos;Expérience
                </h3>
                <p className="text-sm text-muted-foreground">
                  Au service de votre santé
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-5xl md:text-6xl lg:text-7xl font-normal text-primary font-stardom">
                24/7
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Soins à Domicile
                </h3>
                <p className="text-sm text-muted-foreground">
                  Intervention 7j/7 et jours fériés
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-5xl md:text-6xl lg:text-7xl font-normal text-primary font-stardom">
                100%
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Satisfaction Client
                </h3>
                <p className="text-sm text-muted-foreground">
                  Votre santé, notre priorité
                </p>
              </div>
            </div>
          </div>

          {/* Trait horizontal */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mt-16"></div>
        </div>
      </div>
    </section>
  );
}
