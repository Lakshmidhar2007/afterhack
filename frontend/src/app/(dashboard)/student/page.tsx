'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Plus,
    Folder,
    Eye,
    TrendingUp,
    MessageSquare,
    ArrowUpRight,
    Clock,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { projectService } from '@/services/projectService';
import { requestService } from '@/services/requestService';
import { Project } from '@/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { ScoreBadge, TechBadge, StatusBadge } from '@/components/common/Badge';
import { CircularProgress } from '@/components/common/ProgressBar';
import Loader from '@/components/common/Loader';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [requestCount, setRequestCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.id) return;

        // Subscribe to requests count
        const unsubscribe = requestService.subscribeToReceivedRequests(user.id, (reqs) => {
            const pending = reqs.filter(r => r.status === 'pending').length;
            setRequestCount(pending);
        });

        async function fetchProjects() {
            if (user?.id) {
                try {
                    const { projects } = await projectService.getProjects({ userId: user.id });
                    setProjects(projects);
                } catch (error) {
                    console.error('Failed to fetch projects:', error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchProjects();

        return () => unsubscribe();
    }, [user]);

    const stats = [
        { label: 'Projects', value: projects.length, icon: Folder, color: 'text-indigo-400', href: '/student/projects' },
        { label: 'Avg Score', value: projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + (p.signalScore?.overall || 0), 0) / projects.length) : 0, icon: TrendingUp, color: 'text-emerald-400' },
        { label: 'Total Views', value: projects.reduce((acc, p) => acc + (p.views || 0), 0), icon: Eye, color: 'text-blue-400' },
        { label: 'Requests', value: requestCount, icon: MessageSquare, color: 'text-purple-400', href: '/requests' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Welcome Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8"
                >
                    <div className="relative z-10">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Welcome back, {user?.displayName?.split(' ')[0] || 'Builder'}! 👋
                        </h1>
                        <p className="text-white/80 max-w-lg">
                            Your projects have received {projects.reduce((acc, p) => acc + (p.views || 0), 0)} views this week. Keep building and showcasing your work!
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="/projects/upload">
                                <Button className="bg-white text-indigo-600 hover:bg-white/90" leftIcon={<Plus className="w-5 h-5" />}>
                                    New Project
                                </Button>
                            </Link>
                            <Link href="/discover">
                                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                    Explore Projects
                                </Button>
                            </Link>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/10 rounded-full blur-[40px]" />
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card variant="hover" className="relative overflow-hidden">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-white/60 mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50" />
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Projects Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">My Projects</h2>
                            <Link href="/student/projects" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                View all <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader size="lg" />
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                    >
                                        <Link href={`/projects/${project.id}`}>
                                            <Card variant="glow" padding="none" className="overflow-hidden group h-full">
                                                {/* Thumbnail */}
                                                <div className="relative h-32 overflow-hidden bg-slate-800">
                                                    {project.thumbnailUrl ? (
                                                        <img
                                                            src={project.thumbnailUrl}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white/20">
                                                            <Folder className="w-12 h-12" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent" />
                                                    {project.signalScore && (
                                                        <div className="absolute top-3 right-3">
                                                            <ScoreBadge score={project.signalScore.overall} size="sm" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-3 left-3">
                                                        <StatusBadge status={project.status} />
                                                    </div>
                                                </div>

                                                <div className="p-4">
                                                    <h3 className="font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors line-clamp-1">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-sm text-white/50 mb-3 line-clamp-1">{project.teamName}</p>

                                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                                        {project.techStack.slice(0, 3).map((tech) => (
                                                            <TechBadge key={tech} name={tech} />
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center gap-4 text-xs text-white/50">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-3.5 h-3.5" /> {project.views || 0}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageSquare className="w-3.5 h-3.5" /> 0
                                                        </span>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Add New Project Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Link href="/projects/upload">
                                        <Card variant="hover" className="h-full min-h-[250px] flex flex-col items-center justify-center border-dashed border-white/20 hover:border-indigo-500/50">
                                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-4">
                                                <Plus className="w-8 h-8 text-indigo-400" />
                                            </div>
                                            <p className="font-medium text-white mb-1">Add New Project</p>
                                            <p className="text-sm text-white/50">Upload your hackathon work</p>
                                        </Card>
                                    </Link>
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* Activity Feed and Score - Keeping generic for now */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                        <Card className="py-8 text-center">
                            <p className="text-white/50">No recent activity</p>
                        </Card>

                        {/* Score Overview */}
                        <Card>
                            <h3 className="font-semibold text-white mb-4">Overall Performance</h3>
                            {projects.length > 0 && projects[0].signalScore ? (
                                <>
                                    <div className="flex items-center justify-center py-4">
                                        <CircularProgress value={projects[0].signalScore.overall} size={100} strokeWidth={8} />
                                    </div>
                                    <div className="text-center mt-2">
                                        <p className="text-white/60 text-sm">Based on your latest project</p>
                                    </div>
                                </>
                            ) : (
                                <div className="py-8 text-center text-white/50">
                                    Upload a project to get your Signal Score
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
