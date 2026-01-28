'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Send,
    MessageSquare,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    ArrowUpRight,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Tabs, { TabContent } from '@/components/common/Tabs';
import { requestService } from '@/services/requestService';
import { projectService } from '@/services/projectService';
import { userService } from '@/services/userService';
import { Request, Project, User, RequestStatus } from '@/types';

// Extended request type for UI
type RequestWithDetails = Request & {
    projectDetails?: Project;
    fromUserDetails?: User;
    toUserDetails?: User;
};

export default function RequestsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('received');
    const [loading, setLoading] = useState(true);
    const [receivedRequests, setReceivedRequests] = useState<RequestWithDetails[]>([]);
    const [sentRequests, setSentRequests] = useState<RequestWithDetails[]>([]);

    const isStudent = user?.role === 'student';

    useEffect(() => {
        if (!user?.id) return;

        let unsubscribeReceived: () => void;
        let unsubscribeSent: () => void;

        const hydrateRequests = async (reqs: Request[], isReceived: boolean) => {
            // Collect all unique user IDs and Project IDs to fetch details
            const userIds = new Set<string>();
            const projectIds = new Set<string>();

            reqs.forEach(r => {
                userIds.add(r.fromUserId);
                if (r.projectId) projectIds.add(r.projectId);
                if (r.toUserId) userIds.add(r.toUserId);
            });

            // Fetch details (could be optimized with caching)
            const userPromises = Array.from(userIds).map(id => userService.getUser(id));
            const projectPromises = Array.from(projectIds).map(id => projectService.getProject(id));

            const [users, projects] = await Promise.all([
                Promise.all(userPromises),
                Promise.all(projectPromises)
            ]);

            const userMap = new Map(users.map(u => [u?.id, u]));
            const projectMap = new Map(projects.map(p => [p?.id, p]));

            return reqs.map(r => ({
                ...r,
                projectDetails: r.projectId ? projectMap.get(r.projectId) || undefined : undefined,
                fromUserDetails: userMap.get(r.fromUserId) || undefined,
                toUserDetails: r.toUserId ? userMap.get(r.toUserId) || undefined : undefined,
            }));
        };

        setLoading(true);

        unsubscribeReceived = requestService.subscribeToReceivedRequests(user.id, async (reqs) => {
            const hydrated = await hydrateRequests(reqs, true);
            setReceivedRequests(hydrated);
            setLoading(false);
        });

        unsubscribeSent = requestService.subscribeToSentRequests(user.id, async (reqs) => {
            const hydrated = await hydrateRequests(reqs, false);
            setSentRequests(hydrated);
            setLoading(false);
        });

        return () => {
            if (unsubscribeReceived) unsubscribeReceived();
            if (unsubscribeSent) unsubscribeSent();
        };
    }, [user?.id]);

    const handleStatusUpdate = async (requestId: string, newStatus: RequestStatus) => {
        try {
            await requestService.updateRequestStatus(requestId, newStatus);
            // Update local state
            setReceivedRequests(prev => prev.map(r =>
                r.id === requestId ? { ...r, status: newStatus } : r
            ));
        } catch (error) {
            console.error('Failed to update request status:', error);
        }
    };

    const tabs = [
        { id: 'received', label: `Received (${receivedRequests.filter(r => r.status === 'pending').length})` },
        { id: 'sent', label: 'Sent' },
    ];

    const getRequestTypeLabel = (type: string) => {
        switch (type) {
            case 'intro': return 'Introduction';
            case 'poc': return 'PoC Collaboration';
            case 'hiring': return 'Hiring Interest';
            default: return type;
        }
    };

    const getRequestTypeColor = (type: string) => {
        switch (type) {
            case 'intro': return 'bg-blue-500/20 text-blue-400';
            case 'poc': return 'bg-purple-500/20 text-purple-400';
            case 'hiring': return 'bg-emerald-500/20 text-emerald-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Requests</h1>
                        <p className="text-white/60 mt-1">
                            {isStudent
                                ? 'Manage collaboration requests from founders and recruiters'
                                : 'Track your outreach to talented student builders'}
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Pending', value: receivedRequests.filter(r => r.status === 'pending').length, icon: Clock, color: 'text-yellow-400' },
                        { label: 'Accepted', value: receivedRequests.filter(r => r.status === 'accepted').length, icon: CheckCircle, color: 'text-emerald-400' },
                        { label: 'Declined', value: receivedRequests.filter(r => r.status === 'rejected').length, icon: XCircle, color: 'text-red-400' },
                        { label: 'Response Rate', value: '100%', icon: MessageSquare, color: 'text-indigo-400' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card variant="hover">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                                        <p className="text-sm text-white/50">{stat.label}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <Tabs tabs={tabs} defaultTab="received" onChange={setActiveTab} variant="pills" />

                {/* Received Requests */}
                <TabContent value="received" activeTab={activeTab}>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-12 text-white/50">Loading requests...</div>
                        ) : receivedRequests.map((request, index) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card variant="hover" className="relative">
                                    {request.status === 'pending' && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 rounded-l-xl" />
                                    )}

                                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                                        {/* Sender Info */}
                                        <div className="flex items-start gap-4 flex-1">
                                            <Avatar
                                                src={request.fromUserDetails?.photoURL}
                                                name={request.fromUserDetails?.displayName || 'Unknown User'}
                                                size="lg"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-white">
                                                        {request.fromUserDetails?.displayName || 'Unknown User'}
                                                    </span>
                                                    <span className="text-white/40">•</span>
                                                    <span className="text-white/60">
                                                        {request.fromUserDetails?.founderProfile?.companyName || 'Founder'}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRequestTypeColor(request.type)}`}>
                                                        {getRequestTypeLabel(request.type)}
                                                    </span>
                                                </div>

                                                {request.projectDetails && (
                                                    <Link
                                                        href={`/projects/${request.projectDetails.id}`}
                                                        className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1"
                                                    >
                                                        {request.projectDetails.title}
                                                        <ArrowUpRight className="w-3 h-3" />
                                                    </Link>
                                                )}

                                                <p className="text-white/70 mt-3 text-sm line-clamp-2">{request.message}</p>

                                                <div className="flex items-center gap-4 mt-3">
                                                    <span className="text-xs text-white/40 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {formatDate(request.createdAt)}
                                                    </span>
                                                    <StatusBadge status={request.status} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {request.status === 'pending' && (
                                            <div className="flex items-center gap-2 ml-16 md:ml-0">
                                                <Button size="sm" onClick={() => handleStatusUpdate(request.id, 'accepted')}>
                                                    Accept
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(request.id, 'rejected')}>
                                                    Decline
                                                </Button>
                                                {request.projectDetails && (
                                                    <Link href={`/projects/${request.projectDetails.id}`}>
                                                        <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                                                            View
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        )}

                                        {request.status === 'accepted' && (
                                            <div className="flex items-center gap-2 ml-16 md:ml-0">
                                                <Button size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>
                                                    Message
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}

                        {!loading && receivedRequests.length === 0 && (
                            <Card className="py-12 text-center">
                                <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">No requests yet</h3>
                                <p className="text-white/50 max-w-sm mx-auto">
                                    When founders and recruiters send you collaboration requests, they&apos;ll appear here.
                                </p>
                            </Card>
                        )}
                    </div>
                </TabContent>

                {/* Sent Requests */}
                <TabContent value="sent" activeTab={activeTab}>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-12 text-white/50">Loading requests...</div>
                        ) : sentRequests.map((request, index) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card variant="hover">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Send className="w-4 h-4 text-white/40" />
                                                <span className="text-white/60">Sent to</span>
                                                <span className="font-semibold text-white">
                                                    {request.toUserDetails?.displayName || 'Unknown User'}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRequestTypeColor(request.type)}`}>
                                                    {getRequestTypeLabel(request.type)}
                                                </span>
                                            </div>
                                            {request.projectDetails && (
                                                <p className="text-sm text-indigo-400 mt-1">Re: {request.projectDetails.title}</p>
                                            )}
                                            <p className="text-white/60 text-sm mt-2 line-clamp-1">{request.message}</p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-white/40">{formatDate(request.createdAt)}</span>
                                            <StatusBadge status={request.status} />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}

                        {!loading && sentRequests.length === 0 && (
                            <Card className="py-12 text-center">
                                <Send className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">No sent requests</h3>
                                <p className="text-white/50 max-w-sm mx-auto">
                                    Browse projects and send collaboration requests to start connecting.
                                </p>
                                <Link href="/discover" className="inline-block mt-4">
                                    <Button>Browse Projects</Button>
                                </Link>
                            </Card>
                        )}
                    </div>
                </TabContent>
            </div>
        </DashboardLayout>
    );
}
