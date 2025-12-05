import * as React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "outlined" | "filled";
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", variant = "outlined", error = false, ...props }, ref) => {
    // Classes de base Material Design 3
    const baseClasses =
      "body-large w-full min-h-[100px] transition-all duration-material-short4 ease-material-standard focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-38 resize-vertical";

    // Classes par variant
    const variantClasses = {
      outlined: `material-input rounded-md border-2 bg-transparent px-4 py-4 ${
        error
          ? "border-destructive text-destructive focus:border-destructive focus:ring-1 focus:ring-destructive"
          : "border-outline text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
      }`,
      filled: `material-input-filled bg-surface-variant px-4 pt-6 pb-2 border-0 border-b-2 rounded-t-md rounded-b-none ${
        error
          ? "border-b-destructive text-destructive focus:border-b-destructive focus:ring-0"
          : "border-b-outline text-on-surface placeholder:text-on-surface-variant focus:border-b-primary focus:ring-0"
      }`,
    };

    return (
      <textarea
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
