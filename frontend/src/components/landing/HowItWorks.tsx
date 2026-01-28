'use client';

import { motion } from 'framer-motion';
import { Upload, Brain, Handshake } from 'lucide-react';
import Card from '@/components/common/Card';

const steps = [
    {
        icon: <Upload className="w-8 h-8" />,
        title: 'Upload Your Project',
        description: 'Share your hackathon project with demo videos, GitHub repo, and tech stack details.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: <Brain className="w-8 h-8" />,
        title: 'Get AI-Powered Score',
        description: 'Our AI analyzes your GitHub activity, code quality, and project potential.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: <Handshake className="w-8 h-8" />,
        title: 'Connect with Founders',
        description: 'Receive collaboration requests from founders and recruiters interested in your work.',
        color: 'from-emerald-500 to-teal-500',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-900/50" />

            <div className="relative container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Three simple steps to turn your hackathon project into real opportunities
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                        >
                            <Card variant="hover" className="h-full text-center group">
                                {/* Step Number */}
                                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-bold">
                                    {index + 1}
                                </div>

                                {/* Icon */}
                                <div
                                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                                >
                                    {step.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-white/60">
                                    {step.description}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Connecting Lines (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-px">
                    <div className="absolute left-[16%] top-0 w-[34%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="absolute right-[16%] top-0 w-[34%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
            </div>
        </section>
    );
}
