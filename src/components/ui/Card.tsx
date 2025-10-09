import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  clickable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, clickable = false, className = '', children, ...props }, ref) => {
    const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200'
    const hoverStyles = hover ? 'hover:shadow-md hover:border-gray-300' : ''
    const clickableStyles = clickable ? 'cursor-pointer active:scale-[0.98]' : ''
    
    return (
      <div
        ref={ref}
        className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
