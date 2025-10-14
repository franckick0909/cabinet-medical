"use client";

import { Button } from "@/components/custom/Button";
import { ModeToggle } from "@/components/mode-toggle";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Titre */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-2xl">🏥</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">
                  Cabinet Harmonie
                </span>
                <span className="text-xs text-muted-foreground">
                  Soins à domicile et au cabinet
                </span>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant={pathname?.includes("/dashboard") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link href="/dashboard">📅 Dashboard</Link>
              </Button>
              <Button
                variant={pathname?.includes("/demande") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link
                  href="/demande/soins"
                  className="inline-flex items-center gap-1"
                >
                  <Plus size={18} />
                  <span>Nouvelle demande</span>
                </Link>
              </Button>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            {/* Menu mobile */}
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link href="/dashboard" title="Menu">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <span className="sr-only">Menu</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
