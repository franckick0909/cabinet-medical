"use client";

import { useBreakpoint } from "@/hooks/useMediaQuery";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDesktop } = useBreakpoint();

  // Fermer automatiquement le sidebar sur les écrans moyens et petits
  useEffect(() => {
    if (!isDesktop) {
      setIsCollapsed(true);
    }
    // Sur desktop, laisser l'utilisateur contrôler l'état du sidebar
  }, [isDesktop]);

  const toggleSidebar = () => {
    // Permettre le toggle seulement sur desktop
    if (isDesktop) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, setIsCollapsed, toggleSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
