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
      inline-flex items-center justify-center gap-2.5 font-semibold
      rounded-xl transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-[0.97]
    `;

        const variants = {
            primary: `
        bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] text-white
        shadow-lg shadow-indigo-500/25
        hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 hover:bg-[100%_0]
        focus-visible:ring-indigo-500
      `,
            secondary: `
        bg-white/10 text-white border border-white/20
        hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5
        focus-visible:ring-white/50
      `,
            outline: `
        bg-transparent text-white border-2 border-white/25
        hover:bg-white/10 hover:border-white/40 hover:-translate-y-0.5
        focus-visible:ring-white/50
      `,
            ghost: `
        bg-transparent text-white
        hover:bg-white/10
        focus-visible:ring-white/50
      `,
            danger: `
        bg-red-500/20 text-red-400 border border-red-500/30
        hover:bg-red-500/30 hover:border-red-500/50 hover:-translate-y-0.5
        focus-visible:ring-red-500
      `,
        };

        const sizes = {
            sm: 'h-10 px-4 text-sm',
            md: 'h-12 px-6 text-base',
            lg: 'h-14 px-8 text-lg',
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
