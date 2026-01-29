'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Menu,
    X,
    Search,
    User,
    Settings,
    LogOut,
    ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils/helpers';
import SearchBar from '@/components/common/SearchBar';

export default function TopNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    const publicLinks = [
        { href: '/', label: 'Home' },
        { href: '/discover', label: 'Discover' },
        { href: '/about', label: 'About' },
    ];

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            {/* Glass background */}
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl border-b border-white/10" />

            <div className="relative container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">AH</span>
                        </div>
                        <span className="text-xl font-bold text-white">AfterHack</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {publicLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-sm font-medium transition-colors',
                                    pathname === link.href
                                        ? 'text-white'
                                        : 'text-white/60 hover:text-white'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {user ? (
                            <>
                                {/* Notifications */}
                                <button className="relative p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <Avatar
                                            src={user.photoURL}
                                            name={user.displayName}
                                            size="sm"
                                        />
                                        <ChevronDown
                                            className={cn(
                                                'w-4 h-4 text-white/60 transition-transform',
                                                isProfileOpen && 'rotate-180'
                                            )}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-56 py-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl"
                                            >
                                                <div className="px-4 py-2 border-b border-white/10">
                                                    <p className="text-sm font-medium text-white">
                                                        {user.displayName}
                                                    </p>
                                                    <p className="text-xs text-white/60">{user.email}</p>
                                                </div>
                                                <div className="py-1">
                                                    <Link
                                                        href={`/profile/${user.id}`}
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        <User className="w-4 h-4" />
                                                        View Profile
                                                    </Link>
                                                    <Link
                                                        href="/settings"
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        Settings
                                                    </Link>
                                                </div>
                                                <div className="border-t border-white/10 pt-1">
                                                    <button
                                                        onClick={handleSignOut}
                                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <Link href="/signin">
                                    <Button variant="ghost" size="sm">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant="primary" size="sm">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10"
                    >
                        <div className="container mx-auto px-4 py-4 space-y-2">
                            {publicLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'block px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                        pathname === link.href
                                            ? 'bg-white/10 text-white'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    )}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {!user && (
                                <div className="pt-4 border-t border-white/10 space-y-2">
                                    <Link href="/signin" className="block">
                                        <Button variant="outline" className="w-full">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/signup" className="block">
                                        <Button variant="primary" className="w-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="relative w-full max-w-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                                <SearchBar
                                    placeholder="Ask anything about cybersecurity, courses, or projects..."
                                    className="border-none bg-transparent"
                                    autoFocus={true}
                                    onSearch={(val: string) => {
                                        console.log('Searching for:', val);
                                    }}
                                />
                                <div className="px-4 py-2 bg-black/20 flex justify-between items-center text-[10px] text-white/40 border-t border-white/5">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">ESC</kbd>
                                            to close
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↵</kbd>
                                            to search
                                        </span>
                                    </div>
                                    <span className="italic">Powered by Claude 3.5 Sonnet</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
