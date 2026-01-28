'use client';

import { cn } from '@/lib/utils/helpers';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function Loader({ size = 'md', className }: LoaderProps) {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div
            className={cn(
                'rounded-full border-indigo-500/30 border-t-indigo-500 animate-spin',
                sizes[size],
                className
            )}
        />
    );
}

// Full page loader
export function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20" />
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
                </div>
                <p className="text-white/60 animate-pulse">Loading...</p>
            </div>
        </div>
    );
}

// Skeleton loader for content
interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className,
    variant = 'rectangular',
    width,
    height,
}: SkeletonProps) {
    const variants = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    return (
        <div
            className={cn(
                'skeleton bg-white/5 animate-pulse',
                variants[variant],
                className
            )}
            style={{ width, height }}
        />
    );
}

// Card skeleton
export function CardSkeleton() {
    return (
        <div className="glass p-6 space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton variant="circular" className="w-12 h-12" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-32" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
            </div>
        </div>
    );
}

// Stats skeleton
export function StatsSkeleton() {
    return (
        <div className="glass p-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
        </div>
    );
}

// Table row skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-white/5">
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1" />
            ))}
        </div>
    );
}
