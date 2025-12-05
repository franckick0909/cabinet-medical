"use client";

import TextReveal from "@/components/ui/TextReveal";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, ArrowRight, Heart, Home, Syringe } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "01",
    title: "Soins Techniques",
    subtitle: "L'expertise au service de votre santé",
    description: "Nos infirmières diplômées d'État assurent des actes techniques avec rigueur et précision, dans le respect des protocoles médicaux les plus stricts. De l'injection simple à la perfusion complexe, chaque geste est réalisé avec soin.",
    icon: Syringe,
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2400&auto=format&fit=crop",
    image2: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2400&auto=format&fit=crop",
    features: ["Injections & Prélèvements", "Perfusions", "Pansements complexes", "Gestion diabète"],
    bgColor: "bg-[#3D5A4C]", // Deep green like screenshot 1
    textColor: "text-[#E8F4E8]",
    borderColor: "border-[#C8D96F]" // Yellow-green border
  },
  {
    id: "02",
    title: "Maintien à Domicile",
    subtitle: "Préserver votre autonomie",
    description: "Un accompagnement quotidien bienveillant pour vous aider dans les gestes du quotidien. Nous intervenons avec respect de votre dignité et de votre intimité, en créant un lien de confiance durable.",
    icon: Home,
    image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2400&auto=format&fit=crop",
    image2: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2400&auto=format&fit=crop",
    features: ["Toilette & Hygiène", "Aide à l'habillage", "Surveillance constante", "Lien avec la famille"],
    bgColor: "bg-[#C8D96F]", // Bright lime like screenshot 2
    textColor: "text-[#2D3A1F]",
    borderColor: "border-[#B85C4F]" // Terracotta border
  },
  {
    id: "03",
    title: "Suivi Post-Opératoire",
    subtitle: "Une convalescence sereine",
    description: "Après une intervention chirurgicale, nous assurons le suivi médical nécessaire et veillons à votre rétablissement optimal. Surveillance rigoureuse, gestion de la douleur et rapport régulier au chirurgien.",
    icon: Activity,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2400&auto=format&fit=crop",
    image2: "https://images.unsplash.com/photo-1748407408885-9b62df0e2527?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    features: ["Retrait de fils/agrafes", "Surveillance cicatrisation", "Gestion de la douleur", "Rapport au chirurgien"],
    bgColor: "bg-[#B85C4F]", // Terracotta like screenshot 4
    textColor: "text-[#FFF8F0]",
    borderColor: "border-[#3D5A4C]" // Deep green border
  },
  {
    id: "04",
    title: "Soins Palliatifs",
    subtitle: "Un accompagnement humain",
    description: "Une présence bienveillante et des soins de confort pour accompagner la fin de vie. Nous offrons un soutien médical et humain à la personne et à ses proches, dans le respect de sa dignité et de ses choix.",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2400&auto=format&fit=crop",
    image2: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2400&auto=format&fit=crop",
    features: ["Gestion de la douleur", "Soutien psychologique", "Accompagnement famille", "Soins de confort"],
    bgColor: "bg-[#F5EFE7]", // Warm cream
    textColor: "text-[#3D3D3D]",
    borderColor: "border-[#C8D96F]" // Yellow-green border
  }
];

export default function HarmonieServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    // Horizontal Scroll
    const totalWidth = track.scrollWidth;
    const windowWidth = window.innerWidth;
    const xMovement = -(totalWidth - windowWidth);

    gsap.to(track, {
      x: xMovement,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${totalWidth * 1.5}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });

    // Parallax on images - Subtle vertical movement
    const images = section.querySelectorAll('.service-image');
    images.forEach((img) => {
      gsap.fromTo(img, 
        { y: -100, scale: 1.3 },
        {
          y: 100,
          scale: 1.3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${totalWidth * 1.5}`,
            scrub: 1,
          }
        }
      );
    });

    // Secondary images parallax (opposite direction)
    const images2 = section.querySelectorAll('.service-image-2');
    images2.forEach((img) => {
      gsap.fromTo(img, 
        { y: 50, scale: 1.3 }, // Reduced movement, adjusted scale
        {
          y: -50,
          scale: 1.3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${totalWidth * 1.5}`,
            scrub: 1,
          }
        }
      );
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="services" className="relative h-screen bg-[#F9F7F2] overflow-hidden">
      
      {/* Horizontal Track */}
      <div ref={trackRef} className="flex h-full w-fit">
        
        {/* Intro Card - Wright's Ferry Hero Style */}
        <div className="relative w-screen h-screen shrink-0 flex items-center justify-center bg-[#3D5A4C] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image 
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2400&auto=format&fit=crop"
              alt="Soins infirmiers"
              fill
              className="object-cover opacity-20"
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-4xl px-12 text-center">
            <span className="text-xs uppercase tracking-[0.4em] text-[#E8F4E8]/60 mb-8 block font-light">
              Nos Expertises
            </span>
            <h2 className="text-7xl md:text-8xl lg:text-9xl font-cormorant-garamond font-light text-[#E8F4E8] leading-[0.9] mb-12">
              <TextReveal delay={0.1} className="block">DÉCOUVREZ</TextReveal>
              <TextReveal delay={0.3} className="block">NOS SOINS</TextReveal>
              <TextReveal delay={0.5} className="block italic">INFIRMIERS</TextReveal>
            </h2>
            <TextReveal delay={0.7} type="lines" className="text-xl text-[#E8F4E8]/80 font-light leading-relaxed max-w-2xl mx-auto">
              Une gamme complète de soins dispensés avec rigueur et humanité, adaptés à vos besoins spécifiques.
            </TextReveal>
          </div>
        </div>

        {/* Service Cards - Wright's Ferry Split Screen Style */}
        {services.map((service, index) => (
          <div 
            key={service.id} 
            className={`relative w-screen h-screen shrink-0 ${service.bgColor} flex items-center overflow-hidden py-6`}
          >
            
            {/* Split Layout: Image Left, Content Right (alternating) */}
            {index % 2 === 0 ? (
              <>
                {/* Left: Images (Asymmetric Collage) */}
                <div className="relative w-1/2 h-full flex items-center justify-center p-12">
                  {/* Main Image with colored border */}
                  <div className={`service-image-container relative w-[70%] h-[75%] border-1 ${service.borderColor} p-3 shadow-2xl rounded-lg bg-transparent`}>
                    <div className="relative w-full h-full overflow-hidden rounded">
                      <Image 
                        src={service.image} 
                        alt={service.title}
                        fill
                        className="service-image object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Secondary Image (Overlapping) */}
                  <div className="service-image-container-2 absolute bottom-16 right-16 w-[40%] h-[35%] bg-white/10 backdrop-blur-xs p-2 shadow-2xl">
                    <div className="relative w-full h-full overflow-hidden">
                      <Image 
                        src={service.image2} 
                        alt={service.title}
                        fill
                        className="service-image-2 object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Number Badge */}
                  <div className="absolute top-16 left-16 bg-white/95 backdrop-blur px-8 py-4 text-2xl font-light font-cormorant-garamond tracking-[0.3em]">
                    {service.id}
                  </div>
                </div>

                {/* Right: Content */}
                <div className={`w-1/2 h-full flex flex-col justify-center px-16 ${service.textColor}`}>
                  <div className="max-w-xl">
                    <service.icon className="w-12 h-12 mb-8 mt-16 stroke-[1.5]" />
                    
                    <h3 className="text-7xl md:text-8xl font-cormorant-garamond font-light leading-[0.9] mb-6">
                      <TextReveal delay={index * 0.1}>{service.title}</TextReveal>
                    </h3>
                    
                    <TextReveal delay={index * 0.1 + 0.2} type="lines" className="text-2xl font-cormorant-garamond italic mb-8 opacity-80">
                      {service.subtitle}
                    </TextReveal>
                    
                    <TextReveal delay={index * 0.1 + 0.4} type="lines" className="text-lg leading-relaxed mb-12 font-light opacity-90">
                      {service.description}
                    </TextReveal>

                    <ul className="space-y-4 mb-12">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-4 text-sm uppercase tracking-[0.2em] font-light opacity-80">
                          <span className="text-2xl font-light">{String(idx + 1).padStart(2, '0')}</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="inline-flex items-center gap-3 text-sm uppercase tracking-widest font-medium group cursor-pointer w-fit">
                      <span className="w-12 h-[2px] bg-current group-hover:bg-[#C8D96F] group-hover:w-16 transition-all duration-300" />
                      <span className="group-hover:text-[#C8D96F] transition-colors duration-300">En savoir plus</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Left: Content */}
                <div className={`w-1/2 h-full flex flex-col justify-center px-16 ${service.textColor}`}>
                  <div className="max-w-xl ml-auto">
                    <service.icon className="w-12 h-12 mb-8 mt-16 stroke-[1.5]" />
                    
                    <h3 className="text-7xl md:text-8xl font-cormorant-garamond font-light leading-[0.9] mb-6">
                      <TextReveal delay={index * 0.1}>{service.title}</TextReveal>
                    </h3>
                    
                    <TextReveal delay={index * 0.1 + 0.2} type="lines" className="text-2xl font-cormorant-garamond italic mb-8 opacity-80">
                      {service.subtitle}
                    </TextReveal>
                    
                    <TextReveal delay={index * 0.1 + 0.4} type="lines" className="text-lg leading-relaxed mb-12 font-light opacity-90">
                      {service.description}
                    </TextReveal>

                    <ul className="space-y-4 mb-12">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-4 text-sm uppercase tracking-[0.2em] font-light opacity-80">
                          <span className="text-2xl font-light">{String(idx + 1).padStart(2, '0')}</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="inline-flex items-center gap-3 text-sm uppercase tracking-widest font-medium group cursor-pointer w-fit">
                      <span className="w-12 h-[2px] bg-current group-hover:bg-[#C8D96F] group-hover:w-16 transition-all duration-300" />
                      <span className="group-hover:text-[#C8D96F] transition-colors duration-300">En savoir plus</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Right: Images (Asymmetric Collage) */}
                <div className="relative w-1/2 h-full flex items-center justify-center p-12">
                  {/* Main Image with colored border */}
                  <div className={`service-image-container relative w-[70%] h-[75%] border-2 ${service.borderColor} p-3 shadow-2xl rounded-lg bg-transparent`}>
                    <div className="relative w-full h-full overflow-hidden rounded">
                      <Image 
                        src={service.image} 
                        alt={service.title}
                        fill
                        className="service-image object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Secondary Image (Overlapping) */}
                  <div className="service-image-container-2 absolute top-16 left-16 w-[40%] h-[35%] bg-white/20 backdrop-blur-sm p-2 shadow-2xl">
                    <div className="relative w-full h-full overflow-hidden">
                      <Image 
                        src={service.image2} 
                        alt={service.title}
                        fill
                        className="service-image-2 object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Number Badge */}
                  <div className="absolute bottom-16 right-16 bg-white/95 backdrop-blur px-8 py-4 text-2xl font-light font-cormorant-garamond tracking-[0.3em]">
                    {service.id}
                  </div>
                </div>
              </>
            )}

          </div>
        ))}

      </div>
    </section>
  );
}
