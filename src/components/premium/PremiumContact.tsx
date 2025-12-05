"use client";

import PremiumButton from "./PremiumButton";
import PremiumTextReveal from "./PremiumTextReveal";

export default function PremiumContact() {
  return (
    <section id="contact" className="py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <PremiumTextReveal className="text-sm font-medium tracking-widest uppercase text-primary mb-6">
              Contact
            </PremiumTextReveal>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-8">
              <PremiumTextReveal>PRENDRE</PremiumTextReveal>
              <PremiumTextReveal className="italic font-serif text-primary">RENDEZ-VOUS</PremiumTextReveal>
            </h2>
            
            <div className="space-y-8 text-lg text-muted-foreground mb-12">
              <p>
                Nous sommes disponibles 7j/7 pour vos soins à domicile ou au cabinet.
                N'hésitez pas à nous contacter pour toute demande.
              </p>
              
              <div className="space-y-2">
                <h4 className="text-foreground font-medium uppercase tracking-wider text-sm">Adresse</h4>
                <p>123 Avenue de la Santé, 75000 Paris</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-foreground font-medium uppercase tracking-wider text-sm">Téléphone</h4>
                <p className="text-2xl text-foreground font-serif">01 23 45 67 89</p>
              </div>
            </div>

            <PremiumButton href="#appointment" variant="primary">
              Appeler Maintenant
            </PremiumButton>
          </div>

          <div className="relative h-[500px] w-full bg-slate-200 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Map Placeholder or Image */}
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615509614!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1647526348429!5m2!1sfr!2sfr" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen 
                loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
