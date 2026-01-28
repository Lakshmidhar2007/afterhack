'use client';

import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils/helpers';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function Avatar({
    src,
    alt = 'Avatar',
    name = '',
    size = 'md',
    className,
}: AvatarProps) {
    const sizes = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
    };

    const imageSizes = {
        xs: 24,
        sm: 32,
        md: 40,
        lg: 48,
        xl: 64,
    };

    const initials = getInitials(name);

    // Generate a consistent color based on name
    const getColor = () => {
        const colors = [
            'from-indigo-500 to-purple-500',
            'from-pink-500 to-rose-500',
            'from-emerald-500 to-teal-500',
            'from-orange-500 to-amber-500',
            'from-cyan-500 to-blue-500',
            'from-violet-500 to-purple-500',
        ];
        const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[index % colors.length];
    };

    if (src) {
        return (
            <div
                className={cn(
                    'relative rounded-full overflow-hidden bg-white/10',
                    sizes[size],
                    className
                )}
            >
                <Image
                    src={src}
                    alt={alt}
                    width={imageSizes[size]}
                    height={imageSizes[size]}
                    className="object-cover w-full h-full"
                />
            </div>
        );
    }

    return (
        <div
            className={cn(
                `flex items-center justify-center rounded-full font-semibold text-white bg-gradient-to-br ${getColor()}`,
                sizes[size],
                className
            )}
        >
            {initials}
        </div>
    );
}

// Avatar Group for displaying multiple avatars
interface AvatarGroupProps {
    avatars: Array<{ src?: string; name: string }>;
    max?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ avatars, max = 4, size = 'md' }: AvatarGroupProps) {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    const overlapSizes = {
        xs: '-ml-2',
        sm: '-ml-2.5',
        md: '-ml-3',
        lg: '-ml-4',
    };

    return (
        <div className="flex items-center">
            {visibleAvatars.map((avatar, index) => (
                <div
                    key={index}
                    className={cn(
                        'ring-2 ring-slate-900 rounded-full',
                        index > 0 && overlapSizes[size]
                    )}
                >
                    <Avatar
                        src={avatar.src}
                        name={avatar.name}
                        size={size}
                    />
                </div>
            ))}
            {remainingCount > 0 && (
                <div
                    className={cn(
                        'flex items-center justify-center rounded-full bg-white/10 text-white/80 font-medium ring-2 ring-slate-900',
                        overlapSizes[size],
                        size === 'xs' && 'w-6 h-6 text-[10px]',
                        size === 'sm' && 'w-8 h-8 text-xs',
                        size === 'md' && 'w-10 h-10 text-sm',
                        size === 'lg' && 'w-12 h-12 text-base'
                    )}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}
