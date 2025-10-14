"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

// Wrapper pour gérer les props personnalisées
interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
}) => {
  // Classes de taille responsive - mobile first avec plus d'espace
  const sizeClasses = {
    sm: "w-full h-full sm:w-[90vw] sm:h-[90vh] sm:max-w-md sm:max-h-[90vh]",
    md: "w-full h-full sm:w-[90vw] sm:h-[90vh] sm:max-w-lg sm:max-h-[90vh]",
    lg: "w-full h-full sm:w-[90vw] sm:h-[90vh] sm:max-w-3xl sm:max-h-[90vh]",
    xl: "w-full h-full sm:w-[90vw] sm:h-[90vh] sm:max-w-5xl sm:max-h-[90vh]",
    full: "w-full h-full sm:w-[90vw] sm:h-[90vh] sm:max-w-[90vw] sm:max-h-[90vh]",
  };

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <ModalPortal>
        <ModalOverlay />
        <DialogPrimitive.Content
          className={`fixed inset-0 sm:left-[50%] sm:top-[50%] z-50 sm:translate-x-[-50%] sm:translate-y-[-50%] ${sizeClasses[size]} border-0 sm:border border-border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg flex flex-col overflow-hidden`}
        >
          {/* Header fixe */}
          {title && (
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
              {/* Bouton fermer */}
              <button
                type="button"
                onClick={onClose}
                className="absolute sm:right-2 sm:top-2 right-4 top-4 sm:h-12 sm:w-12 h-10 w-10 rounded-full hover:bg-accent z-50 group border-0 shadow-none opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-none focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground flex items-center justify-center"
              >
                <X
                  className="sm:!h-8 !h-6 sm:!w-8 !w-6 group-hover:rotate-180 transition-all duration-400"
                  strokeWidth={1.5}
                />
                <span className="sr-only">Fermer</span>
              </button>
            </ModalHeader>
          )}

          {/* Contenu avec scroll */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {children}
          </div>
        </DialogPrimitive.Content>
      </ModalPortal>
    </DialogPrimitive.Root>
  );
};

const Modal = ModalWrapper;

const ModalTrigger = DialogPrimitive.Trigger;

const ModalPortal = DialogPrimitive.Portal;

const ModalClose = DialogPrimitive.Close;

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className = "", ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ${className}`}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className = "", children, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={`fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border border-border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg ${className}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </ModalPortal>
));
ModalContent.displayName = DialogPrimitive.Content.displayName;

// Header fixe - ne scroll pas
const ModalHeader = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex flex-col space-y-1.5 p-4 sm:p-6 pb-4 border-b border-border flex-shrink-0 relative ${className}`}
    {...props}
  />
);
ModalHeader.displayName = "ModalHeader";

// Body scrollable - VRAIMENT scrollable cette fois
const ModalBody = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 min-h-0 ${className}`}
    {...props}
  />
);
ModalBody.displayName = "ModalBody";

// Footer fixe - ne scroll pas
const ModalFooter = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0 p-4 sm:p-6 pt-4 border-t border-border flex-shrink-0 ${className}`}
    {...props}
  />
);
ModalFooter.displayName = "ModalFooter";

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className = "", ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className = "", ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={`text-sm text-muted-foreground ${className}`}
    {...props}
  />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
};
