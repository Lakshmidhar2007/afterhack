'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Github,
    Globe,
    Youtube,
    Star,
    Eye,
    Calendar,
    Users,
    Send,
    Bookmark,
    BookmarkCheck,
    Share2,
    ExternalLink,
    Code,
    Activity,
    Target,
    Zap,
    Award,
} from 'lucide-react';
import { TopNav, Footer } from '@/components/layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { ScoreBadge, TechBadge, StatusBadge } from '@/components/common/Badge';
import Avatar, { AvatarGroup } from '@/components/common/Avatar';
import { CircularProgress } from '@/components/common/ProgressBar';
import Tabs, { TabContent } from '@/components/common/Tabs';

// Mock project data
const mockProject = {
    id: '1',
    title: 'AI Resume Screener',
    team: 'Team Innovate',
    description: `AI Resume Screener is a machine learning-powered application that revolutionizes the hiring process by automating resume screening. It reduces hiring time by 70% while maintaining high accuracy in candidate matching.

The system uses advanced NLP techniques to analyze resumes, extract key information, and match candidates with job requirements. It learns from feedback to continuously improve its recommendations.

Key Features:
• Automated resume parsing and data extraction
• AI-powered skill matching and scoring
• Bias detection and mitigation
• Integration with popular ATS systems
• Real-time analytics dashboard`,
    techStack: ['Python', 'TensorFlow', 'FastAPI', 'React', 'PostgreSQL', 'Docker'],
    domain: 'AI/ML',
    hackathon: 'TechCrunch Disrupt Hackathon 2024',
    score: 92,
    status: 'published',
    views: 1234,
    stars: 245,
    trl: 6,
    createdAt: '2024-01-15',
    githubUrl: 'https://github.com/team-innovate/ai-resume-screener',
    demoUrl: 'https://ai-resume-demo.vercel.app',
    videoUrl: 'https://youtube.com/watch?v=example',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
    screenshots: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop',
    ],
    teamMembers: [
        { name: 'Sarah Chen', role: 'ML Engineer', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { name: 'Alex Rivera', role: 'Backend Developer', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { name: 'Priya Sharma', role: 'Frontend Developer', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    ],
    signalScore: {
        overall: 92,
        codeQuality: 88,
        activity: 95,
        documentation: 90,
        innovation: 94,
        completeness: 89,
    },
};

export default function ProjectDetailsPage() {
    const params = useParams();
    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [requestModal, setRequestModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'score', label: 'Signal Score' },
        { id: 'team', label: 'Team' },
    ];

    return (
        <div className="min-h-screen bg-slate-900">
            <TopNav />

            <main className="pt-16">
                {/* Hero Banner */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                    <img
                        src={mockProject.thumbnail}
                        alt={mockProject.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                    {/* Back Button */}
                    <Link
                        href="/discover"
                        className="absolute top-4 left-4 md:top-8 md:left-8 p-2 rounded-lg bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>

                <div className="container mx-auto px-4 -mt-20 relative z-10">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Project Header */}
                            <Card>
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                                {mockProject.domain}
                                            </span>
                                            <StatusBadge status="published" />
                                        </div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                            {mockProject.title}
                                        </h1>
                                        <p className="text-white/60">by {mockProject.team}</p>

                                        {/* Stats */}
                                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/50">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" /> {mockProject.views.toLocaleString()} views
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400" /> {mockProject.stars}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" /> {new Date(mockProject.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" /> {mockProject.teamMembers.length} members
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <ScoreBadge score={mockProject.score} size="lg" />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10">
                                    <Button onClick={() => setRequestModal(true)} leftIcon={<Send className="w-4 h-4" />}>
                                        Request Intro
                                    </Button>
                                    <Button
                                        variant={isSaved ? 'secondary' : 'outline'}
                                        onClick={() => setIsSaved(!isSaved)}
                                        leftIcon={isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                                    >
                                        {isSaved ? 'Saved' : 'Save'}
                                    </Button>
                                    <Button variant="outline" leftIcon={<Share2 className="w-4 h-4" />}>
                                        Share
                                    </Button>
                                </div>
                            </Card>

                            {/* Tabs */}
                            <Tabs tabs={tabs} defaultTab="overview" onChange={setActiveTab} variant="underline" />

                            {/* Overview Tab */}
                            <TabContent value="overview" activeTab={activeTab}>
                                <div className="space-y-6">
                                    {/* Description */}
                                    <Card>
                                        <h2 className="text-lg font-semibold text-white mb-4">About the Project</h2>
                                        <div className="prose prose-invert max-w-none">
                                            <p className="text-white/70 whitespace-pre-line">{mockProject.description}</p>
                                        </div>
                                    </Card>

                                    {/* Tech Stack */}
                                    <Card>
                                        <h2 className="text-lg font-semibold text-white mb-4">Tech Stack</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {mockProject.techStack.map(tech => (
                                                <TechBadge key={tech} name={tech} />
                                            ))}
                                        </div>
                                    </Card>

                                    {/* Screenshots */}
                                    {mockProject.screenshots.length > 0 && (
                                        <Card>
                                            <h2 className="text-lg font-semibold text-white mb-4">Screenshots</h2>
                                            <div className="grid grid-cols-3 gap-3">
                                                {mockProject.screenshots.map((screenshot, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSelectedImage(screenshot)}
                                                        className="aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all"
                                                    >
                                                        <img
                                                            src={screenshot}
                                                            alt={`Screenshot ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            </TabContent>

                            {/* Score Tab */}
                            <TabContent value="score" activeTab={activeTab}>
                                <Card>
                                    <div className="flex items-center gap-4 mb-8">
                                        <CircularProgress value={mockProject.signalScore.overall} size={100} strokeWidth={8} />
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Signal Score</h2>
                                            <p className="text-white/60">AI-analyzed project quality metrics</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {[
                                            { key: 'codeQuality', label: 'Code Quality', icon: Code, color: 'from-blue-500 to-cyan-500' },
                                            { key: 'activity', label: 'GitHub Activity', icon: Activity, color: 'from-green-500 to-emerald-500' },
                                            { key: 'documentation', label: 'Documentation', icon: Target, color: 'from-purple-500 to-pink-500' },
                                            { key: 'innovation', label: 'Innovation', icon: Zap, color: 'from-yellow-500 to-orange-500' },
                                            { key: 'completeness', label: 'Completeness', icon: Award, color: 'from-indigo-500 to-violet-500' },
                                        ].map(metric => (
                                            <div key={metric.key} className="p-4 bg-white/5 rounded-xl">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color} bg-opacity-20`}>
                                                            <metric.icon className="w-4 h-4 text-white" />
                                                        </div>
                                                        <span className="font-medium text-white">{metric.label}</span>
                                                    </div>
                                                    <span className="text-xl font-bold text-white">
                                                        {mockProject.signalScore[metric.key as keyof typeof mockProject.signalScore]}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${mockProject.signalScore[metric.key as keyof typeof mockProject.signalScore]}%` }}
                                                        transition={{ duration: 1, delay: 0.2 }}
                                                        className={`h-full bg-gradient-to-r ${metric.color}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                        <p className="text-sm text-white/70">
                                            <strong className="text-white">How is this calculated?</strong> Our AI analyzes GitHub activity, code quality, documentation, and more to generate an objective Signal Score.
                                        </p>
                                    </div>
                                </Card>
                            </TabContent>

                            {/* Team Tab */}
                            <TabContent value="team" activeTab={activeTab}>
                                <Card>
                                    <h2 className="text-lg font-semibold text-white mb-6">Team Members</h2>
                                    <div className="space-y-4">
                                        {mockProject.teamMembers.map((member, index) => (
                                            <motion.div
                                                key={member.name}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
                                            >
                                                <Avatar src={member.avatar} name={member.name} size="lg" />
                                                <div>
                                                    <p className="font-semibold text-white">{member.name}</p>
                                                    <p className="text-sm text-white/60">{member.role}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>
                            </TabContent>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Links Card */}
                            <Card>
                                <h3 className="font-semibold text-white mb-4">Project Links</h3>
                                <div className="space-y-3">
                                    <a
                                        href={mockProject.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <Github className="w-5 h-5 text-white" />
                                        <span className="text-white flex-1">View on GitHub</span>
                                        <ExternalLink className="w-4 h-4 text-white/40" />
                                    </a>
                                    {mockProject.demoUrl && (
                                        <a
                                            href={mockProject.demoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <Globe className="w-5 h-5 text-emerald-400" />
                                            <span className="text-white flex-1">Live Demo</span>
                                            <ExternalLink className="w-4 h-4 text-white/40" />
                                        </a>
                                    )}
                                    {mockProject.videoUrl && (
                                        <a
                                            href={mockProject.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <Youtube className="w-5 h-5 text-red-400" />
                                            <span className="text-white flex-1">Watch Video</span>
                                            <ExternalLink className="w-4 h-4 text-white/40" />
                                        </a>
                                    )}
                                </div>
                            </Card>

                            {/* Hackathon Info */}
                            {mockProject.hackathon && (
                                <Card>
                                    <h3 className="font-semibold text-white mb-3">Hackathon</h3>
                                    <div className="flex items-center gap-3 p-3 bg-indigo-500/10 rounded-lg">
                                        <Award className="w-5 h-5 text-indigo-400" />
                                        <span className="text-white text-sm">{mockProject.hackathon}</span>
                                    </div>
                                </Card>
                            )}

                            {/* TRL Level */}
                            <Card>
                                <h3 className="font-semibold text-white mb-3">Technology Readiness</h3>
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${mockProject.trl >= 7 ? 'bg-emerald-500/20 text-emerald-400' :
                                            mockProject.trl >= 4 ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                        }`}>
                                        {mockProject.trl}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">TRL {mockProject.trl}</p>
                                        <p className="text-sm text-white/50">
                                            {mockProject.trl >= 7 ? 'Production Ready' :
                                                mockProject.trl >= 4 ? 'Prototype Phase' :
                                                    'Early Development'}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Team Summary */}
                            <Card>
                                <h3 className="font-semibold text-white mb-4">Team</h3>
                                <AvatarGroup
                                    users={mockProject.teamMembers.map(m => ({
                                        name: m.name,
                                        src: m.avatar,
                                    }))}
                                    max={5}
                                />
                                <p className="text-sm text-white/60 mt-3">
                                    {mockProject.teamMembers.length} team members
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <div className="mt-16">
                <Footer />
            </div>

            {/* Request Modal */}
            <Modal
                isOpen={requestModal}
                onClose={() => setRequestModal(false)}
                title="Request Introduction"
                description={`Send a request to connect with ${mockProject.team}`}
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Request Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Introduction', 'PoC Collab', 'Hiring'].map(type => (
                                <button
                                    key={type}
                                    className="p-3 rounded-xl border border-white/10 text-center hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-colors"
                                >
                                    <span className="text-sm font-medium text-white">{type}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Message</label>
                        <textarea
                            rows={4}
                            placeholder="Introduce yourself and explain why you're interested in this project..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setRequestModal(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1" rightIcon={<Send className="w-4 h-4" />}>
                            Send Request
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Image Lightbox */}
            <Modal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                size="xl"
            >
                {selectedImage && (
                    <img src={selectedImage} alt="" className="w-full rounded-lg" />
                )}
            </Modal>
        </div>
    );
}
