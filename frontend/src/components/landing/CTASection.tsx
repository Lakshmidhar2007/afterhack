'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';
import Button from '@/components/common/Button';

export default function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600" />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-grid opacity-10" />

            {/* Animated Gradient Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[100px]"
            />

            <div className="relative container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    {/* Icon */}
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-8"
                    >
                        <Rocket className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Showcase Your Work?
                    </h2>

                    {/* Description */}
                    <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
                        Join thousands of student builders who have already connected with founders and landed opportunities through AfterHack.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/signup">
                            <Button
                                size="lg"
                                className="bg-white text-indigo-600 hover:bg-white/90 hover:shadow-xl"
                                rightIcon={<ArrowRight className="w-5 h-5" />}
                            >
                                Get Started Free
                            </Button>
                        </Link>
                        <Link href="/discover">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/30 text-white hover:bg-white/10"
                            >
                                Explore Projects
                            </Button>
                        </Link>
                    </div>

                    {/* Subtext */}
                    <p className="mt-6 text-sm text-white/60">
                        No credit card required • Free forever for students
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
