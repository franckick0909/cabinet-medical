"use client";

import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { PhoneCall } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { RevealLinks } from "../animations";
import { Button } from "../custom";
import Portal from "../Portal";
import { SlideMobileMenu } from "../ui/SlideMobileMenu";

type NavLink = {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
  id?: string;
  icon?: React.ReactNode;
};

const navLinks: NavLink[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Pages",
    href: "#",
    dropdown: [
      { label: "À propos", href: "/#about" },
      { label: "Team", href: "/#team" },
      { label: "Informations", href: "/#infos" },
      { label: "Cta", href: "/#cta" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  { label: "Soins", href: "/demande/soins" },
  { label: "Dashboard", href: "/dashboard" },
];

const authLinks: NavLink[] = [
  { label: "Connexion", href: "/login" },
  { label: "Inscription", href: "/register" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hash, setHash] = useState("");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Refs pour les animations GSAP
  const linksRef = useRef<(HTMLElement | null)[]>([]);

  // Marquer le composant comme monté et initialiser le hash immédiatement
  useEffect(() => {
    setMounted(true);
    // Initialiser le hash immédiatement au montage
    if (typeof window !== "undefined") {
      setHash(window.location.hash);
    }
  }, []);

  // Surveiller les changements de hash dans l'URL (uniquement après le montage)
  useEffect(() => {
    if (!mounted) return;

    const updateHash = () => {
      setHash(window.location.hash);
    };

    // Initialiser avec le hash actuel
    updateHash();

    // Écouter les changements de hash
    window.addEventListener("hashchange", updateHash);
    window.addEventListener("popstate", updateHash);

    // Écouter les clics sur les liens avec hash (Next.js Link ne déclenche pas toujours hashchange)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link?.href) {
        try {
          const url = new URL(link.href);
          // Si le lien a un hash, mettre à jour immédiatement avec ce hash
          if (url.hash) {
            setHash(url.hash);
          } else if (url.pathname !== "/" || !url.hash) {
            // Si pas de hash, vider le hash (navigation vers une page sans hash)
            setHash("");
          }
        } catch {
          // URL invalide, ignorer
        }
      }
    };
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("popstate", updateHash);
      document.removeEventListener("click", handleClick);
    };
  }, [mounted]);

  // Mettre à jour le hash quand le pathname change (uniquement après le montage)
  // Ajout d'un délai car le hash peut changer APRÈS le pathname lors de la navigation côté client
  useEffect(() => {
    if (!mounted) return;

    const updateHash = () => {
      setHash(window.location.hash);
    };

    // Mise à jour immédiate
    updateHash();

    // Mise à jour avec délai pour capturer le hash après la navigation côté client
    const timeout = setTimeout(updateHash, 50);

    return () => clearTimeout(timeout);
  }, [pathname, mounted]);

  // Fonction helper pour vérifier si un lien est actif
  // IMPORTANT: Utiliser uniquement le state hash pour éviter les problèmes d'hydratation
  // Le hash est mis à jour uniquement côté client après le montage
  const isActiveLink = useCallback(
    (href: string) => {
      if (href === "#") return false;

      // Utiliser uniquement le state hash (pas window.location.hash) pour éviter les problèmes d'hydratation
      const currentHash = hash;

      // Pour les liens avec hash (comme /#about), vérifier si on est sur la page d'accueil ET que le hash correspond exactement
      if (href.startsWith("/#")) {
        const expectedHash = href.substring(1); // Enlever le "/" pour avoir "#about" ou "#team"
        // Si on n'est pas sur "/", aucun lien avec hash ne doit être actif
        if (pathname !== "/") return false;
        // Comparaison stricte : le hash doit correspondre exactement
        // Si le hash est vide, aucun lien avec hash ne doit être actif
        if (!currentHash || currentHash === "") return false;
        return currentHash === expectedHash;
      }

      // Pour les liens de demande, vérifier si le pathname commence par le href
      if (href.startsWith("/demande")) {
        return pathname.startsWith("/demande");
      }

      // Pour "Accueil" (/), vérifier que le pathname est exactement "/" et qu'il n'y a pas de hash
      // IMPORTANT: Si il y a un hash, "Accueil" ne doit PAS être actif
      if (href === "/") {
        if (pathname !== "/") return false;
        // Si il y a un hash, "Accueil" n'est pas actif
        if (currentHash && currentHash !== "") return false;
        return true;
      }

      // Pour les autres liens, vérifier l'égalité exacte
      return pathname === href;
    },
    [pathname, hash]
  );

  // Mémoriser la fonction onClose pour éviter les re-renders
  const handleCloseMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu quand on change de page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Gestion du scroll et escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.documentElement.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Animations d'entrée des liens (sans SplitText pour éviter les conflits)
  useEffect(() => {
    if (mobileMenuOpen) {
      // Petite pause pour laisser le DOM se mettre à jour (important pour que les refs soient peuplées)
      const timer = setTimeout(() => {
        // Animation simple des conteneurs de liens
        const links = linksRef.current.filter(
          (el): el is HTMLElement => el !== null
        );

        gsap.fromTo(
          links,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          }
        );
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [mobileMenuOpen]);

  // Fermer le menu si on redimensionne l'écran au-delà de lg
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ${isScrolled ? "bg-white backdrop-blur-sm" : "bg-transparent"}`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-5">

          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center group text-2xl uppercase font-syne font-bold"
            >
              <span className="group-hover:text-secondary transition-colors duration-300 text-primary">
                Harm
              </span>
              <span className="text-secondary group-hover:text-secondary transition-colors duration-300">
                onie
              </span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <div className="menu-link  relative hidden lg:flex space-x-6 ms-10 uppercase font-syne text-base lg:text-lg xl:text-xl font-light">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label} className="relative group z-50">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <RevealLinks
                      links={[{ text: link.label, href: link.href }]}
                      className="text-foreground group-hover:text-primary transition-colors duration-300 flex items-center gap-1 hover:text-primary"
                    />
                    <div className="group-hover:rotate-180 transition-transform duration-300">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute left-0 top-8 opacity-0 translate-y-4 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 bg-background rounded-sm border border-border p-4 min-w-max grid gap-2 justify-items-start">
                    {link.dropdown.map((item) => {
                      const isActive = isActiveLink(item.href);
                      return (
                        <div
                          key={item.label}
                          className="flex items-center gap-3 group/item"
                        >
                          {/* Bullet point - hover individuel sur l'item, pas sur tout le dropdown */}
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-tertiary" : "bg-foreground/30"} group-hover/item:bg-primary transition-all duration-300`}
                          ></div>
                          <RevealLinks
                            key={item.label}
                            links={[{ text: item.label, href: item.href }]}
                            className={`${isActive ? "text-tertiary" : "text-foreground"} group-hover/item:text-primary transition-colors duration-300 flex items-center gap-1 hover:text-primary`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <RevealLinks
                  key={link.label}
                  links={[{ text: link.label, href: link.href }]}
                  className={`${isActiveLink(link.href) ? "text-tertiary" : "text-foreground"} group-hover:text-primary transition-colors duration-300 flex items-center gap-1 hover:text-primary`}
                />
              )
            )}
          </div>


        {/* navigatu=ion right */}
        <div className="flex items-center gap-4">
          {authLinks.map((link) => (
            <RevealLinks
              key={link.label}
              links={[{ text: link.label, href: link.href }]}
              className={`${isActiveLink(link.href) ? "text-tertiary" : "text-foreground"} group-hover:text-primary transition-colors duration-300 items-center gap-1 hover:text-primary uppercase font-syne text-base lg:text-lg xl:text-xl font-light hidden lg:flex`}
            />
          ))}

            <Button
              variant="destructive"
              asChild
              className="w-0 rounded-full hidden lg:block"
            >
              <Link href="tel:0553560456">
                <PhoneCall className="w-5 h-5" />
              </Link>
            </Button>


          {/* Mobile menu button - simple quand fermé avec animation */}
          {!mobileMenuOpen && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Ouvrir le menu"
              className="relative z-[302] group flex lg:hidden font-syne uppercase text-base font-medium tracking-wide transition-all duration-300 items-center justify-center text-foreground hover:text-primary h-6 w-auto px-2 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key="menu"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{
                    y: { duration: 0.3, ease: "easeOut" },
                    opacity: { duration: 0.3 },
                  }}
                >
                  Menu
                </motion.span>
              </AnimatePresence>
            </button>
          )}
        </div>
      </div>

      {/* Menu Mobile avec Portal et Framer Motion */}
      <SlideMobileMenu isOpen={mobileMenuOpen} onClose={handleCloseMenu} />

      {/* Bouton Fermer flottant - rendu dans un Portal quand le menu est ouvert */}
      {mobileMenuOpen && (
        <Portal>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fermer le menu"
            className="fixed top-6 right-8 z-[99999] group flex lg:hidden font-syne uppercase text-base font-medium tracking-wide transition-all duration-300 items-center justify-center backdrop-blur-md text-foreground hover:text-primary overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key="fermer"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{
                  y: { duration: 0.3, delay: 0.3, ease: "easeOut" },
                  opacity: { duration: 0.5 },
                }}
              >
                Fermer
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </Portal>
      )}
    </div>
  );
}
