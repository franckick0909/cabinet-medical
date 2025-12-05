import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-oswald tracking-wide transition-all duration-material-short2 ease-material-standard focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm md:text-base lg:text-lg uppercase text-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        filled:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        tonal:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outlined:
          "border-1 border-primary bg-background/50 text-primary",
        elevated:
          "border-transparent bg-surface-variant text-on-surface-variant",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        tertiary:
          "border-transparent bg-tertiary text-tertiary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        success:
          "border-transparent bg-success text-success-foreground ",
        warning:
          "border-transparent bg-warning text-warning-foreground ",
        info: "border-transparent bg-info text-info-foreground ",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

