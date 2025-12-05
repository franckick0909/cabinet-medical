"use client";

import { MenuLink } from "@/components/ui/AnimatedLink";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import React, { useRef, useState } from "react";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const pagesLinks = [
  { name: "Le Cabinet", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "L'Équipe", href: "#team" },
  { name: "Infos Pratiques", href: "#infos" },
];

export default function HarmonieHeader() {
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
      backgroundColor: "rgba(249, 247, 242, 0.2)",
      backdropFilter: "blur(10px)",
      paddingTop: "1rem",
      paddingBottom: "1rem",
      borderBottom: "1px solid rgba(0,0,0,0.05)",
      duration: 0.3,
    });

    // Initialize SplitType for menu links once
    const menuLinks = document.querySelectorAll('.menu-link-item');
    const allWords: Element[] = [];
    
    menuLinks.forEach((link) => {
      const split = new SplitType(link as HTMLElement, {
        types: 'words',
      });
      
      // Wrap words in overflow hidden containers for mask effect
      split.words?.forEach(word => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'inline-block';
        word.parentNode?.insertBefore(wrapper, word);
        wrapper.appendChild(word);
        allWords.push(word);
      });
    });
    gsap.set(allWords, { yPercent: 110 });

    // Initialize SplitType for menu info titles (Espace Patient, etc.)
    const menuInfoTitles = document.querySelectorAll('.menu-info-title');
    const allInfoWords: Element[] = [];
    
    menuInfoTitles.forEach((title) => {
      const split = new SplitType(title as HTMLElement, {
        types: 'words',
      });
      
      // Wrap words in overflow hidden containers for mask effect
      split.words?.forEach(word => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'inline-block';
        word.parentNode?.insertBefore(wrapper, word);
        wrapper.appendChild(word);
        allInfoWords.push(word);
      });
    });
    gsap.set(allInfoWords, { yPercent: 110 });

    // Sidebar Menu Animation (slide from right + links reveal)
    tl.current = gsap.timeline({ paused: true })
      .to(menuRef.current, {
        x: 0,
        duration: 1.2,
        ease: "power3.inOut",
      })
      .fromTo(
        allWords,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.6,
          stagger: 0.015,
          ease: "power3.out"
        },
        "-=0.4"
      )
      .fromTo(
        allInfoWords,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: "power3.out"
        },
        "-=0.5"
      )
      .fromTo(
        ".menu-info-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=0.3"
      );

  }, []);

  const toggleMenu = () => {
    if (isMenuOpen) {
      // Close menu - play timeline in reverse
      tl.current?.reverse();
    } else {
      // Open menu - play timeline forward
      tl.current?.play();
    }
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 w-full h-20 bg-[#F9F7F2]/20 backdrop-blur-md border-b border-black/5 transition-all duration-300 px-6 md:px-12",
          isMenuOpen ? "z-[60]" : "z-60"
        )}
      >
        <div className="max-w-[1920px] mx-auto h-full flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="text-2xl md:text-3xl font-cormorant-garamond font-bold tracking-tight z-50 relative mix-blend-difference text-teal-900">
            Harmonie
          </Link>

          {/* Right Side: CTA + Burger */}
          <div className="flex items-center gap-6 z-50">
            {/* Optional CTA visible on Desktop */}
            {/* Optional CTA visible on Desktop */}
            <Link 
              href="/demande/soins" 
              className="hidden md:inline-flex relative group overflow-hidden rounded-full px-8 py-3 border border-[#1a1a1a]/10 hover:border-[#2D5F4F] transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-[#2D5F4F] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
              <span className="relative z-10 flex items-center gap-3 text-xs font-bold tracking-[0.15em] uppercase text-[#1a1a1a] group-hover:text-[#F9F7F2] transition-colors duration-500">
                <span>Prendre RDV</span>
                <span className="w-2 h-2 rounded-full bg-[#C8D96F] group-hover:bg-[#F9F7F2] transition-colors duration-500" />
              </span>
            </Link>

            {/* Menu Toggle - Stylish Hamburger */}
          <button
            onClick={toggleMenu}
            className="relative w-14 h-14 flex items-center justify-center group"
            aria-label="Toggle menu"
          >
            <div className="relative w-7 h-4">
              {/* Top line */}
              <span className={cn(
                "absolute left-0 w-full h-[2px] bg-[#1a1a1a] transition-all duration-500 ease-out",
                isMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45 bg-white group-hover:rotate-90" : "top-0 rotate-0"
              )} />
              {/* Middle line */}
              <span className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#1a1a1a] transition-all duration-500 ease-out",
                isMenuOpen ? "w-0 opacity-0" : "w-full opacity-100"
              )} />
              {/* Bottom line */}
              <span className={cn(
                "absolute left-0 w-full h-[2px] bg-[#1a1a1a] transition-all duration-500 ease-out",
                isMenuOpen ? "top-1/2 -translate-y-1/2 -rotate-45 bg-white group-hover:-rotate-90" : "bottom-0 rotate-0"
              )} />
              
              {/* Decorative circle that draws on hover */}
              <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none" viewBox="0 0 50 50">
                <circle
                  cx="25"
                  cy="25"
                  r="22"
                  fill="none"
                  stroke="#C8D96F"
                  strokeWidth="1.5"
                  strokeDasharray="138.2"
                  strokeDashoffset="138.2"
                  className="transition-all duration-700 ease-out group-hover:stroke-dashoffset-0"
                  style={{
                    strokeDashoffset: isMenuOpen ? '0' : '138.2',
                    transition: 'stroke-dashoffset 0.7s ease-out'
                  }}
                  onMouseEnter={(e) => {
                    if (!isMenuOpen) {
                      e.currentTarget.style.strokeDashoffset = '0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMenuOpen) {
                      e.currentTarget.style.strokeDashoffset = '138.2';
                    }
                  }}
                />
              </svg>
            </div>
          </button>

          </div>

        </div>
      </header>

      {/* Sidebar Menu from Right */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 h-screen w-full md:w-[700px] lg:w-[900px] bg-[#2D5F4F] text-white z-50 shadow-2xl overflow-y-auto translate-x-full"
      >

        <div className="px-8 md:px-12 py-24 h-full">
          
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">
            
            {/* Left Column: Navigation Links */}
            <nav className="flex flex-col justify-center overflow-hidden">
              <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-8 block menu-info">Navigation</span>
              
              <div className="flex flex-col gap-2 overflow-hidden">
                <MenuLink href="/" onClick={toggleMenu} className="menu-link-item text-white">
                  Accueil
                </MenuLink>
                {pagesLinks.map((link) => (
                  <MenuLink
                    key={link.name}
                    href={link.href}
                    onClick={toggleMenu}
                    className="menu-link-item text-white"
                  >
                    {link.name}
                  </MenuLink>
                ))}
                <MenuLink href="#contact" onClick={toggleMenu} className="menu-link-item text-white">
                  Contact
                </MenuLink>
              </div>
            </nav>

            {/* Right Column: Patient Space & Info */}
            <div className="flex flex-col justify-end space-y-12 lg:pb-12 overflow-hidden">
              
              {/* Espace Patient */}
              <div className="space-y-6">
                <h3 className="text-xl font-cormorant-garamond italic menu-info-title text-white/90 overflow-hidden">Espace Patient</h3>
                <div className="flex flex-col items-start gap-4 menu-info-content">
                  <Link href="/dashboard" onClick={toggleMenu} className="text-lg font-cormorant-garamond text-white hover:text-[#C8D96F] transition-colors">
                    Mon Tableau de Bord
                  </Link>
                  <div className="flex gap-6">
                    <Link href="/login" onClick={toggleMenu} className="text-sm uppercase tracking-widest border-b border-white/30 pb-1 hover:text-[#C8D96F] hover:border-[#C8D96F] transition-colors">
                      Connexion
                    </Link>
                    <Link href="/register" onClick={toggleMenu} className="text-sm uppercase tracking-widest border-b border-white/30 pb-1 hover:text-[#C8D96F] hover:border-[#C8D96F] transition-colors">
                      S&apos;inscrire
                    </Link>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-cormorant-garamond italic menu-info-title text-white/90 overflow-hidden">Nous Contacter</h3>
                <div className="menu-info-content">
                  <p className="text-sm text-white/70 font-light">contact@harmonie-sante.fr</p>
                  <p className="text-sm text-white/70 font-light">+33 1 23 45 67 89</p>
                </div>
              </div>
              
              {/* Socials */}
              <div className="space-y-3">
                <h3 className="text-xl font-cormorant-garamond italic menu-info-title text-white/90 overflow-hidden">Suivez-nous</h3>
                <div className="flex gap-6 menu-info-content">
                  <a href="#" className="text-sm text-white/70 border-b border-white/20 pb-1 hover:text-white hover:border-white transition-colors">Instagram</a>
                  <a href="#" className="text-sm text-white/70 border-b border-white/20 pb-1 hover:text-white hover:border-white transition-colors">LinkedIn</a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};
