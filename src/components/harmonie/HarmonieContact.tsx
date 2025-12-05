"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function HarmonieContact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".contact-reveal",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="contact" className="py-32 bg-[#1a1a1a] text-[#F9F7F2] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Left: Form */}
            <div className="space-y-12">
                <div>
                    <span className="contact-reveal block text-xs font-medium uppercase tracking-[0.2em] text-[#C8D96F] mb-6">Contact</span>
                    <h2 className="contact-reveal text-5xl md:text-7xl font-cormorant-garamond font-light leading-none mb-6">
                        Parlons <br/> <span className="italic text-[#C8D96F]">Santé.</span>
                    </h2>
                    <p className="contact-reveal text-neutral-400 font-light max-w-md">
                        Une question ? Une demande de soins ? Remplissez le formulaire ci-dessous, nous vous répondrons dans les plus brefs délais.
                    </p>
                </div>

                <form className="contact-reveal space-y-8">
                    <div className="space-y-6">
                        <div className="group relative">
                            <input 
                                type="text" 
                                id="name" 
                                className="peer w-full bg-transparent border-b border-white/20 py-4 text-lg font-light focus:outline-none focus:border-[#C8D96F] transition-colors"
                                placeholder=" "
                            />
                            <label 
                                htmlFor="name" 
                                className="absolute left-0 top-4 text-neutral-500 font-light transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#C8D96F] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[#C8D96F]"
                            >
                                Votre Nom
                            </label>
                        </div>

                        <div className="group relative">
                            <input 
                                type="email" 
                                id="email" 
                                className="peer w-full bg-transparent border-b border-white/20 py-4 text-lg font-light focus:outline-none focus:border-[#C8D96F] transition-colors"
                                placeholder=" "
                            />
                            <label 
                                htmlFor="email" 
                                className="absolute left-0 top-4 text-neutral-500 font-light transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#C8D96F] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[#C8D96F]"
                            >
                                Votre Email
                            </label>
                        </div>

                        <div className="group relative">
                            <textarea 
                                id="message" 
                                rows={4}
                                className="peer w-full bg-transparent border-b border-white/20 py-4 text-lg font-light focus:outline-none focus:border-[#C8D96F] transition-colors resize-none"
                                placeholder=" "
                            />
                            <label 
                                htmlFor="message" 
                                className="absolute left-0 top-4 text-neutral-500 font-light transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#C8D96F] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[#C8D96F]"
                            >
                                Votre Message
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="group flex items-center gap-4 text-lg font-cormorant-garamond italic hover:text-[#C8D96F] transition-colors">
                        <span>Envoyer le message</span>
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#C8D96F] group-hover:border-[#C8D96F] group-hover:text-[#1a1a1a] transition-all duration-500">
                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                    </button>
                </form>
            </div>

            {/* Right: Info & Map */}
            <div className="contact-reveal space-y-12 lg:pt-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#C8D96F] mb-4">
                            <Phone className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm uppercase tracking-widest text-neutral-500">Téléphone</h3>
                        <p className="text-2xl font-cormorant-garamond">05 53 56 04 56</p>
                        <p className="text-sm text-neutral-400 font-light">Du Lundi au Vendredi, 8h-18h</p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#C8D96F] mb-4">
                            <Mail className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm uppercase tracking-widest text-neutral-500">Email</h3>
                        <p className="text-xl font-light">contact@harmonie.fr</p>
                        <p className="text-sm text-neutral-400 font-light">Réponse sous 24h</p>
                    </div>
                </div>

                <div className="relative h-[400px] w-full rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                     <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2805.578732738456!2d0.6608983766646844!3d45.51789997107456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47ff7b0c0c0c0c0d%3A0x0!2sMaison%20de%20Sant%C3%A9%20Pluridisciplinaire!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr" 
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen 
                        loading="lazy"
                    ></iframe>
                    
                    <div className="absolute top-4 left-4 bg-white text-black px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg">
                        <MapPin className="w-3 h-3 text-[#2D5F4F]" />
                        <span>Nontron, France</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}
