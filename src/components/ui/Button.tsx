import * as React from "react";

// Fonction utilitaire simple pour combiner les classes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cn(...inputs: any[]): string {
  return inputs
    .filter(Boolean)
    .map(input => {
      if (typeof input === 'string') return input;
      if (typeof input === 'object' && input !== null) {
        return Object.entries(input)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .join(' ');
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = asChild; // Supprimer l'avertissement pour asChild non utilisé
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            // Variants
            "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary": variant === "default",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive": variant === "destructive",
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring": variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary": variant === "secondary",
            "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring": variant === "ghost",
            "text-primary underline-offset-4 hover:underline focus-visible:ring-ring": variant === "link",
          },
          {
            // Sizes
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Export pour compatibilité avec shadcn/ui
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const buttonVariants = (props?: any) => {
  return "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
};

export { Button };
