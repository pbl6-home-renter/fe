import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer';

  const variantStyles = {
    primary:
      'bg-[#0056b3] text-white hover:bg-[#004494] active:scale-[0.99] shadow-sm',
    secondary:
      'bg-[#e8eeff] text-[#004591] hover:bg-[#d7e3ff] active:scale-[0.99]',
    outline:
      'border border-[#D7E3F2] bg-white text-[#4a607d] hover:bg-[#F8FBFE] hover:text-[#021b3d]',
    ghost:
      'text-[#4a607d] hover:text-[#021b3d] hover:bg-[#f1f3ff]',
    danger:
      'bg-[#ba1a1a] text-white hover:bg-[#93000a] active:scale-[0.99]',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

