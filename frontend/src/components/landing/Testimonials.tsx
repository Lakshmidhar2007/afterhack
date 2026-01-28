'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import Card from '@/components/common/Card';

const testimonials = [
    {
        id: 1,
        content: "AfterHack helped me land my dream internship at a YC startup. The founder found my hackathon project and reached out directly!",
        author: "Sarah Chen",
        role: "Computer Science, Stanford",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        type: "student",
    },
    {
        id: 2,
        content: "We've hired 3 amazing engineers through AfterHack. The signal scores really help us identify top talent quickly.",
        author: "Alex Rivera",
        role: "CTO, TechStart AI",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        type: "founder",
    },
    {
        id: 3,
        content: "The AI scoring gave us confidence that our project was production-ready. We got 5 intro requests within the first week!",
        author: "Priya Sharma",
        role: "Engineering, MIT",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        type: "student",
    },
    {
        id: 4,
        content: "AfterHack is the best place to find innovative student projects. We've found two potential acquisition targets here.",
        author: "Michael Zhang",
        role: "Partner, Innovation Ventures",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
        type: "founder",
    },
];

export default function Testimonials() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-slate-900" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5" />

            <div className="relative container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        What Our Community Says
                    </h2>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Join thousands of students and founders who are already connecting on AfterHack
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card
                                variant="hover"
                                className={`relative ${testimonial.type === 'founder'
                                        ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20'
                                        : ''
                                    }`}
                            >
                                {/* Quote Icon */}
                                <Quote className="absolute top-6 right-6 w-8 h-8 text-white/10" />

                                {/* Content */}
                                <p className="text-white/80 text-lg leading-relaxed mb-6 relative z-10">
                                    &ldquo;{testimonial.content}&rdquo;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        src={testimonial.avatar}
                                        name={testimonial.author}
                                        size="lg"
                                    />
                                    <div>
                                        <p className="font-semibold text-white">{testimonial.author}</p>
                                        <p className="text-sm text-white/50">{testimonial.role}</p>
                                    </div>
                                    {testimonial.type === 'founder' && (
                                        <span className="ml-auto px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                            Founder
                                        </span>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <p className="text-white/40 text-sm mb-6">Trusted by students from top universities</p>
                    <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
                        {['MIT', 'Stanford', 'Berkeley', 'Carnegie Mellon', 'Harvard', 'IIT'].map((uni) => (
                            <span key={uni} className="text-xl font-bold text-white/30">
                                {uni}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
