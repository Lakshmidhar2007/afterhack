'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/helpers';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      inline-flex items-center justify-center gap-2 font-medium
      rounded-xl transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-[0.98]
    `;

        const variants = {
            primary: `
        bg-gradient-to-r from-indigo-500 to-purple-500 text-white
        hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-0.5
        focus-visible:ring-indigo-500
      `,
            secondary: `
        bg-white/10 text-white border border-white/20
        hover:bg-white/15 hover:border-white/30
        focus-visible:ring-white/50
      `,
            outline: `
        bg-transparent text-white border border-white/20
        hover:bg-white/5 hover:border-white/30
        focus-visible:ring-white/50
      `,
            ghost: `
        bg-transparent text-white
        hover:bg-white/10
        focus-visible:ring-white/50
      `,
            danger: `
        bg-red-500/20 text-red-400 border border-red-500/30
        hover:bg-red-500/30 hover:border-red-500/50
        focus-visible:ring-red-500
      `,
        };

        const sizes = {
            sm: 'h-9 px-3 text-sm',
            md: 'h-11 px-5 text-base',
            lg: 'h-13 px-7 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    leftIcon
                )}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
