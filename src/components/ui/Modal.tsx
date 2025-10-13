"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-[95vw] sm:max-w-md w-full max-h-[80vh] sm:max-h-[85vh]",
  md: "max-w-[95vw] sm:max-w-lg md:max-w-xl w-full max-h-[80vh] sm:max-h-[85vh]",
  lg: "max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-5xl w-full max-h-[85vh] sm:max-h-[90vh]",
  xl: "max-w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl w-[95%] max-h-[85vh] sm:max-h-[90vh]",
  full: "max-w-[98vw] w-full max-h-[95vh]",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          sizeClasses[size],
          "overflow-hidden flex flex-col rounded-lg [&>button:last-of-type]:hidden"
        )}
      >
        {title && (
          <DialogHeader className="flex-shrink-0 pb-4 border-b border-border overflow-y-auto pr-12">
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              {title}
            </DialogTitle>
          </DialogHeader>
        )}
        <div className="flex-1 py-4 sm:py-6 px-2 overflow-y-auto">
          {children}
        </div>

        {/* Bouton fermer custom - placé en dernier pour être visible */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute sm:right-2 sm:top-2 right-4 top-4 sm:h-14 sm:w-14 h-10 w-10 rounded-full hover:bg-accent z-50 group border-0 shadow-none"
        >
          <X
            className="sm:!h-8 !h-6 sm:!w-8 !w-6 group-hover:rotate-180 transition-all duration-400"
            strokeWidth={1.5}
          />
          <span className="sr-only">Fermer</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
