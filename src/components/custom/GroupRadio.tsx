"use client";

import { Circle } from "lucide-react";
import * as React from "react";

interface GroupRadioProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const GroupRadio = React.forwardRef<HTMLDivElement, GroupRadioProps>(
  (
    {
      checked = false,
      className = "",
      disabled = false,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <div
        ref={ref}
        className={`
          grid place-content-center h-4 w-4 sm:h-[20px] sm:w-[20px] shrink-0 rounded-full border border-primary ring-offset-background
          ${
            checked
              ? "bg-primary text-primary-foreground"
              : "bg-background group-hover:border-primary/50"
          }
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          ${className}
        `}
        onClick={handleClick}
        {...props}
      >
        {checked && (
          <Circle className="h-2.5 w-2.5 fill-current text-current" />
        )}
      </div>
    );
  }
);

GroupRadio.displayName = "GroupRadio";

export { GroupRadio };
