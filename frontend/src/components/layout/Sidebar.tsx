'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Folder,
    Compass,
    MessageSquare,
    Settings,
    Search,
    Send,
    Bookmark,
    ChevronLeft,
    ChevronRight,
    Plus,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/helpers';

const iconMap: Record<string, React.ReactNode> = {
    LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
    Folder: <Folder className="w-5 h-5" />,
    Compass: <Compass className="w-5 h-5" />,
    MessageSquare: <MessageSquare className="w-5 h-5" />,
    Settings: <Settings className="w-5 h-5" />,
    Search: <Search className="w-5 h-5" />,
    Send: <Send className="w-5 h-5" />,
    Bookmark: <Bookmark className="w-5 h-5" />,
};

interface SidebarProps {
    items: Array<{
        name: string;
        href: string;
        icon: string;
    }>;
}

export default function Sidebar({ items }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 256 }}
                className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 z-40"
            >
                {/* Collapse Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-6 w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {items.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const Icon = iconMap[item.icon] || <Folder className="w-5 h-5" />;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                                    isActive
                                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                )}
                            >
                                <span className={cn(isActive && 'text-indigo-400')}>{Icon}</span>
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </nav>

                {/* Quick Action */}
                {user?.role === 'student' && (
                    <div className="p-3 border-t border-white/10">
                        <Link
                            href="/projects/upload"
                            className={cn(
                                'flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25',
                                isCollapsed ? 'px-3' : 'px-4'
                            )}
                        >
                            <Plus className="w-5 h-5" />
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="whitespace-nowrap overflow-hidden"
                                    >
                                        New Project
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    </div>
                )}
            </motion.aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-white/10">
                <div className="flex items-center justify-around px-2 py-2">
                    {items.slice(0, 5).map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const Icon = iconMap[item.icon] || <Folder className="w-5 h-5" />;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors',
                                    isActive
                                        ? 'text-indigo-400'
                                        : 'text-white/60 hover:text-white'
                                )}
                            >
                                {Icon}
                                <span className="text-[10px] font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
