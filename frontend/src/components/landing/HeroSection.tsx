'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Trophy } from 'lucide-react';
import Button from '@/components/common/Button';

export default function HeroSection() {
    const [stats, setStats] = useState({ projects: 0, students: 0, opportunities: 0 });
    const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);

    // Generate particles client-side only to avoid hydration mismatch
    useEffect(() => {
        const generatedParticles = [...Array(20)].map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
        }));
        setParticles(generatedParticles);
    }, []);

    // Animated counter
    useEffect(() => {
        const targets = { projects: 2500, students: 10000, opportunities: 850 };
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setStats({
                projects: Math.floor(targets.projects * progress),
                students: Math.floor(targets.students * progress),
                opportunities: Math.floor(targets.opportunities * progress),
            });
            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-grid opacity-30" />

            {/* Floating Gradient Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[128px]"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[128px]"
            />

            {/* Floating Particles - generated client-side to avoid hydration mismatch */}
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                    }}
                />
            ))}

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
                >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-white/80">Now with AI-Powered Scoring</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl mx-auto leading-tight"
                >
                    Where Hackathon Projects{' '}
                    <span className="gradient-text">Meet Real Opportunities</span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto"
                >
                    Connect builders with founders. Turn code into careers.
                    Get your hackathon project discovered by people who matter.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/signup?role=student">
                        <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                            Get Started as Student
                        </Button>
                    </Link>
                    <Link href="/signup?role=founder">
                        <Button variant="secondary" size="lg">
                            I&apos;m a Founder
                        </Button>
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                >
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-bold text-white">
                            <Trophy className="w-6 h-6 text-yellow-400" />
                            {stats.projects.toLocaleString()}+
                        </div>
                        <div className="mt-1 text-sm text-white/50">Projects</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-bold text-white">
                            <Users className="w-6 h-6 text-indigo-400" />
                            {stats.students.toLocaleString()}+
                        </div>
                        <div className="mt-1 text-sm text-white/50">Students</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-bold text-white">
                            <Sparkles className="w-6 h-6 text-emerald-400" />
                            {stats.opportunities.toLocaleString()}+
                        </div>
                        <div className="mt-1 text-sm text-white/50">Opportunities</div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1 h-2 bg-white/60 rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
}
