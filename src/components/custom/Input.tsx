import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "outlined" | "filled";
  error?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      type,
      variant = "outlined",
      error = false,
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    // Classes de base Material Design 3
    const baseClasses =
      "body-large w-full transition-all duration-material-short4 ease-material-standard focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-38";

    // Classes par variant
    const variantClasses = {
      outlined: `material-input h-14 rounded-md border-2 bg-transparent px-4 py-4 ${
        error
          ? "border-destructive text-destructive focus:border-destructive focus:ring-1 focus:ring-destructive"
          : "border-gray-200 text-[#1a1a1a] placeholder:text-gray-400 focus:border-[#2D5F4F] focus:ring-1 focus:ring-[#2D5F4F]"
      }`,
      filled: `material-input-filled h-14 bg-surface-variant px-4 pt-6 pb-2 border-0 border-b-2 rounded-t-md rounded-b-none ${
        error
          ? "border-b-destructive text-destructive focus:border-b-destructive focus:ring-0"
          : "border-b-gray-200 text-[#1a1a1a] placeholder:text-gray-400 focus:border-b-[#2D5F4F] focus:ring-0"
      }`,
    };

    // Container pour les icônes
    if (startIcon || endIcon) {
      return (
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={`${baseClasses} ${variantClasses[variant]} ${
              startIcon ? "pl-12" : ""
            } ${endIcon ? "pr-12" : ""} ${className}`}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              {endIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
