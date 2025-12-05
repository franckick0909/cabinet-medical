import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "filled" | "outlined";
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className = "",
      variant = "elevated",
      elevation = 1,
      interactive = false,
      ...props
    },
    ref
  ) => {
    // Classes de base Material Design 3 - Améliorées
    const baseClasses =
      "material-card rounded-lg transition-all duration-200 ease-out overflow-hidden" +
      (interactive
        ? " cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.99]"
        : "");

    // Classes par variant - Material Design 3 Améliorées
    const variantClasses = {
      elevated: "bg-surface text-on-surface border-0 shadow-sm",
      filled:
        "material-card-filled bg-primary-container text-on-primary-container border-0 shadow-xs hover:shadow-sm",
      outlined:
        "bg-surface text-on-surface border border-outline-variant hover:border-outline shadow-none",
    };

    // Classes d'élévation - Utilisation de shadow-elevation-*
    const elevationClasses = {
      0: "shadow-none",
      1: "shadow-elevation-1",
      2: "shadow-elevation-2",
      3: "shadow-elevation-3",
      4: "shadow-elevation-4",
      5: "shadow-elevation-5",
    };

    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      variant === "elevated" || variant === "filled"
        ? elevationClasses[elevation]
        : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <div ref={ref} className={combinedClasses} {...props} />;
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 border-b border-outline-variant/30 ${className}`}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => (
  <h3
    ref={ref}
    className={`title-large font-semibold text-on-surface leading-tight tracking-tight ${className}`}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => (
  <p
    ref={ref}
    className={`body-medium text-on-surface-variant leading-relaxed ${className}`}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 body-medium text-on-surface leading-relaxed ${className}`}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center justify-between gap-3 px-6 py-4 border-t border-outline-variant/30 bg-surface-variant/50 ${className}`}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
