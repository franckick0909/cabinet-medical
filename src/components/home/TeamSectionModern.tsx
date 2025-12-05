"use client";

import { SectionTitle } from "@/components/common/SectionTitle";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  title: string;
  image: string;
  linkedin?: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Christine LEVA",
    title: "Responsable du cabinet",
    image: "/hero1.png",
    linkedin: "#",
    description:
      "Christine est la fondatrice et responsable du cabinet. Avec plus de 15 ans d'expérience en soins généraux et coordination, elle veille à la qualité des soins prodigués à chaque patient. Passionnée par son métier, elle a su créer une équipe soudée et dévouée au bien-être de tous.",
  },
  {
    id: 2,
    name: "Florence BROUARD",
    title: "Spécialiste Soins Techniques",
    image: "/hero2.png",
    linkedin: "#",
    description:
      "Florence apporte 12 années d'expertise en soins techniques et pédiatrie. Son approche douce et rassurante fait d'elle la référente pour les soins des plus jeunes. Elle maîtrise les techniques les plus pointues et accompagne les familles avec bienveillance.",
  },
  {
    id: 3,
    name: "Émilie CHAPLAIN",
    title: "Experte Soins Palliatifs",
    image: "/hero3.png",
    linkedin: "#",
    description:
      "Émilie se consacre depuis 18 ans à l'accompagnement des personnes âgées et aux soins palliatifs. Son empathie naturelle et son professionnalisme font d'elle un pilier essentiel de notre équipe. Elle apporte réconfort et dignité à chaque étape du parcours de soin.",
  },
  {
    id: 4,
    name: "Aude LESTRADE-CARBONNEL",
    title: "Référente Diabétologie",
    image: "/hero4.png",
    linkedin: "#",
    description:
      "Aude est notre spécialiste en diabétologie et suivi des pathologies chroniques. Avec 10 ans d'expérience, elle accompagne les patients dans la gestion quotidienne de leur maladie, leur offrant autonomie et confiance. Son écoute attentive fait la différence.",
  },
  {
    id: 5,
    name: "Hélène ROPARS",
    title: "Spécialiste Post-opératoire",
    image: "/hero5.png",
    linkedin: "#",
    description:
      "Hélène excelle dans les soins post-opératoires et la rééducation depuis 14 ans. Son expertise technique combinée à sa patience permet aux patients de récupérer dans les meilleures conditions. Elle assure un suivi personnalisé jusqu'au rétablissement complet.",
  },
];

function TeamCard({
  member,
  isOpen,
  onToggle,
  index,
}: {
  member: TeamMember;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      layout
      className="group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100 mb-6 shadow-md transition-shadow duration-300 group-hover:shadow-xl">
        {/* LinkedIn Badge */}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-foreground hover:bg-white transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
          >
            LinkedIn
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Info */}
      <div className="space-y-2">
        {/* Name with toggle */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl md:text-2xl font-cormorant-garamond font-semibold text-foreground leading-tight">
            {member.name}
          </h3>
          <button
            onClick={onToggle}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-border hover:bg-secondary/10 hover:border-secondary transition-colors"
            aria-label={isOpen ? "Fermer" : "Voir plus"}
          >
            <motion.span
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="block text-xl leading-none text-muted-foreground"
            >
              +
            </motion.span>
          </button>
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-primary uppercase tracking-wide">{member.title}</p>

        {/* Accordion Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-border mt-3">
                <p className="text-base text-muted-foreground leading-relaxed">
                  {member.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function TeamSectionModern() {
  const [openId, setOpenId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  // Séparer les membres pour le layout asymétrique
  const firstRow = teamMembers.slice(0, 2);
  const secondRow = teamMembers.slice(2, 5);

  return (
    <section id="team" className="py-24 lg:py-32 bg-background relative">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-20 lg:mb-32">
          <SectionTitle
            subtitle="Notre Équipe"
            title="Des professionnelles"
            highlight="dévouées à votre santé"
            align="left"
            className="mb-0 max-w-2xl"
          />
          
          <div className="max-w-md text-lg text-muted-foreground leading-relaxed lg:pb-4">
            <p>
              Une équipe de 5 infirmières diplômées d&apos;État, unies par la même passion : 
              offrir des soins humains, techniques et personnalisés à chaque patient.
            </p>
          </div>
        </div>

        {/* Première rangée : 2 cartes + texte de présentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 lg:mb-24 items-start">
          {/* Deux premières cartes */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {firstRow.map((member, index) => (
              <TeamCard
                key={member.id}
                member={member}
                isOpen={openId === member.id}
                onToggle={() => handleToggle(member.id)}
                index={index}
              />
            ))}
          </div>

          {/* Texte de présentation - Sticky on Desktop */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-secondary/5 rounded-3xl p-8 border border-secondary/10">
              <h3 className="text-2xl font-cormorant-garamond font-bold mb-6">Notre Philosophie</h3>
              <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
                <p>
                  Notre cabinet a été fondé sur une idée simple : bâtir une relation 
                  de confiance et de respect avec chaque patient.
                </p>
                <p>
                  Ce qui a commencé comme un petit projet s&apos;est rapidement développé 
                  pour prouver la valeur d&apos;une approche intégrée des soins.
                </p>
                <div className="h-px w-16 bg-primary/30 my-6" />
                <p className="font-medium text-foreground">
                  &quot;L&apos;humain au cœur du soin.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deuxième rangée : 3 cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {secondRow.map((member, index) => (
            <TeamCard
              key={member.id}
              member={member}
              isOpen={openId === member.id}
              onToggle={() => handleToggle(member.id)}
              index={index + 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
