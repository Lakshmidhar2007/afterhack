'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { STUDENT_NAV_ITEMS, FOUNDER_NAV_ITEMS } from '@/lib/utils/constants';
import { PageLoader } from '@/components/common/Loader';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/signin');
        }
    }, [loading, user, router]);

    if (loading) {
        return <PageLoader />;
    }

    if (!user) {
        // Show loader while redirecting
        return <PageLoader />;
    }

    const navItems = user.role === 'student' ? STUDENT_NAV_ITEMS : FOUNDER_NAV_ITEMS;

    return (
        <div className="min-h-screen bg-slate-900">
            <TopNav />
            <Sidebar items={navItems} />

            {/* Main Content */}
            <main className="relative z-10 pt-16 lg:pl-64 min-h-screen">
                <div className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
                    {children}
                </div>
            </main>

            {/* Background Grid */}
            <div className="fixed inset-0 bg-grid pointer-events-none opacity-50 z-0" />

            {/* Gradient Orbs */}
            <div className="fixed top-1/4 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] pointer-events-none z-0" />
            <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] pointer-events-none z-0" />
        </div>
    );
}
