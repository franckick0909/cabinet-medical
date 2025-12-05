"use client";

import { FancyButton } from "@/components/common/FancyButton";
import { Arrow } from "@/components/ui/Arrow";
import Image from "next/image";

const DottedI = () => (
  <span className="relative inline-flex flex-col items-center justify-center">
    <span className="absolute -top-[0.1em] w-[0.15em] h-[0.15em] bg-destructive rounded-full" />
    I
  </span>
);

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-12 md:py-20">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl -z-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center pt-24">
          
          {/* Main Title Composition */}
          <h1 className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
            
            {/* Top Row: Icon + "CABINET" + Line */}
            <div className="flex items-center justify-center lg:justify-start gap-4 md:gap-8 w-full mb-2 md:mb-4">
              <div className="relative w-12 h-12 md:w-20 md:h-20 flex-shrink-0">
                <Image
                  src="/svg/ion.svg"
                  alt="Ion"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-[clamp(3.5rem,8vw,8rem)] font-cormorant-garamond font-light leading-none tracking-tight text-foreground">
                CABINET
              </span>
              <div className="h-px bg-gradient-to-l from-transparent to-primary/50 w-12 md:w-32" />
            </div>

            {/* Middle Row: "INFIRMIER" + Description */}
            {/* Using a relative container for the word to keep it centered, with absolute description */}
            <div className="relative flex items-center justify-center w-full mb-2 md:mb-4">
              <div className="relative flex items-center lg:justify-center">
                <span className="text-[clamp(3.5rem,8vw,8rem)] font-stardom font-normal leading-none tracking-tight text-foreground uppercase relative z-10">
                  <DottedI />NF<DottedI />RM<DottedI />ER
                </span>
                
                {/* Description positioned absolutely to the right of the title */}
                <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-8 w-64  text-left">
                  <p className="text-sm md:text-base text-muted-foreground font-syne uppercase tracking-wide leading-relaxed border-l-2 border-primary/20 pl-4">
                    Soins à domicile et au cabinet. Une équipe experte à votre écoute, 7j/7 pour votre santé.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Line + Video + "HARMONIE" + Asterisk */}
            <div className="flex items-center justify-center lg:justify-end gap-4 md:gap-8 w-full">
              <div className="hidden md:block h-px bg-gradient-to-r from-transparent to-primary/50 w-12 md:w-32" />
              
              <div className="relative w-32 h-12 md:w-48 md:h-20 rounded-full overflow-hidden border border-white/20 shadow-lg hidden sm:block">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/vidéos/coeur.mp4" type="video/mp4" />
                </video>
              </div>

              <span className="text-[clamp(3.5rem,8vw,8rem)] font-cormorant-garamond font-light leading-none tracking-tight text-foreground uppercase">
                HARMONIE
              </span>

              <div className="relative w-10 h-10 md:w-20 md:h-20 flex-shrink-0 animate-spin-slow">
                <Image
                  src="/images/asterisk.png"
                  alt="Asterisk"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </h1>

          {/* CTA Button */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
            <FancyButton
              variant="solid-primary"
              size="lg"
              className="px-4 lg:px-8 py-3 lg:py-6 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
              icon={<Arrow size={24} />}
              iconPosition="right"
              href="/rendez-vous"
            >
              Prendre rendez-vous
            </FancyButton>
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
          </div>

        </div>
      </div>
    </section>
  );
}
