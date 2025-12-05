"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, Clock, Heart, Stethoscope } from "lucide-react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Stethoscope,
    title: "Consultation Générale",
    description: "Suivi médical complet pour toute la famille, du nourrisson au senior.",
  },
  {
    icon: Heart,
    title: "Cardiologie",
    description: "Dépistage et suivi des pathologies cardio-vasculaires avec équipements modernes.",
  },
  {
    icon: Activity,
    title: "Urgences Mineures",
    description: "Prise en charge rapide des traumatismes légers et sutures.",
  },
  {
    icon: Clock,
    title: "Téléconsultation",
    description: "Consultations à distance pour le renouvellement d'ordonnances et conseils.",
  },
];

export default function PremiumContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".service-card");
    
    gsap.fromTo(
      cards,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".section-title",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="services" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 section-title">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Nos Services <span className="text-teal-600 font-serif italic">Excellence</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Nous combinons expertise médicale et technologies de pointe pour vous offrir les meilleurs soins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group p-8 rounded-2xl bg-slate-50 hover:bg-slate-900 transition-colors duration-500 cursor-pointer"
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-teal-600 transition-colors duration-500">
                <service.icon className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-white transition-colors duration-500">
                {service.title}
              </h3>
              <p className="text-slate-500 leading-relaxed group-hover:text-slate-300 transition-colors duration-500">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
