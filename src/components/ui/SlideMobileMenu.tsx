"use client";

import { SimpleThemeToggle } from "@/components/ui/SimpleThemeToggle";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface MenuItem {
  id: string;
  href: string;
  label: string;
  icon: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface SlideMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  showModeToggle?: boolean;
  hideOnDesktop?: boolean; // Nouvelle prop pour contrôler la visibilité desktop
}

export function SlideMobileMenu({
  isOpen,
  onClose,
  menuItems,
  showModeToggle = true,
  hideOnDesktop = true, // Par défaut, caché sur desktop (comportement mobile)
}: SlideMobileMenuProps) {
  // Fermer le menu avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Empêcher le scroll du body quand le menu est ouvert
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay pour fermer en cliquant à l'extérieur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] ${
              hideOnDesktop ? "lg:hidden" : ""
            }`}
            onClick={onClose}
          />

          {/* Sidebar du menu */}
          <motion.div
            initial={{ clipPath: "inset(0 0 0 100%)" }}
            animate={{ clipPath: "inset(0 0 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1] as const,
            }}
            className={`fixed right-0 top-0 bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col z-[9999] border-l border-border h-screen max-w-full ${
              hideOnDesktop
                ? "sm:w-[400px] w-full lg:hidden"
                : "w-full sm:w-[400px] lg:w-[350px]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-primary/10 to-primary/5">
              <div>
                <h2 className="text-2xl font-normal text-foreground font-kaushan-script">
                  Menu
                </h2>
                <p className="text-sm text-muted-foreground">
                  Navigation rapide
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-4 rounded-full bg-background/50 hover:bg-background/80 transition-all font-kaushan-script text-sm font-medium hover:rotate-180 duration-300"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu du menu */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    {item.onClick ? (
                      <button
                        type="button"
                        onClick={item.onClick}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 font-kaushan-script text-xl font-normal group ${
                          item.isActive
                            ? "bg-primary/15 text-primary border border-primary/20"
                            : "text-foreground/80 hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/10"
                        }`}
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                        {item.isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-2 h-2 bg-primary rounded-full"
                          />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 font-kaushan-script text-xl font-normal group ${
                          item.isActive
                            ? "bg-primary/15 text-primary border border-primary/20"
                            : "text-foreground/80 hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/10"
                        }`}
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                        {item.isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-2 h-2 bg-primary rounded-full"
                          />
                        )}
                      </Link>
                    )}
                  </motion.div>
                ))}

                {/* Mode toggle */}
                {showModeToggle && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{
                      delay: menuItems.length * 0.1 + 0.1,
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    className="border-t border-border/50 pt-4 mt-4"
                  >
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 transition-all duration-200 hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <span className="text-xl">🎨</span>
                        <span className="text-xl font-normal font-kaushan-script text-foreground/80">
                          Thème
                        </span>
                      </div>
                      <SimpleThemeToggle />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
