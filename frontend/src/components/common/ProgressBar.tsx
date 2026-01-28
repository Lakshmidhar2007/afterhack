'use client';

import { cn } from '@/lib/utils/helpers';

interface ProgressBarProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    variant?: 'default' | 'gradient' | 'score';
    className?: string;
}

export default function ProgressBar({
    value,
    max = 100,
    size = 'md',
    showLabel = false,
    variant = 'default',
    className,
}: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizes = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    const getScoreColor = () => {
        if (percentage >= 80) return 'from-emerald-500 to-emerald-400';
        if (percentage >= 60) return 'from-yellow-500 to-yellow-400';
        if (percentage >= 40) return 'from-orange-500 to-orange-400';
        return 'from-red-500 to-red-400';
    };

    const variants = {
        default: 'bg-indigo-500',
        gradient: 'bg-gradient-to-r from-indigo-500 to-purple-500',
        score: `bg-gradient-to-r ${getScoreColor()}`,
    };

    return (
        <div className={cn('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between mb-1 text-sm">
                    <span className="text-white/60">Progress</span>
                    <span className="text-white font-medium">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={cn('w-full bg-white/10 rounded-full overflow-hidden', sizes[size])}>
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500 ease-out',
                        variants[variant]
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// Circular progress for scores
interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    showValue?: boolean;
    className?: string;
}

export function CircularProgress({
    value,
    max = 100,
    size = 60,
    strokeWidth = 4,
    showValue = true,
    className,
}: CircularProgressProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage >= 80) return '#10b981';
        if (percentage >= 60) return '#eab308';
        if (percentage >= 40) return '#f97316';
        return '#ef4444';
    };

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 ease-out"
                />
            </svg>
            {showValue && (
                <span
                    className="absolute text-white font-bold"
                    style={{ fontSize: size / 4 }}
                >
                    {Math.round(value)}
                </span>
            )}
        </div>
    );
}

// Step progress for wizards
interface StepProgressProps {
    steps: string[];
    currentStep: number;
    className?: string;
}

export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
    return (
        <div className={cn('flex items-center justify-between', className)}>
            {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div
                            className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300',
                                index < currentStep
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                    : index === currentStep
                                        ? 'bg-indigo-500/20 text-indigo-400 border-2 border-indigo-500'
                                        : 'bg-white/5 text-white/40 border border-white/10'
                            )}
                        >
                            {index < currentStep ? '✓' : index + 1}
                        </div>
                        <span
                            className={cn(
                                'mt-2 text-xs font-medium',
                                index <= currentStep ? 'text-white' : 'text-white/40'
                            )}
                        >
                            {step}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={cn(
                                'w-12 h-0.5 mx-2 mb-6',
                                index < currentStep ? 'bg-indigo-500' : 'bg-white/10'
                            )}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
