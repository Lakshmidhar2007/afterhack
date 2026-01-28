'use client';

import { useEffect } from 'react';
import Button from '@/components/common/Button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            <div className="relative z-10 max-w-md w-full text-center p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">
                    Something went wrong!
                </h2>

                <p className="text-white/60 mb-8">
                    We encountered an unexpected error. Please try again or contact support if the problem persists.
                </p>

                <div className="flex justify-center gap-4">
                    <Button
                        onClick={() => reset()}
                        variant="primary"
                        leftIcon={<RefreshCw className="w-4 h-4" />}
                    >
                        Try again
                    </Button>
                    <Button
                        onClick={() => window.location.href = '/'}
                        variant="outline"
                    >
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
