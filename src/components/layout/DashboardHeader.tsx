"use client";

import { SlideMobileMenu } from "@/components/ui/SlideMobileMenu";
import { useSidebar } from "@/contexts/SidebarContext";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { useState } from "react";

interface DashboardHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function DashboardHeader({
  activeTab,
  onTabChange,
}: DashboardHeaderProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCollapsed } = useSidebar();
  const { isDesktop } = useBreakpoint();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Gérer les clics sur les onglets du dashboard
  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    closeMobileMenu();
  };

  // Calculer les marges selon l'état du sidebar
  const getHeaderMargins = () => {
    if (isDesktop) {
      const sidebarWidth = isCollapsed ? "ml-16" : "ml-64";
      return `${sidebarWidth} mr-2 sm:mr-4`;
    }
    return "mx-2 sm:mx-4";
  };

  // Préparer les items du menu mobile pour le dashboard
  const menuItems = [
    // Onglets du dashboard (seulement si pas sur desktop ou si sidebar caché)
    ...(!isDesktop
      ? [
          {
            id: "dashboard-overview",
            href: "#",
            label: "Vue d'ensemble",
            icon: "🏠",
            isActive: activeTab === "overview",
            onClick: () => handleTabClick("overview"),
          },
          {
            id: "dashboard-patients",
            href: "#",
            label: "Patients",
            icon: "👥",
            isActive: activeTab === "patients",
            onClick: () => handleTabClick("patients"),
          },
          {
            id: "dashboard-planning",
            href: "#",
            label: "Planning",
            icon: "📅",
            isActive: activeTab === "planning",
            onClick: () => handleTabClick("planning"),
          },
          {
            id: "dashboard-notifications",
            href: "#",
            label: "Notifications",
            icon: "🔔",
            isActive: activeTab === "notifications",
            onClick: () => handleTabClick("notifications"),
          },
        ]
      : []),
    // Navigation générale
    {
      id: "nav-home",
      href: "/",
      label: "Home",
      icon: "🏠",
      isActive: false,
    },
    {
      id: "nav-demande",
      href: "/demande/soins",
      label: "Nouvelle demande",
      icon: "➕",
      isActive: false,
    },
  ];

  return (
    <>
      {/* Header simplifié - uniquement le bouton Menu */}
      <header
        className={`fixed top-0 right-0 w-full z-20 h-18 px-0 sm:px-2 ${getHeaderMargins()} flex items-center justify-end`}
      >
        <button
          type="button"
          className="relative transition-all duration-300 font-kaushan-script text-2xl font-normal text-foreground  tracking-wider cursor-pointer after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-100 after:origin-bottom-right after:transition-all after:duration-300 hover:after:scale-x-0 
          before:content-[''] before:absolute before:w-full before:h-[2px] before:bottom-0 before:left-0 before:bg-primary before:origin-right before:scale-x-0 hover:before:origin-left hover:before:scale-x-100 before:transition-transform before:duration-500 before:ease-in-out hover:before:delay-200"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? "Fermer" : "Menu"}
        </button>
      </header>

      {/* Menu en glissière - visible sur tous les écrans */}
      <SlideMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        menuItems={menuItems}
        showModeToggle={true}
        hideOnDesktop={false}
      />
    </>
  );
}
