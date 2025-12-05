"use client";

import { FancyButton } from "@/components/common/FancyButton";
import { Calendar, CheckCircle2, Clock, MapPin, Phone } from "lucide-react";
import { SectionTitle } from "../common/SectionTitle";

export function CTASection() {
  return (
    <section id="cta" className="py-24 lg:py-32 w-full relative overflow-hidden bg-primary/5">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Text & Value Props */}
          <div className="space-y-8">
            <SectionTitle
              subtitle="Prendre Rendez-vous"
              title="Votre santé n'attend pas"
              highlight="Réservez en quelques clics"
              align="left"
              className="mb-0"
            />
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Que ce soit pour des soins ponctuels ou un suivi régulier, notre équipe 
              s&apos;adapte à vos besoins. Nous intervenons à domicile ou vous recevons 
              au cabinet selon vos préférences.
            </p>

            <div className="space-y-4 pt-4">
              {[
                "Intervention rapide 7j/7",
                "Soins remboursés par la Sécurité Sociale",
                "Matériel stérile et respect des protocoles",
                "Suivi personnalisé avec votre médecin"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground/80 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <FancyButton
                size="lg"
                variant="solid-primary"
                className="px-8 py-4 text-lg w-full sm:w-auto justify-center"
                onClick={() => (window.location.href = "/demande/soins")}
                icon={<Calendar className="w-5 h-5" />}
              >
                Prendre rendez-vous
              </FancyButton>

              <FancyButton
                size="lg"
                variant="outline-primary"
                className="px-8 py-4 text-lg w-full sm:w-auto justify-center"
                onClick={() => (window.location.href = "tel:0553560456")}
                icon={<Phone className="w-5 h-5" />}
              >
                05 53 56 04 56
              </FancyButton>
            </div>
          </div>

          {/* Right Column: Info Cards */}
          <div className="grid gap-6">
            {/* Availability Card */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-lg shadow-primary/5 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-secondary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-cormorant-garamond mb-2">Disponibilités</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Lundi - Vendredi :</strong> 8h00 - 18h00<br />
                    <strong className="text-foreground">Week-end & Fériés :</strong> Permanence assurée<br />
                    <span className="text-destructive font-medium mt-2 block">Urgences assurées 24h/24</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Zone Card */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-lg shadow-primary/5 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-cormorant-garamond mb-2">Zone d&apos;intervention</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Nous nous déplaçons à <strong className="text-foreground">Nontron</strong> et dans un rayon de 
                    <strong className="text-foreground"> 25 km</strong> aux alentours.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Nontron", "Saint-Pardoux", "Saint-Martial", "Augignac"].map((city) => (
                      <span key={city} className="text-xs font-medium bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md">
                        {city}
                      </span>
                    ))}
                    <span className="text-xs font-medium bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md">+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
