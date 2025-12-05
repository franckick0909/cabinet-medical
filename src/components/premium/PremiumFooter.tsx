"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function PremiumFooter() {
  return (
    <footer className="bg-slate-900 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-3xl font-bold tracking-tighter mb-6">
            CABINET<span className="text-teal-500">MEDICAL</span>
          </h2>
          <p className="text-slate-400 max-w-md leading-relaxed">
            Votre santé mérite l'excellence. Nous nous engageons à fournir des soins de qualité supérieure dans un environnement moderne et apaisant.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-6">Liens Rapides</h3>
          <ul className="space-y-4">
            {["Accueil", "À Propos", "Services", "Équipe", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-6">Contact</h3>
          <ul className="space-y-4 text-slate-400">
            <li>123 Avenue de la Santé</li>
            <li>75000 Paris, France</li>
            <li className="pt-4 text-white font-medium">+33 1 23 45 67 89</li>
            <li>contact@cabinet-medical.fr</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Cabinet Médical. Tous droits réservés.
        </p>
        <div className="flex gap-6">
          {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="text-slate-400 hover:text-teal-500 transition-colors"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
