"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import * as React from "react";

interface GroupCheckboxProps {
  id?: string;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  type?: "checkbox" | "radio";
}

const GroupCheckbox = React.forwardRef<HTMLDivElement, GroupCheckboxProps>(
  (
    {
      checked = false,
      className = "",
      disabled = false,
      onCheckedChange,
      type = "checkbox",
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
          grid place-content-center h-5 w-5 shrink-0 border transition-all duration-200 ease-out
          ${type === "radio" ? "rounded-full" : "rounded-md"}
          ${
            checked
              ? "bg-[#2D5F4F] border-[#2D5F4F] text-white shadow-sm"
              : "bg-white border-gray-300 group-hover:border-[#2D5F4F] group-hover:bg-[#2D5F4F]/5"
          }
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          ${className}
        `}
        onClick={handleClick}
        {...props}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: "backOut" }}
          >
            {type === "radio" ? (
              <div className="h-2.5 w-2.5 rounded-full bg-white" />
            ) : (
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            )}
          </motion.div>
        )}
      </div>
    );
  }
);

GroupCheckbox.displayName = "GroupCheckbox";

export { GroupCheckbox };
