"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import PremiumButton from "./PremiumButton";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { name: "Accueil", href: "#hero" },
  { name: "À Propos", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Équipe", href: "#team" },
  { name: "Contact", href: "#contact" },
];

export default function PremiumHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    // Header scroll effect
    const header = headerRef.current;
    if (!header) return;

    gsap.to(header, {
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "100 top",
        scrub: true,
      },
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      paddingTop: "1rem",
      paddingBottom: "1rem",
      duration: 0.3,
    });

    // Mobile Menu Animation
    tl.current = gsap.timeline({ paused: true })
      .to(menuRef.current, {
        x: "0%",
        duration: 0.6,
        ease: "power3.inOut",
      })
      .fromTo(
        ".mobile-link",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      );

  }, []);

  const toggleMenu = () => {
    if (isMenuOpen) {
      tl.current?.reverse();
    } else {
      tl.current?.play();
    }
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 py-6 px-6 md:px-12 transition-all duration-300 bg-transparent"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tighter text-slate-900 z-50 relative">
            CABINET<span className="text-teal-600">MEDICAL</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
                <PremiumButton href="#appointment" variant="primary">
                Prendre RDV
                <ArrowRight className="w-4 h-4" />
                </PremiumButton>
            </div>

            <button
              onClick={toggleMenu}
              className="md:hidden z-50 relative p-2 text-slate-900 hover:text-teal-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 bg-white z-40 flex flex-col justify-center items-center translate-x-full"
      >
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={toggleMenu}
              className="mobile-link text-4xl font-light text-slate-900 hover:text-teal-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="mobile-link mt-8">
            <PremiumButton href="#appointment" onClick={toggleMenu} variant="primary">
                Prendre Rendez-vous
            </PremiumButton>
          </div>
        </nav>
      </div>
    </>
  );
}
