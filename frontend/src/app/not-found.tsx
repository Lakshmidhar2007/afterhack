'use client';

import Link from 'next/link';
import Button from '@/components/common/Button';
import { Home, AlertTriangle } from 'lucide-react';
import Card from '@/components/common/Card';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-lg w-full text-center">
                <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl opacity-20 animate-pulse" />
                    <h1 className="relative text-9xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        404
                    </h1>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Page Not Found
                </h2>

                <p className="text-white/60 mb-8 text-lg">
                    Oops! The page you're looking for seems to have wandered off into the void.
                </p>

                <div className="flex justify-center gap-4">
                    <Link href="/">
                        <Button leftIcon={<Home className="w-5 h-5" />} size="lg">
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
