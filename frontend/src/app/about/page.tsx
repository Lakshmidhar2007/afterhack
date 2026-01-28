'use client';

import { TopNav, Footer } from '@/components/layout';
import { HowItWorks, Testimonials } from '@/components/landing';
import { motion } from 'framer-motion';
import { Target, Users, Zap, Heart, Globe, Award } from 'lucide-react';
import Card from '@/components/common/Card';

const values = [
    {
        icon: Target,
        title: 'Project-First Discovery',
        description: 'We believe great projects deserve visibility. Our AI-powered scoring helps the best work rise to the top.',
    },
    {
        icon: Users,
        title: 'Community Driven',
        description: 'Built by builders, for builders. Join a community of students and founders who believe in innovation.',
    },
    {
        icon: Zap,
        title: 'Real Opportunities',
        description: 'Transform hackathon projects into internships, jobs, and startup opportunities with real companies.',
    },
    {
        icon: Heart,
        title: 'Student Success',
        description: 'Our mission is to help every talented student get discovered and kickstart their career.',
    },
];

const stats = [
    { label: 'Universities', value: '50+', icon: Globe },
    { label: 'Projects Scored', value: '2,500+', icon: Award },
    { label: 'Founders Connected', value: '850+', icon: Users },
    { label: 'Students Hired', value: '320+', icon: Zap },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-900">
            <TopNav />

            <main className="pt-20">
                {/* Hero Section - More breathing room */}
                <section className="relative py-24 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-slate-900" />
                    <div className="absolute inset-0 bg-grid opacity-30" />

                    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                        >
                            About <span className="gradient-text">AfterHack</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed"
                        >
                            We&apos;re on a mission to connect talented student builders with founders
                            and recruiters who want to hire them. Because great projects deserve
                            to be discovered.
                        </motion.p>
                    </div>
                </section>

                {/* Our Values - Better spacing and card layout */}
                <section className="py-20 md:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Our Values
                            </h2>
                            <p className="text-white/60 max-w-2xl mx-auto text-lg">
                                Everything we do is guided by these core principles
                            </p>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="h-full text-center p-6 lg:p-8">
                                        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                            <value.icon className="w-8 h-8 text-indigo-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-3">
                                            {value.title}
                                        </h3>
                                        <p className="text-white/60 text-sm leading-relaxed">
                                            {value.description}
                                        </p>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section - Better visual hierarchy */}
                <section className="py-20 md:py-24 bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Our Impact
                            </h2>
                            <p className="text-white/60 max-w-2xl mx-auto">
                                Connecting students with opportunities that matter
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                        <stat.icon className="w-7 h-7 text-indigo-400" />
                                    </div>
                                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-white/50 text-base">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="container mx-auto px-4">
                    <div className="border-t border-white/10" />
                </div>

                {/* How It Works */}
                <HowItWorks />

                {/* Testimonials */}
                <Testimonials />
            </main>

            <Footer />
        </div>
    );
}
