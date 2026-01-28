'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Search,
    TrendingUp,
    Trophy,
    Flame,
    Sparkles,
    ArrowRight,
    Filter,
} from 'lucide-react';
import { TopNav, Footer } from '@/components/layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import SearchBar from '@/components/common/SearchBar';
import { ScoreBadge, TechBadge } from '@/components/common/Badge';
import { DOMAINS, TECH_STACKS } from '@/lib/utils/constants';

// Mock featured collections
const collections = [
    { id: 'top-rated', name: 'Top Rated This Month', icon: Trophy, count: 25 },
    { id: 'rising', name: 'Rising Stars', icon: TrendingUp, count: 18 },
    { id: 'innovative', name: 'Most Innovative', icon: Sparkles, count: 12 },
    { id: 'trending', name: 'Trending Now', icon: Flame, count: 15 },
];

// Mock projects
const allProjects = [
    {
        id: '1',
        title: 'AI Resume Screener',
        team: 'Team Innovate',
        techStack: ['Python', 'TensorFlow', 'FastAPI'],
        score: 92,
        domain: 'AI/ML',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    },
    {
        id: '2',
        title: 'DeFi Portfolio Tracker',
        team: 'Crypto Builders',
        techStack: ['Next.js', 'TypeScript', 'Web3.js'],
        score: 88,
        domain: 'Web3/Blockchain',
        thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
    },
    {
        id: '3',
        title: 'StudyBuddy AI',
        team: 'EduTech Wizards',
        techStack: ['Next.js', 'OpenAI', 'Prisma'],
        score: 91,
        domain: 'EdTech',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
    },
    {
        id: '4',
        title: 'HealthSync',
        team: 'MedTech Squad',
        techStack: ['React Native', 'Node.js', 'MongoDB'],
        score: 85,
        domain: 'HealthTech',
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
    },
    {
        id: '5',
        title: 'GreenPath',
        team: 'Sustainability First',
        techStack: ['Flutter', 'Firebase', 'Python'],
        score: 79,
        domain: 'Sustainability',
        thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=250&fit=crop',
    },
    {
        id: '6',
        title: 'SmartRecruit',
        team: 'HR Innovators',
        techStack: ['Python', 'FastAPI', 'React'],
        score: 87,
        domain: 'AI/ML',
        thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop',
    },
];

// Leaderboard data
const leaderboard = [
    { rank: 1, team: 'Team Innovate', score: 92, projects: 3, change: 'up' },
    { rank: 2, team: 'EduTech Wizards', score: 91, projects: 2, change: 'up' },
    { rank: 3, team: 'Crypto Builders', score: 88, projects: 4, change: 'same' },
    { rank: 4, team: 'SmartRecruit', score: 87, projects: 1, change: 'down' },
    { rank: 5, team: 'MedTech Squad', score: 85, projects: 2, change: 'up' },
];

export default function DiscoverPage() {
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProjects = allProjects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.team.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDomain = !selectedDomain || project.domain === selectedDomain;
        return matchesSearch && matchesDomain;
    });

    return (
        <div className="min-h-screen bg-slate-900">
            <TopNav />

            <main className="pt-16">
                {/* Hero Section */}
                <section className="relative py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-slate-900" />
                    <div className="absolute inset-0 bg-grid opacity-30" />

                    <div className="relative container mx-auto px-4 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-4"
                        >
                            Discover Amazing Projects
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-white/60 mb-8 max-w-2xl mx-auto"
                        >
                            Explore innovative hackathon projects from talented student builders
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl mx-auto"
                        >
                            <SearchBar
                                placeholder="Search projects, teams, technologies..."
                                value={searchQuery}
                                onChange={setSearchQuery}
                            />
                        </motion.div>

                        {/* Trending Tech Tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 flex flex-wrap items-center justify-center gap-2"
                        >
                            <span className="text-sm text-white/40 mr-2">Trending:</span>
                            {['AI/ML', 'Web3', 'React', 'Python', 'OpenAI'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSearchQuery(tag)}
                                    className="px-3 py-1 rounded-full text-sm bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Featured Collections */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-white mb-6">Featured Collections</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {collections.map((collection, index) => (
                                <motion.div
                                    key={collection.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card variant="hover" className="group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                                                <collection.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                                    {collection.name}
                                                </h3>
                                                <p className="text-sm text-white/50">{collection.count} projects</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Browse by Domain */}
                <section className="py-12 bg-white/[0.02]">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Browse by Domain</h2>
                            <Button variant="ghost" size="sm" rightIcon={<Filter className="w-4 h-4" />}>
                                All Categories
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {DOMAINS.slice(0, 10).map((domain, index) => (
                                <motion.button
                                    key={domain.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedDomain(selectedDomain === domain.name ? null : domain.name)}
                                    className={`p-4 rounded-xl border text-left transition-all ${selectedDomain === domain.name
                                            ? 'bg-indigo-500/20 border-indigo-500/50'
                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <span className="text-2xl mb-2 block">{domain.icon}</span>
                                    <p className="font-medium text-white text-sm">{domain.name}</p>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Projects Grid and Leaderboard */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-4 gap-8">
                            {/* Projects */}
                            <div className="lg:col-span-3">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white">
                                        {selectedDomain ? `${selectedDomain} Projects` : 'All Projects'}
                                    </h2>
                                    <span className="text-white/50">{filteredProjects.length} projects</span>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredProjects.map((project, index) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link href={`/projects/${project.id}`}>
                                                <Card variant="glow" padding="none" className="overflow-hidden group">
                                                    <div className="relative h-36">
                                                        <img
                                                            src={project.thumbnail}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50" />
                                                        <div className="absolute top-3 right-3">
                                                            <ScoreBadge score={project.score} size="sm" />
                                                        </div>
                                                        <div className="absolute bottom-3 left-3">
                                                            <span className="px-2 py-1 rounded-md text-xs bg-black/50 backdrop-blur-sm text-white">
                                                                {project.domain}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                                            {project.title}
                                                        </h3>
                                                        <p className="text-sm text-white/50 mb-3">{project.team}</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {project.techStack.slice(0, 3).map(tech => (
                                                                <TechBadge key={tech} name={tech} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {filteredProjects.length === 0 && (
                                    <Card className="py-12 text-center">
                                        <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
                                        <p className="text-white/50">Try adjusting your search or filters</p>
                                    </Card>
                                )}
                            </div>

                            {/* Leaderboard */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Leaderboard</h2>
                                    <span className="text-xs text-white/40">This Week</span>
                                </div>
                                <Card className="divide-y divide-white/5">
                                    {leaderboard.map((team, index) => (
                                        <motion.div
                                            key={team.rank}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${team.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                                                    team.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                                                        team.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                                                            'bg-white/5 text-white/40'
                                                }`}>
                                                {team.rank}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white text-sm truncate">{team.team}</p>
                                                <p className="text-xs text-white/50">{team.projects} projects</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-white">{team.score}</p>
                                                <span className={`text-xs ${team.change === 'up' ? 'text-emerald-400' :
                                                        team.change === 'down' ? 'text-red-400' :
                                                            'text-white/40'
                                                    }`}>
                                                    {team.change === 'up' ? '↑' : team.change === 'down' ? '↓' : '→'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </Card>

                                <Link href="/leaderboard" className="block mt-4">
                                    <Button variant="outline" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                        View Full Leaderboard
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
