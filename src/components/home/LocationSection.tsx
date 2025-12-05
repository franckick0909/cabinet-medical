"use client";

import { Calendar, Clock, ExternalLink, MapPin, Stethoscope, Phone } from "lucide-react";
import { FancyButton } from "../common/FancyButton";
import { SectionTitle } from "../common/SectionTitle";

export function LocationSection() {
  return (
    <section id="infos" className="py-24 lg:py-32 w-full relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* En-tête avec SectionTitle */}
        <SectionTitle
          subtitle="Informations Pratiques"
          title="Nous trouver"
          highlight="& nous contacter"
          align="center"
          className="mb-16 lg:mb-24"
        />

        {/* Contenu Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          
          {/* Colonne Gauche : Coordonnées & Horaires */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Carte Adresse */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-cormorant-garamond font-bold mb-2">Maison de Santé</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Place des Droits de l&apos;Homme<br />
                24300 Nontron
              </p>
              <FancyButton
                href="https://www.google.com/maps/search/?api=1&query=Maison+de+Santé+de+Nontron+Place+des+Droits+de+l'Homme+24300+Nontron"
                target="_blank"
                rel="noopener noreferrer"
                variant="outline-primary"
                size="sm"
                className="w-full justify-center"
                icon={<ExternalLink className="w-4 h-4" />}
                iconPosition="right"
              >
                Itinéraire
              </FancyButton>
            </div>

            {/* Carte Horaires */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 text-secondary">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-cormorant-garamond font-bold mb-4">Horaires</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="font-medium">Lundi - Vendredi</span>
                  <span className="text-muted-foreground">08h - 18h</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="font-medium">Samedi</span>
                  <span className="text-muted-foreground">Sur RDV</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-medium text-destructive">Urgences</span>
                  <span className="text-destructive font-bold">24h/7j</span>
                </div>
              </div>
            </div>

          </div>

          {/* Colonne Centrale : Carte Interactive */}
          <div className="lg:col-span-2">
            <div className="h-full min-h-[400px] rounded-3xl overflow-hidden border border-border shadow-sm relative group">
              <iframe
                src="https://www.google.com/maps?q=Place+des+Droits+de+l%27Homme,+24300+Nontron,+France&output=embed"
                width="100%"
                height="100%"
                allowFullScreen
                title="Localisation de la Maison de Santé de Nontron sur Google Maps"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium shadow-sm pointer-events-none">
                📍 Nontron, Dordogne
              </div>
            </div>
          </div>
        </div>

        {/* Section Professionnels - Grid Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Carte Infirmiers (Mise en avant) */}
          <div className="lg:col-span-2 bg-primary/5 rounded-3xl p-8 border border-primary/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-cormorant-garamond font-bold">Cabinet Infirmier</h3>
                <p className="text-primary font-medium">Harmonie</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="font-medium text-lg">L&apos;équipe</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Christine LEVA</li>
                  <li>Florence BROUARD</li>
                  <li>Émilie CHAPLAIN</li>
                  <li>Aude LESTRADE-CARBONNEL</li>
                  <li>Hélène ROPARS</li>
                </ul>
              </div>
              <div className="flex flex-col justify-end items-start">
                <p className="text-sm text-muted-foreground mb-2">Permanence téléphonique</p>
                <a href="tel:0553560456" className="text-2xl md:text-3xl font-bold text-primary hover:text-primary/80 transition-colors">
                  05 53 56 04 56
                </a>
              </div>
            </div>
          </div>

          {/* Carte Médecins */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-neutral-600" />
              </div>
              <h3 className="text-xl font-bold font-cormorant-garamond">Médecins Généralistes</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Dr. CHRAÏBI</span>
                <a href="tel:0553560303" className="text-sm bg-secondary/10 text-secondary px-3 py-1 rounded-full hover:bg-secondary/20 transition-colors">
                  05 53 56 03 03
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Dr. IONICA</span>
                <a href="tel:0553560303" className="text-sm bg-secondary/10 text-secondary px-3 py-1 rounded-full hover:bg-secondary/20 transition-colors">
                  05 53 56 03 03
                </a>
              </div>
            </div>
          </div>

          {/* Carte Spécialistes */}
          <div className="lg:col-span-3 bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-warning" />
              </div>
              <h3 className="text-xl font-bold font-cormorant-garamond">Consultations Spécialisées</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                <p className="font-bold text-foreground">Dr. LAZAR</p>
                <p className="text-sm text-muted-foreground mb-3">Pneumologue</p>
                <div className="flex justify-between items-end">
                  <span className="text-xs font-medium text-neutral-500">Jeudi</span>
                  <a href="tel:0545978866" className="text-sm font-medium text-primary">05 45 97 88 66</a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                <p className="font-bold text-foreground">Dr. LESSUEUR</p>
                <p className="text-sm text-muted-foreground mb-3">Urologue</p>
                <div className="flex justify-between items-end">
                  <span className="text-xs font-medium text-neutral-500">Mardi PM</span>
                  <a href="tel:0545978889" className="text-sm font-medium text-primary">05 45 97 88 89</a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                <p className="font-bold text-foreground">Mme GARCIA</p>
                <p className="text-sm text-muted-foreground mb-3">Sage-Femme</p>
                <div className="flex justify-between items-end">
                  <span className="text-xs font-medium text-neutral-500">Vendredi PM</span>
                  <a href="tel:0545696639" className="text-sm font-medium text-primary">05 45 69 66 39</a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                <p className="font-bold text-foreground">Autres</p>
                <p className="text-sm text-muted-foreground mb-3">Psychologue, Hypno.</p>
                <div className="flex justify-between items-end">
                  <span className="text-xs font-medium text-neutral-500">Sur RDV</span>
                  <span className="text-sm font-medium text-primary">Voir liste</span>
                </div>
              </div>
            </div>
          </div>

          {/* Carte CMSI - Point de téléconsultation */}
          <div className="lg:col-span-3 bg-gradient-to-br from-destructive/5 to-card rounded-3xl p-8 border border-destructive/10 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-destructive">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-cormorant-garamond text-foreground mb-2">
                    Point de téléconsultation <span className="text-destructive">CMSI</span>
                  </h3>
                  <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Centre Médical de Soins Immédiats de Périgueux.<br/>
                    Traumatologie Adultes et enfants, infections ORL ou pulmonaires.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto bg-white/50 p-4 rounded-2xl border border-destructive/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Clock className="w-4 h-4 text-destructive" />
                    Lundi - Vendredi
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">14h00 - 17h30</p>
                </div>
                <div className="h-px sm:h-auto sm:w-px bg-destructive/20" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Phone className="w-4 h-4 text-destructive" />
                    Contact
                  </div>
                  <a href="tel:0553560456" className="text-lg font-bold text-destructive hover:underline block pl-6">
                    05 53 56 04 56
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
