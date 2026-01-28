'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/helpers';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'hover' | 'glow';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    as?: 'div' | 'article' | 'section';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            variant = 'default',
            padding = 'md',
            as: Component = 'div',
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      bg-white/5 backdrop-blur-xl
      border border-white/10 rounded-2xl
      transition-all duration-300 ease-out
    `;

        const variants = {
            default: '',
            hover: `
        hover:bg-white/[0.08] hover:border-white/15
        hover:shadow-lg hover:shadow-indigo-500/5
        hover:-translate-y-1
        cursor-pointer
      `,
            glow: `
        hover:bg-white/[0.08] hover:border-white/15
        hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]
        hover:-translate-y-1
        cursor-pointer
      `,
        };

        const paddings = {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
        };

        return (
            <Component
                ref={ref as React.Ref<HTMLDivElement>}
                className={cn(baseStyles, variants[variant], paddings[padding], className)}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

Card.displayName = 'Card';

export default Card;
