import { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = "", ...props }, ref) => {
    return (
      <label className="flex items-start cursor-pointer group">
        <input
          ref={ref}
          type="checkbox"
          className={`
            w-4 h-4 sm:w-5 sm:h-5 mt-0.5 rounded border-2 border-gray-300
            text-blue-600 
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
            transition-all duration-200
            cursor-pointer flex-shrink-0
            ${className}
          `}
          {...props}
        />
        <div className="ml-2 sm:ml-3 flex-1">
          <span className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {label}
          </span>
          {description && (
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
