"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const progressVariants = cva("relative w-full overflow-hidden", {
  variants: {
    variant: {
      linear: "rounded-full bg-surface-variant",
      circular: "rounded-full bg-surface-variant",
    },
    size: {
      sm: "h-2",
      md: "h-4",
      lg: "h-6",
    },
  },
  defaultVariants: {
    variant: "linear",
    size: "md",
  },
});

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-material-medium2 ease-material-standard",
  {
    variants: {
      variant: {
        linear: "bg-primary rounded-full",
        circular: "bg-primary rounded-full",
      },
      animated: {
        true: "animate-material-pulse",
        false: "",
      },
    },
    defaultVariants: {
      variant: "linear",
      animated: false,
    },
  }
);

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  animated?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, size, animated, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ variant, size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        progressIndicatorVariants({ variant, animated: animated || false })
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
