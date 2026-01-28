'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Bell,
    Shield,
    Link as LinkIcon,
    Github,
    Mail,
    Building,
    GraduationCap,
    Save,
    Trash2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/common/Toast';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Tabs, { TabContent } from '@/components/common/Tabs';
import Avatar from '@/components/common/Avatar';
import { INDUSTRIES } from '@/lib/utils/constants';

const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 6 }, (_, i) => ({
    value: String(currentYear + i),
    label: String(currentYear + i),
}));

export default function SettingsPage() {
    const { user, updateUserProfile } = useAuth();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('account');
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [college, setCollege] = useState(user?.studentProfile?.college || '');
    const [graduationYear, setGraduationYear] = useState(String(user?.studentProfile?.graduationYear || currentYear));
    const [githubUsername, setGithubUsername] = useState(user?.studentProfile?.githubUsername || '');
    const [companyName, setCompanyName] = useState(user?.founderProfile?.companyName || '');
    const [companyWebsite, setCompanyWebsite] = useState(user?.founderProfile?.companyWebsite || '');
    const [industry, setIndustry] = useState(user?.founderProfile?.industry || '');

    // Notification settings
    const [notifications, setNotifications] = useState({
        newRequests: true,
        weeklyDigest: true,
        marketing: false,
        projectViews: true,
    });

    // Privacy settings
    const [privacy, setPrivacy] = useState({
        profilePublic: true,
        showEmail: false,
        showGithub: true,
    });

    const tabs = [
        { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
        { id: 'profile', label: 'Profile', icon: user?.role === 'student' ? <GraduationCap className="w-4 h-4" /> : <Building className="w-4 h-4" /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
        { id: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4" /> },
        { id: 'connections', label: 'Connections', icon: <LinkIcon className="w-4 h-4" /> },
    ];

    const handleSaveAccount = async () => {
        setIsLoading(true);
        try {
            await updateUserProfile({ displayName });
            addToast({ type: 'success', title: 'Settings saved', message: 'Your account settings have been updated.' });
        } catch (error) {
            addToast({ type: 'error', title: 'Error', message: 'Failed to save settings.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            if (user?.role === 'student') {
                await updateUserProfile({
                    studentProfile: {
                        college,
                        graduationYear: Number(graduationYear),
                        githubUsername,
                    },
                });
            } else {
                await updateUserProfile({
                    founderProfile: {
                        companyName,
                        companyWebsite,
                        industry,
                    },
                });
            }
            addToast({ type: 'success', title: 'Profile updated', message: 'Your profile has been saved.' });
        } catch (error) {
            addToast({ type: 'error', title: 'Error', message: 'Failed to update profile.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
                    <p className="text-white/60 mt-1">Manage your account and preferences</p>
                </div>

                <Tabs
                    tabs={tabs}
                    defaultTab="account"
                    onChange={setActiveTab}
                    variant="pills"
                />

                {/* Account Settings */}
                <TabContent value="account" activeTab={activeTab}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card>
                            <h2 className="text-lg font-semibold text-white mb-6">Account Settings</h2>

                            {/* Avatar Section */}
                            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                                <Avatar src={user?.photoURL} name={user?.displayName || ''} size="xl" />
                                <div>
                                    <h3 className="font-medium text-white mb-1">Profile Picture</h3>
                                    <p className="text-sm text-white/50 mb-3">JPG, PNG or GIF. Max 2MB.</p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Upload</Button>
                                        <Button variant="ghost" size="sm">Remove</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Input
                                    label="Display Name"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    leftIcon={<User className="w-5 h-5" />}
                                />

                                <Input
                                    label="Email Address"
                                    value={user?.email || ''}
                                    disabled
                                    leftIcon={<Mail className="w-5 h-5" />}
                                    helperText="Email cannot be changed"
                                />

                                <div className="pt-4 flex justify-end">
                                    <Button onClick={handleSaveAccount} isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="mt-6 border-red-500/20">
                            <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
                            <p className="text-white/60 text-sm mb-4">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
                                Delete Account
                            </Button>
                        </Card>
                    </motion.div>
                </TabContent>

                {/* Profile Settings */}
                <TabContent value="profile" activeTab={activeTab}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card>
                            <h2 className="text-lg font-semibold text-white mb-6">
                                {user?.role === 'student' ? 'Student Profile' : 'Company Profile'}
                            </h2>

                            {user?.role === 'student' ? (
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Input
                                            label="College/University"
                                            value={college}
                                            onChange={(e) => setCollege(e.target.value)}
                                            placeholder="MIT"
                                        />
                                        <Select
                                            label="Graduation Year"
                                            value={graduationYear}
                                            onChange={(e) => setGraduationYear(e.target.value)}
                                            options={graduationYears}
                                        />
                                    </div>
                                    <Input
                                        label="GitHub Username"
                                        value={githubUsername}
                                        onChange={(e) => setGithubUsername(e.target.value)}
                                        placeholder="octocat"
                                        leftIcon={<Github className="w-5 h-5" />}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <Input
                                        label="Company Name"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="Acme Inc."
                                        leftIcon={<Building className="w-5 h-5" />}
                                    />
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Input
                                            label="Website"
                                            value={companyWebsite}
                                            onChange={(e) => setCompanyWebsite(e.target.value)}
                                            placeholder="https://acme.com"
                                            leftIcon={<LinkIcon className="w-5 h-5" />}
                                        />
                                        <Select
                                            label="Industry"
                                            value={industry}
                                            onChange={(e) => setIndustry(e.target.value)}
                                            options={INDUSTRIES.map(ind => ({ value: ind, label: ind }))}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 flex justify-end">
                                <Button onClick={handleSaveProfile} isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
                                    Save Profile
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </TabContent>

                {/* Notification Settings */}
                <TabContent value="notifications" activeTab={activeTab}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card>
                            <h2 className="text-lg font-semibold text-white mb-6">Notification Preferences</h2>

                            <div className="space-y-4">
                                {[
                                    { key: 'newRequests', label: 'New Requests', description: 'Get notified when you receive new collaboration requests' },
                                    { key: 'projectViews', label: 'Project Views', description: 'Get notified when your projects receive significant views' },
                                    { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Receive a weekly summary of your activity' },
                                    { key: 'marketing', label: 'Marketing Updates', description: 'Receive updates about new features and tips' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                        <div>
                                            <p className="font-medium text-white">{item.label}</p>
                                            <p className="text-sm text-white/50">{item.description}</p>
                                        </div>
                                        <button
                                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-indigo-500' : 'bg-white/10'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </TabContent>

                {/* Privacy Settings */}
                <TabContent value="privacy" activeTab={activeTab}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card>
                            <h2 className="text-lg font-semibold text-white mb-6">Privacy Settings</h2>

                            <div className="space-y-4">
                                {[
                                    { key: 'profilePublic', label: 'Public Profile', description: 'Allow others to see your profile' },
                                    { key: 'showEmail', label: 'Show Email', description: 'Display your email on your public profile' },
                                    { key: 'showGithub', label: 'Show GitHub', description: 'Display your GitHub profile on projects' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                        <div>
                                            <p className="font-medium text-white">{item.label}</p>
                                            <p className="text-sm text-white/50">{item.description}</p>
                                        </div>
                                        <button
                                            onClick={() => setPrivacy({ ...privacy, [item.key]: !privacy[item.key as keyof typeof privacy] })}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${privacy[item.key as keyof typeof privacy] ? 'bg-indigo-500' : 'bg-white/10'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${privacy[item.key as keyof typeof privacy] ? 'left-7' : 'left-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </TabContent>

                {/* Connected Accounts */}
                <TabContent value="connections" activeTab={activeTab}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card>
                            <h2 className="text-lg font-semibold text-white mb-6">Connected Accounts</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                                            <Github className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">GitHub</p>
                                            <p className="text-sm text-white/50">
                                                {githubUsername ? `Connected as @${githubUsername}` : 'Not connected'}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant={githubUsername ? 'outline' : 'primary'} size="sm">
                                        {githubUsername ? 'Disconnect' : 'Connect'}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Google</p>
                                            <p className="text-sm text-white/50">Connected as {user?.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-emerald-400">Connected</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </TabContent>
            </div>
        </DashboardLayout>
    );
}
