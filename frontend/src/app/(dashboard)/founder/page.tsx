'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    SlidersHorizontal,
    Bookmark,
    BookmarkCheck,
    ArrowUpRight,
    Send,
    X,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import SearchBar from '@/components/common/SearchBar';
import Modal from '@/components/common/Modal';
import Loader from '@/components/common/Loader';
import { ScoreBadge, TechBadge } from '@/components/common/Badge';
import { DOMAINS, TECH_STACKS } from '@/lib/utils/constants';
import { requestService } from '@/services/requestService';
import { useAuth } from '@/contexts/AuthContext';
import { projectService } from '@/services/projectService';
import { Project } from '@/types';

type ProjectWithSave = Project & { saved?: boolean };

export default function FounderDashboard() {
    const [projects, setProjects] = useState<ProjectWithSave[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastVisible, setLastVisible] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);

    // ... filters state ...
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
    const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
    const [showFilters, setShowFilters] = useState(false);

    // ... modal state ...
    const [requestModal, setRequestModal] = useState<{ isOpen: boolean; project: ProjectWithSave | null }>({
        isOpen: false,
        project: null,
    });

    const loadProjects = async (isInitial = true) => {
        try {
            if (isInitial) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const { projects: newProjects, lastVisible: lastDoc } = await projectService.getProjects({
                status: 'published',
                domain: selectedDomain || undefined,
                limit: 12,
                lastVisible: isInitial ? undefined : lastVisible
            });

            setLastVisible(lastDoc);
            setHasMore(!!lastDoc);

            const projectsWithSave = newProjects.map(p => ({ ...p, saved: false })); // Mock saved

            if (isInitial) {
                setProjects(projectsWithSave);
            } else {
                setProjects(prev => [...prev, ...projectsWithSave]);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Reload when domain changes
    useEffect(() => {
        loadProjects(true);
    }, [selectedDomain]);

    const toggleSave = (projectId: string) => {
        setProjects(projects.map(p =>
            p.id === projectId ? { ...p, saved: !p.saved } : p
        ));
    };

    const filteredProjects = projects.filter(project => {
        // If AI search results are active, only show matching projects
        if (aiSearchResults !== null) {
            return aiSearchResults.includes(project.id);
        }

        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesDomain = !selectedDomain || project.domain === selectedDomain;
        const matchesScore = (project.signalScore?.overall || 0) >= scoreRange[0] && (project.signalScore?.overall || 0) <= scoreRange[1];
        return matchesSearch && matchesDomain && matchesScore;
    });

    const savedProjects = projects.filter(p => p.saved);

    const { user } = useAuth();
    const [requestMessage, setRequestMessage] = useState('');
    const [requestType, setRequestType] = useState<'intro' | 'poc' | 'hiring'>('intro');
    const [sendingRequest, setSendingRequest] = useState(false);

    // AI Search State
    const [aiSearching, setAiSearching] = useState(false);
    const [aiSearchResults, setAiSearchResults] = useState<string[] | null>(null);

    const handleAISearch = async () => {
        if (!searchQuery.trim() || projects.length === 0) return;

        setAiSearching(true);
        try {
            const response = await fetch('http://localhost:5001/api/ai/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: searchQuery,
                    projects: projects.map(p => ({
                        id: p.id,
                        title: p.title,
                        description: p.description,
                    })),
                }),
            });
            const data = await response.json();
            setAiSearchResults(data.matchingIds || []);
        } catch (error) {
            console.error('AI Search failed:', error);
            alert('AI Search failed. Please try again.');
        } finally {
            setAiSearching(false);
        }
    };

    const clearAISearch = () => {
        setAiSearchResults(null);
        setSearchQuery('');
    };

    const handleSendRequest = async () => {
        if (!user || !requestModal.project) return;

        setSendingRequest(true);
        try {
            await requestService.sendRequest(user.id, {
                toUserId: requestModal.project.userId,
                projectId: requestModal.project.id,
                type: requestType,
                message: requestMessage,
            });
            // Reset and close
            setRequestMessage('');
            setRequestType('intro');
            setRequestModal({ isOpen: false, project: null });
            alert('Request sent successfully!'); // Replace with Toast later
        } catch (error) {
            console.error('Failed to send request:', error);
            alert('Failed to send request. Please try again.');
        } finally {
            setSendingRequest(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* ... (Header and Filters unchanged) ... */}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Browse Projects</h1>
                        <p className="text-white/60 mt-1">Discover innovative hackathon projects from talented builders</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/requests">
                            <Button variant="secondary" leftIcon={<Send className="w-4 h-4" />}>
                                My Requests
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Search projects, teams, technologies..."
                            value={searchQuery}
                            onChange={setSearchQuery}
                            className="w-full"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="primary"
                            onClick={handleAISearch}
                            isLoading={aiSearching}
                            disabled={!searchQuery.trim()}
                            leftIcon={<Search className="w-4 h-4" />}
                        >
                            AI Search
                        </Button>
                        {aiSearchResults !== null && (
                            <Button
                                variant="ghost"
                                onClick={clearAISearch}
                                leftIcon={<X className="w-4 h-4" />}
                            >
                                Clear AI
                            </Button>
                        )}
                        <Button
                            variant={showFilters ? 'primary' : 'outline'}
                            onClick={() => setShowFilters(!showFilters)}
                            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                        >
                            Filters
                        </Button>
                    </div>
                </Card>

                {/* Filter Panel */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Card>
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Domain Filter */}
                                <div>
                                    <h4 className="text-sm font-medium text-white mb-3">Domain</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedDomain(null)}
                                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${!selectedDomain
                                                ? 'bg-indigo-500 text-white'
                                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                                                }`}
                                        >
                                            All
                                        </button>
                                        {DOMAINS.slice(0, 6).map(domain => (
                                            <button
                                                key={domain.name}
                                                onClick={() => setSelectedDomain(domain.name)}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedDomain === domain.name
                                                    ? 'bg-indigo-500 text-white'
                                                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                                                    }`}
                                            >
                                                {domain.icon} {domain.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Score Range */}
                                <div>
                                    <h4 className="text-sm font-medium text-white mb-3">
                                        Minimum Score: {scoreRange[0]}
                                    </h4>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={scoreRange[0]}
                                        onChange={(e) => setScoreRange([Number(e.target.value), scoreRange[1]])}
                                        className="w-full accent-indigo-500"
                                    />
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setSelectedDomain(null);
                                            setScoreRange([0, 100]);
                                            setSearchQuery('');
                                        }}
                                    >
                                        Clear All Filters
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Projects Grid */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredProjects.map((project, index) => (
                                // ... existing project card map ...
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card variant="glow" padding="none" className="overflow-hidden group">
                                        {/* Thumbnail */}
                                        <div className="relative h-40">
                                            <img
                                                src={project.thumbnailUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                                            {/* Score */}
                                            {project.signalScore && (
                                                <div className="absolute top-3 right-3">
                                                    <ScoreBadge score={project.signalScore.overall} size="sm" />
                                                </div>
                                            )}

                                            {/* Save Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleSave(project.id);
                                                }}
                                                className="absolute top-3 left-3 p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white/80 hover:text-white transition-colors"
                                            >
                                                {project.saved ? (
                                                    <BookmarkCheck className="w-4 h-4 text-indigo-400" />
                                                ) : (
                                                    <Bookmark className="w-4 h-4" />
                                                )}
                                            </button>

                                            {/* Domain Badge */}
                                            <div className="absolute bottom-3 left-3">
                                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-black/50 backdrop-blur-sm text-white border border-white/10">
                                                    {project.domain}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <Link href={`/projects/${project.id}`}>
                                                <h3 className="font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                                    {project.title}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-white/50 mb-2">{project.teamName}</p>
                                            <p className="text-sm text-white/60 line-clamp-2 mb-3">{project.description}</p>

                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {project.techStack.slice(0, 3).map(tech => (
                                                    <TechBadge key={tech} name={tech} />
                                                ))}
                                                {project.techStack.length > 3 && (
                                                    <span className="text-xs text-white/40 self-center">
                                                        +{project.techStack.length - 3}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <Link href={`/projects/${project.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        View Details
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setRequestModal({ isOpen: true, project })}
                                                >
                                                    Request
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {filteredProjects.length === 0 && !loading && (
                            <Card className="py-12 text-center">
                                <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
                                <p className="text-white/50">Try adjusting your search or filters</p>
                            </Card>
                        )}

                        {hasMore && filteredProjects.length > 0 && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => loadProjects(false)}
                                    isLoading={loadingMore}
                                >
                                    Load More Projects
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Saved Projects */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white">Saved Projects</h3>
                            <span className="text-sm text-white/40">{savedProjects.length}</span>
                        </div>

                        <Card className="divide-y divide-white/5">
                            {savedProjects.length > 0 ? (
                                savedProjects.map(project => (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className="block py-3 first:pt-0 last:pb-0 hover:bg-white/5 -mx-6 px-6 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={project.thumbnailUrl}
                                                alt={project.title}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{project.title}</p>
                                                <p className="text-xs text-white/50">{project.teamName}</p>
                                            </div>
                                            {project.signalScore && <ScoreBadge score={project.signalScore.overall} size="sm" />}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="py-8 text-center">
                                    <Bookmark className="w-8 h-8 text-white/20 mx-auto mb-2" />
                                    <p className="text-sm text-white/50">No saved projects yet</p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>

            {/* Request Modal */}
            <Modal
                isOpen={requestModal.isOpen}
                onClose={() => setRequestModal({ isOpen: false, project: null })}
                title="Request Introduction"
                description={`Send a request to connect with ${requestModal.project?.teamName}`}
            >
                {requestModal.project && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                            <img
                                src={requestModal.project.thumbnailUrl}
                                alt={requestModal.project.title}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                                <h4 className="font-semibold text-white">{requestModal.project.title}</h4>
                                <p className="text-sm text-white/60">{requestModal.project.teamName}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Request Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'intro', label: 'Introduction' },
                                    { id: 'poc', label: 'PoC Collab' },
                                    { id: 'hiring', label: 'Hiring' }
                                ].map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setRequestType(type.id as 'intro' | 'poc' | 'hiring')}
                                        className={`p-3 rounded-xl border text-center transition-colors ${requestType === type.id
                                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                                            : 'border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-white'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Message</label>
                            <textarea
                                rows={4}
                                placeholder="Introduce yourself and explain why you're interested in this project..."
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setRequestModal({ isOpen: false, project: null })}>
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                rightIcon={sendingRequest ? undefined : <Send className="w-4 h-4" />}
                                onClick={handleSendRequest}
                                isLoading={sendingRequest}
                                disabled={!requestMessage.trim()}
                            >
                                Send Request
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
}
