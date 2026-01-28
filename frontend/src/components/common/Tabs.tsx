'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/helpers';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
    variant?: 'default' | 'pills' | 'underline';
    className?: string;
}

export default function Tabs({
    tabs,
    defaultTab,
    onChange,
    variant = 'default',
    className,
}: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    const baseTabStyles = `
    flex items-center gap-2 px-4 py-2.5 font-medium
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

    const variants = {
        default: {
            container: 'flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10',
            tab: 'rounded-lg text-white/60 hover:text-white',
            active: 'bg-white/10 text-white',
        },
        pills: {
            container: 'flex gap-2',
            tab: 'rounded-full text-white/60 hover:text-white hover:bg-white/5 border border-transparent',
            active: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent',
        },
        underline: {
            container: 'flex gap-6 border-b border-white/10',
            tab: 'pb-3 text-white/60 hover:text-white border-b-2 border-transparent -mb-px',
            active: 'text-white border-indigo-500',
        },
    };

    const currentVariant = variants[variant];

    return (
        <div className={cn(currentVariant.container, className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    disabled={tab.disabled}
                    className={cn(
                        baseTabStyles,
                        currentVariant.tab,
                        activeTab === tab.id && currentVariant.active
                    )}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

// Tab Content component
interface TabContentProps {
    children: React.ReactNode;
    value: string;
    activeTab: string;
}

export function TabContent({ children, value, activeTab }: TabContentProps) {
    if (value !== activeTab) return null;
    return <div className="animate-fade-in">{children}</div>;
}

// Controlled tabs hook
export function useTabsState(defaultTab: string) {
    const [activeTab, setActiveTab] = useState(defaultTab);
    return { activeTab, setActiveTab };
}
