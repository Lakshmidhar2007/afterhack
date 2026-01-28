'use client';

import { cn } from '@/lib/utils/helpers';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    className,
}: BadgeProps) {
    const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-full
    transition-colors duration-200
  `;

    const variants = {
        default: 'bg-white/10 text-white/80',
        primary: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
        secondary: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
        success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
        outline: 'bg-transparent text-white/80 border border-white/20',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    return (
        <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
            {children}
        </span>
    );
}

// Tech Stack Badge with specific colors
interface TechBadgeProps {
    name: string;
    color?: string;
}

export function TechBadge({ name, color }: TechBadgeProps) {
    return (
        <span
            className="inline-flex items-center px-2.5 py-1 text-sm font-medium rounded-full bg-white/10 text-white/90 border border-white/10 transition-all duration-200 hover:bg-white/15"
            style={color ? { borderColor: `${color}40`, backgroundColor: `${color}15` } : undefined}
        >
            {name}
        </span>
    );
}

// Score Badge with gradient based on score
interface ScoreBadgeProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
}

export function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
    const getScoreClass = () => {
        if (score >= 80) return 'score-excellent';
        if (score >= 60) return 'score-good';
        if (score >= 40) return 'score-average';
        return 'score-low';
    };

    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-base',
    };

    return (
        <div
            className={cn(
                'flex items-center justify-center rounded-full font-bold text-white shadow-lg',
                getScoreClass(),
                sizes[size]
            )}
        >
            {score}
        </div>
    );
}

// Status Badge
interface StatusBadgeProps {
    status: 'pending' | 'accepted' | 'rejected' | 'draft' | 'published' | 'archived';
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const statusConfig = {
        pending: { variant: 'warning' as const, label: 'Pending' },
        accepted: { variant: 'success' as const, label: 'Accepted' },
        rejected: { variant: 'danger' as const, label: 'Rejected' },
        draft: { variant: 'default' as const, label: 'Draft' },
        published: { variant: 'success' as const, label: 'Published' },
        archived: { variant: 'default' as const, label: 'Archived' },
    };

    const config = statusConfig[status];

    return (
        <Badge variant={config.variant} size="sm">
            {config.label}
        </Badge>
    );
}
