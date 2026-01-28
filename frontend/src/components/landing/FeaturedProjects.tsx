'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Github, Star } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import { TechBadge, ScoreBadge } from '@/components/common/Badge';
import Button from '@/components/common/Button';

// Sample featured projects
const featuredProjects = [
    {
        id: '1',
        title: 'AI Resume Screener',
        team: 'Team Innovate',
        description: 'ML-powered resume screening tool that reduces hiring time by 70%',
        techStack: ['Python', 'TensorFlow', 'FastAPI', 'React'],
        score: 92,
        stars: 245,
        domain: 'AI/ML',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop',
    },
    {
        id: '2',
        title: 'DeFi Portfolio Tracker',
        team: 'Crypto Builders',
        description: 'Real-time portfolio tracking across multiple blockchain networks',
        techStack: ['Next.js', 'TypeScript', 'Web3.js', 'Solidity'],
        score: 88,
        stars: 189,
        domain: 'Web3',
        thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=300&fit=crop',
    },
    {
        id: '3',
        title: 'HealthSync',
        team: 'MedTech Squad',
        description: 'Wearable data aggregator with AI health insights',
        techStack: ['React Native', 'Node.js', 'MongoDB', 'TensorFlow'],
        score: 85,
        stars: 156,
        domain: 'HealthTech',
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=300&fit=crop',
    },
    {
        id: '4',
        title: 'StudyBuddy AI',
        team: 'EduTech Wizards',
        description: 'Personalized learning assistant using GPT-4',
        techStack: ['Next.js', 'OpenAI', 'Prisma', 'PostgreSQL'],
        score: 91,
        stars: 312,
        domain: 'EdTech',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop',
    },
    {
        id: '5',
        title: 'GreenPath',
        team: 'Sustainability First',
        description: 'Carbon footprint tracker for sustainable lifestyle choices',
        techStack: ['Flutter', 'Firebase', 'Python', 'ML Kit'],
        score: 79,
        stars: 98,
        domain: 'Sustainability',
        thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop',
    },
];

export default function FeaturedProjects() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollXProgress } = useScroll({ container: containerRef });
    const opacity = useTransform(scrollXProgress, [0, 0.1], [0, 1]);

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-indigo-950/30 to-slate-900" />

            <div className="relative">
                {/* Section Header */}
                <div className="container mx-auto px-4 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                Featured Projects
                            </h2>
                            <p className="text-white/60">
                                Discover top-rated hackathon projects from talented builders
                            </p>
                        </div>
                        <Link href="/discover">
                            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                View All Projects
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Horizontal Scrolling Carousel */}
                <div
                    ref={containerRef}
                    className="flex gap-6 overflow-x-auto pb-4 px-4 md:px-8 snap-x snap-mandatory scrollbar-hide"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {featuredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex-shrink-0 w-[320px] md:w-[380px] snap-start"
                        >
                            <Link href={`/projects/${project.id}`}>
                                <Card variant="glow" padding="none" className="overflow-hidden group">
                                    {/* Thumbnail */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={project.thumbnail}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                                        {/* Score Badge */}
                                        <div className="absolute top-4 right-4">
                                            <ScoreBadge score={project.score} size="md" />
                                        </div>

                                        {/* Domain Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20">
                                                {project.domain}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-white/50 mb-3">{project.team}</p>
                                        <p className="text-sm text-white/60 mb-4 line-clamp-2">
                                            {project.description}
                                        </p>

                                        {/* Tech Stack */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.techStack.slice(0, 3).map((tech) => (
                                                <TechBadge key={tech} name={tech} />
                                            ))}
                                            {project.techStack.length > 3 && (
                                                <span className="text-xs text-white/40 self-center">
                                                    +{project.techStack.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-sm text-white/50">
                                            <div className="flex items-center gap-1">
                                                <Github className="w-4 h-4" />
                                                <span>View Code</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                <span>{project.stars}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    style={{ opacity }}
                    className="container mx-auto px-4 mt-6"
                >
                    <div className="flex items-center gap-2 justify-center text-white/40 text-sm">
                        <span>Scroll to explore</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
