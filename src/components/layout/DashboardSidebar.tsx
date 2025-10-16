"use client";

import { Button } from "@/components/custom/Button";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/contexts/SidebarContext";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  TrendingUp,
  Users,
} from "lucide-react";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats?: {
    totalPatients: number;
    patientsActifs: number;
    nouveauxPatients: number;
    patientsUrgents: number;
    rdvAujourdhui: number;
    rdvSemaine: number;
    rdvMois: number;
    soinsTermines: number;
    soinsEnCours: number;
    soinsEnAttente: number;
    tauxSatisfaction: number;
    patientsMoyenneAge: number;
    tempsAttenteMoyen: number;
  };
}

export function DashboardSidebar({
  activeTab,
  onTabChange,
  stats,
}: DashboardSidebarProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { isDesktop } = useBreakpoint();

  const menuItems = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: <Home className="w-5 h-5" strokeWidth={1.2} />,
      description: "Tableau de bord principal",
    },
    {
      id: "patients",
      label: "Patients",
      icon: <Users className="w-5 h-5" strokeWidth={1.2} />,
      description: "Gestion des patients",
      badge: stats?.totalPatients,
    },
    {
      id: "planning",
      label: "Planning",
      icon: <Calendar className="w-5 h-5" strokeWidth={1.2} />,
      description: "Vue calendrier",
      badge: stats?.rdvSemaine,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-5 h-5" strokeWidth={1.2} />,
      description: "Rappels et alertes",
      badge: stats?.soinsEnAttente,
    },
  ];

  const quickStats = [
    {
      label: "Actifs",
      value: stats?.patientsActifs || 0,
      icon: <Activity className="w-4 h-4" strokeWidth={1.2} />,
      color: "text-green-500",
    },
    {
      label: "Urgents",
      value: stats?.patientsUrgents || 0,
      icon: <AlertTriangle className="w-4 h-4" strokeWidth={1.2} />,
      color: "text-red-500",
    },
    {
      label: "RDV aujourd'hui",
      value: stats?.rdvAujourdhui || 0,
      icon: <CheckCircle className="w-4 h-4" strokeWidth={1.2} />,
      color: "text-orange-400",
    },
    {
      label: "Soins terminés",
      value: stats?.soinsTermines || 0,
      icon: <CheckCircle className="w-4 h-4" strokeWidth={1.2} />,
      color: "text-blue-500",
    },
    {
      label: "En cours",
      value: stats?.soinsEnCours || 0,
      icon: <Activity className="w-4 h-4" strokeWidth={1.2} />,
      color: "text-yellow-500",
    },
    {
      label: "Âge moyen",
      value: `${stats?.patientsMoyenneAge || 0} ans`,
      icon: <Users className="w-4 h-4" strokeWidth={1.2} />,
      color: "text-purple-500",
    },
    {
      label: "Satisfaction",
      value: `${Math.round(stats?.tauxSatisfaction || 0)}%`,
      icon: <TrendingUp className="w-4 h-4" strokeWidth={1.2} />,
      color: "text-green-500",
    },
  ];

  // Cacher complètement le sidebar seulement sur mobile/tablette
  if (!isDesktop) {
    return null;
  }

  return (
    <motion.div
      animate={{
        width: isCollapsed ? 64 : 320, // 16 * 4 = 64px, 80 * 4 = 320px
      }}
      transition={{
        duration: 0.4,
        delay: isCollapsed ? 0.2 : 0, // Délai pour le rétrécissement après disparition du contenu
        ease: [0.4, 0, 0.2, 1], // Courbe d'animation fluide
      }}
      className="bg-card border-r border-border flex flex-col h-screen sticky top-0 z-40"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.3,
                      delay: 0.45, // Apparaît après l'expansion du sidebar
                      ease: "easeOut",
                    },
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                    transition: {
                      duration: 0.15, // Sortie rapide
                      delay: 0, // Pas de délai pour la sortie
                      ease: "easeIn",
                    },
                  }}
                >
                  <span className="text-foreground font-normal text-2xl font-kaushan-script truncate -ml-1">
                    <span className="hidden sm:inline">Cabinet Harmonie</span>
                    <span className="sm:hidden">Harmonie</span>
                  </span>

                  <p className="text-xs text-muted-foreground">Dashboard</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bouton toggle séparé pour éviter les conflits */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={toggleSidebar}
              className="h-10 w-10 p-0 rounded-md hover:bg-muted/80 transition-colors flex items-center justify-center border-none bg-transparent cursor-pointer"
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 0 : 180 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="flex items-center justify-center pointer-events-none"
              >
                {isCollapsed ? (
                  <ChevronRight
                    className="w-5 h-5 pointer-events-none text-muted-foreground"
                    strokeWidth={2}
                  />
                ) : (
                  <ChevronRight
                    className="w-5 h-5 pointer-events-none text-muted-foreground"
                    strokeWidth={2}
                  />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <motion.div
          className="space-y-2"
          initial={false}
          animate={isCollapsed ? "collapsed" : "expanded"}
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={{
                collapsed: {
                  opacity: 1,
                  transition: {
                    duration: 0.1, // Sortie très rapide
                    delay: 0, // Pas de délai
                    ease: "easeIn",
                  },
                },
                expanded: {
                  opacity: 1,
                  transition: {
                    duration: 0.3,
                    delay: 0.5 + index * 0.05, // Commence après l'expansion
                    ease: "easeOut",
                  },
                },
              }}
            >
              <Button
                variant={activeTab === item.id ? "secondary" : "outline"}
                className={`w-full h-[45px] ${
                  isCollapsed ? "justify-center px-0" : "justify-start px-3"
                } transition-all duration-200`}
                onClick={() => onTabChange(item.id)}
              >
                <div
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "gap-3"
                  } w-full`}
                >
                  <motion.div
                    animate={{
                      scale: isCollapsed ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center flex-shrink-0"
                  >
                    {item.icon}
                  </motion.div>
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: {
                            duration: 0.3,
                            delay: 0.55 + index * 0.03, // Après expansion + délai base
                            ease: "easeOut",
                          },
                        }}
                        exit={{
                          opacity: 0,
                          x: -10,
                          transition: {
                            duration: 0.1, // Sortie rapide
                            delay: 0,
                            ease: "easeIn",
                          },
                        }}
                        className="flex-1 text-left"
                      >
                        <div className="font-medium text-sm md:text-[15px]">{item.label}</div>
                        <div className="text-xs md:text-[13px] text-muted-foreground">
                          {item.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {!isCollapsed && item.badge && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          transition: {
                            duration: 0.2,
                            delay: 0.65 + index * 0.03, // Badges apparaissent en dernier
                          },
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.8,
                          transition: {
                            duration: 0.1, // Sortie rapide
                            delay: 0,
                            ease: "easeIn",
                          },
                        }}
                      >
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </nav>

      {/* Statistiques rapides */}
      <AnimatePresence>
        {!isCollapsed && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                delay: 0.7, // Apparaît après tous les items de navigation
                ease: "easeOut",
              },
            }}
            exit={{
              opacity: 0,
              y: 20,
              transition: {
                duration: 0.15, // Sortie rapide
                delay: 0,
                ease: "easeIn",
              },
            }}
            className="p-4 border-t border-border"
          >
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="text-sm font-medium text-foreground mb-3"
            >
              Statistiques rapides
            </motion.h3>
            <div className="space-y-2">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.85 + index * 0.05, // Après le titre des statistiques
                    ease: "easeOut",
                  }}
                  className="flex items-center gap-2 text-sm"
                >
                  <motion.div
                    className={`${stat.color} flex items-center justify-center flex-shrink-0`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <span className="text-muted-foreground flex-1">
                    {stat.label}
                  </span>
                  <motion.span
                    className={`font-medium ${stat.color}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                  >
                    {stat.value}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
