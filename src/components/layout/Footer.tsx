"use client";

import {
    Facebook,
    Linkedin,
    Mail,
    MapPin,
    Phone
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Soins généraux", href: "/demande/soins" },
      { name: "Soins techniques", href: "/demande/soins" },
      { name: "Soins palliatifs", href: "/demande/soins" },
      { name: "Diabétologie", href: "/demande/soins" },
      { name: "Soins post-opératoires", href: "/demande/soins" },
    ],
    pratiques: [
      { name: "À propos", href: "/#about" },
      { name: "Notre équipe", href: "/#team" },
      { name: "Informations", href: "/#infos" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Contact", href: "/#infos" },
    ],
    legal: [
      { name: "Mentions légales", href: "/mentions-legales" },
      { name: "Politique de confidentialité", href: "/confidentialite" },
      { name: "Conditions d'utilisation", href: "/conditions" },
    ]
  };

  return (
    <footer className="bg-neutral-900 text-neutral-200 relative overflow-hidden pt-20 pb-10">
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        
        {/* Top Section: Brand & Description */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16 border-b border-white/10 pb-16">
          <div className="lg:w-1/3 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                 <Image
                  src="/svg/ion.svg"
                  alt="Logo"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="text-2xl font-cormorant-garamond font-bold text-white tracking-wide uppercase">
                Harmonie
              </span>
            </div>
            <p className="text-neutral-400 leading-relaxed max-w-sm">
              Une équipe de 5 infirmières diplômées d&apos;État à votre service pour des soins de 
              qualité, dans le respect et la bienveillance. Interventions à domicile et au cabinet.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Column 1: Contact */}
            <div className="space-y-6">
              <h4 className="text-lg font-syne font-bold text-white uppercase tracking-wide">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-neutral-400">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    Maison de Santé<br />
                    Place des Droits de l&apos;Homme<br />
                    24300 Nontron
                  </span>
                </li>
                <li>
                  <a href="tel:0553560456" className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    05 53 56 04 56
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@cabinet.fr" className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    contact@cabinet.fr
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-syne font-bold text-white uppercase tracking-wide">Liens Rapides</h4>
              <ul className="space-y-3">
                {footerLinks.pratiques.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-neutral-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="space-y-6">
              <h4 className="text-lg font-syne font-bold text-white uppercase tracking-wide">Légal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-neutral-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-neutral-500">
          <p>© {currentYear} Cabinet Infirmier Harmonie. Tous droits réservés.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Cabinet ouvert aujourd&apos;hui</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
