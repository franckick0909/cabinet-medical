import { InputHTMLAttributes, forwardRef } from "react";

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className = "", ...props }, ref) => {
    return (
      <label className="flex items-start cursor-pointer group">
        <input
          ref={ref}
          type="radio"
          className={`
            w-5 h-5 mt-0.5 border-2 border-gray-300
            text-blue-600 
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
            transition-all duration-200
            cursor-pointer
            ${className}
          `}
          {...props}
        />
        <div className="ml-3 flex-1">
          <span className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {label}
          </span>
          {description && (
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </label>
    );
  }
);

Radio.displayName = "Radio";
