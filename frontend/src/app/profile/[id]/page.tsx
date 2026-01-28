'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    MapPin,
    Calendar,
    Github,
    Globe,
    Mail,
    ExternalLink,
    Edit,
    MessageSquare,
    Folder,
    Star,
    TrendingUp,
} from 'lucide-react';
import { TopNav, Footer } from '@/components/layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { ScoreBadge, TechBadge } from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import { CircularProgress } from '@/components/common/ProgressBar';
import Tabs, { TabContent } from '@/components/common/Tabs';

// Mock user data
const mockUser = {
    id: '1',
    displayName: 'Sarah Chen',
    email: 'sarah.chen@stanford.edu',
    photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'student' as const,
    bio: 'Computer Science student at Stanford with a passion for AI/ML and building innovative solutions. Love participating in hackathons and turning ideas into reality.',
    location: 'Stanford, CA',
    joinedDate: '2023-09-15',
    studentProfile: {
        college: 'Stanford University',
        graduationYear: 2025,
        githubUsername: 'sarahchen-dev',
    },
    stats: {
        projects: 5,
        avgScore: 88,
        requests: 12,
        views: 2340,
    },
    skills: ['Python', 'TensorFlow', 'React', 'Node.js', 'Machine Learning', 'FastAPI'],
    socialLinks: {
        github: 'https://github.com/sarahchen-dev',
        website: 'https://sarahchen.dev',
        linkedin: 'https://linkedin.com/in/sarahchen',
    },
};

// Mock projects
const mockProjects = [
    {
        id: '1',
        title: 'AI Resume Screener',
        description: 'ML-powered resume screening tool that reduces hiring time by 70%',
        score: 92,
        techStack: ['Python', 'TensorFlow', 'FastAPI'],
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    },
    {
        id: '2',
        title: 'HealthSync App',
        description: 'Wearable data aggregator with AI health insights',
        score: 85,
        techStack: ['React Native', 'Node.js', 'MongoDB'],
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
    },
    {
        id: '3',
        title: 'StudyBuddy AI',
        description: 'Personalized learning assistant using GPT-4',
        score: 91,
        techStack: ['Next.js', 'OpenAI', 'Prisma'],
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
    },
];

export default function ProfilePage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState('projects');
    const isOwnProfile = true; // In real app, check against current user

    const tabs = [
        { id: 'projects', label: `Projects (${mockProjects.length})` },
        { id: 'activity', label: 'Activity' },
    ];

    return (
        <div className="min-h-screen bg-slate-900">
            <TopNav />

            <main className="pt-16 pb-20">
                {/* Profile Header */}
                <div className="relative bg-gradient-to-r from-indigo-600/20 to-purple-600/20 h-48" />

                <div className="container mx-auto px-4 -mt-16 relative z-10">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar and Basic Info */}
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <Avatar
                                    src={mockUser.photoURL}
                                    name={mockUser.displayName}
                                    size="xl"
                                    className="w-32 h-32 ring-4 ring-slate-900"
                                />
                                <div className="absolute -bottom-2 -right-2">
                                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500 text-white capitalize">
                                        {mockUser.role}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white">{mockUser.displayName}</h1>
                                    <p className="text-white/60 mt-1">{mockUser.studentProfile?.college}</p>

                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/50">
                                        {mockUser.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" /> {mockUser.location}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" /> Class of {mockUser.studentProfile?.graduationYear}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" /> Joined {new Date(mockUser.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                {isOwnProfile ? (
                                    <Button variant="outline" leftIcon={<Edit className="w-4 h-4" />}>
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <Button leftIcon={<MessageSquare className="w-4 h-4" />}>
                                        Send Request
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-6 mt-8">
                        {/* Left Column - Stats & Info */}
                        <div className="space-y-6">
                            {/* Bio */}
                            {mockUser.bio && (
                                <Card>
                                    <h3 className="font-semibold text-white mb-3">About</h3>
                                    <p className="text-white/70 text-sm">{mockUser.bio}</p>
                                </Card>
                            )}

                            {/* Stats */}
                            <Card>
                                <h3 className="font-semibold text-white mb-4">Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60 flex items-center gap-2">
                                            <Folder className="w-4 h-4" /> Projects
                                        </span>
                                        <span className="font-bold text-white">{mockUser.stats.projects}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4" /> Avg Score
                                        </span>
                                        <span className="font-bold text-emerald-400">{mockUser.stats.avgScore}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" /> Requests
                                        </span>
                                        <span className="font-bold text-white">{mockUser.stats.requests}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60 flex items-center gap-2">
                                            <Star className="w-4 h-4" /> Views
                                        </span>
                                        <span className="font-bold text-white">{mockUser.stats.views.toLocaleString()}</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Skills */}
                            <Card>
                                <h3 className="font-semibold text-white mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {mockUser.skills.map(skill => (
                                        <TechBadge key={skill} name={skill} />
                                    ))}
                                </div>
                            </Card>

                            {/* Social Links */}
                            <Card>
                                <h3 className="font-semibold text-white mb-4">Links</h3>
                                <div className="space-y-3">
                                    {mockUser.socialLinks.github && (
                                        <a
                                            href={mockUser.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            <Github className="w-5 h-5 text-white" />
                                            <span className="text-white/80 flex-1">GitHub</span>
                                            <ExternalLink className="w-4 h-4 text-white/40" />
                                        </a>
                                    )}
                                    {mockUser.socialLinks.website && (
                                        <a
                                            href={mockUser.socialLinks.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            <Globe className="w-5 h-5 text-emerald-400" />
                                            <span className="text-white/80 flex-1">Website</span>
                                            <ExternalLink className="w-4 h-4 text-white/40" />
                                        </a>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Right Column - Content */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Overall Score */}
                            <Card className="flex items-center gap-6">
                                <CircularProgress value={mockUser.stats.avgScore} size={80} strokeWidth={6} />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Signal Score</h3>
                                    <p className="text-white/60 text-sm">Average score across all projects</p>
                                </div>
                            </Card>

                            {/* Tabs */}
                            <Tabs tabs={tabs} defaultTab="projects" onChange={setActiveTab} variant="underline" />

                            {/* Projects Tab */}
                            <TabContent value="projects" activeTab={activeTab}>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {mockProjects.map((project, index) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Card variant="glow" padding="none" className="overflow-hidden group">
                                                <div className="relative h-40">
                                                    <img
                                                        src={project.thumbnail}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50" />
                                                    <div className="absolute top-3 right-3">
                                                        <ScoreBadge score={project.score} size="sm" />
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-sm text-white/50 mt-1 line-clamp-2">{project.description}</p>
                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                        {project.techStack.slice(0, 3).map(tech => (
                                                            <TechBadge key={tech} name={tech} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </TabContent>

                            {/* Activity Tab */}
                            <TabContent value="activity" activeTab={activeTab}>
                                <Card>
                                    <div className="py-8 text-center">
                                        <p className="text-white/50">Activity feed coming soon...</p>
                                    </div>
                                </Card>
                            </TabContent>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
