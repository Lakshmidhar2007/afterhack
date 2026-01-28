'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Github,
    Globe,
    Youtube,
    Image as ImageIcon,
    FileVideo,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Check,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { projectService } from '@/services/projectService';
import { storageService } from '@/services/storageService';
import { DashboardLayout } from '@/components/layout';
import { useToast } from '@/components/common/Toast';
import { projectSchema, type ProjectFormData } from '@/lib/utils/validation';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { StepProgress } from '@/components/common/ProgressBar';
import { TechBadge } from '@/components/common/Badge';
import { TECH_STACKS, DOMAINS, TRL_LEVELS, HACKATHONS } from '@/lib/utils/constants';

const steps = [
    { id: 1, title: 'Basic Info', description: 'Project name and description' },
    { id: 2, title: 'Tech & Domain', description: 'Technology stack and domain' },
    { id: 3, title: 'Links & Media', description: 'GitHub, demo, and media files' },
    { id: 4, title: 'Review', description: 'Review and submit' },
];

type UploadableFile = {
    file: File;
    previewUrl: string;
};

export default function UploadProjectPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTech, setSelectedTech] = useState<string[]>([]);

    // File states
    const [imageFiles, setImageFiles] = useState<UploadableFile[]>([]);
    const [videoFile, setVideoFile] = useState<UploadableFile | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
        setValue,
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            techStack: [],
        },
    });

    const watchedValues = watch();

    // Cleanup object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            imageFiles.forEach(img => URL.revokeObjectURL(img.previewUrl));
            if (videoFile) URL.revokeObjectURL(videoFile.previewUrl);
        };
    }, [imageFiles, videoFile]);

    const handleTechSelect = (tech: string) => {
        const newTech = selectedTech.includes(tech)
            ? selectedTech.filter(t => t !== tech)
            : [...selectedTech, tech];
        setSelectedTech(newTech);
        setValue('techStack', newTech, { shouldValidate: true });
    };

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files).map(file => ({
                file,
                previewUrl: URL.createObjectURL(file)
            }));
            setImageFiles(prev => [...prev, ...newFiles]);
        }
    }, []);

    const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile({
                file,
                previewUrl: URL.createObjectURL(file)
            });
        }
    }, []);

    const removeImage = (index: number) => {
        setImageFiles(prev => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].previewUrl);
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const removeVideo = () => {
        if (videoFile) {
            URL.revokeObjectURL(videoFile.previewUrl);
            setVideoFile(null);
        }
    };

    const nextStep = async () => {
        let fieldsToValidate: (keyof ProjectFormData)[] = [];
        if (currentStep === 1) fieldsToValidate = ['title', 'teamName', 'description'];
        else if (currentStep === 2) fieldsToValidate = ['domain'];
        else if (currentStep === 3) fieldsToValidate = ['githubUrl'];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const onSubmit = async (data: ProjectFormData) => {
        if (!user) {
            addToast({ type: 'error', title: 'Error', message: 'You must be logged in to submit a project.' });
            return;
        }

        setIsSubmitting(true);
        try {
            // Upload images
            const imageUrls: string[] = [];
            for (const img of imageFiles) {
                const path = `projects/${user.id}/${Date.now()}_${img.file.name}`;
                const url = await storageService.uploadFile(img.file, path);
                imageUrls.push(url);
            }

            // Upload video
            let videoUrl = data.videoUrl; // Keep existing youtube URL if provided
            if (videoFile) {
                const path = `projects/${user.id}/${Date.now()}_${videoFile.file.name}`;
                // Fix: Pass the File object, not the wrapper
                videoUrl = await storageService.uploadFile(videoFile.file, path);
            }

            await projectService.createProject(user.id, {
                ...data,
                screenshots: imageUrls,
                videoUrl: videoUrl, // Use uploaded video URL or YouTube URL
            });

            addToast({
                type: 'success',
                title: 'Project Submitted!',
                message: 'Your project is being evaluated. AI scoring will be ready soon.',
            });

            router.push('/student');
        } catch (error) {
            console.error(error);
            addToast({
                type: 'error',
                title: 'Submission Failed',
                message: 'There was an error submitting your project. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Domain and hackathon options
    const domainOptions = DOMAINS.map(d => ({ value: d.name, label: `${d.icon} ${d.name}` }));
    const hackathonOptions = HACKATHONS.map(h => ({ value: h, label: h }));
    const trlOptions = TRL_LEVELS.map(t => ({ value: String(t.level), label: `TRL ${t.level} - ${t.name}` }));

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Upload Project</h1>
                    <p className="text-white/60">Share your hackathon project with the world</p>
                </div>

                {/* Step Progress */}
                <StepProgress
                    steps={steps.map(s => s.title)}
                    currentStep={currentStep}
                    className="mb-8"
                />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <AnimatePresence mode="wait">
                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card>
                                    <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

                                    <div className="space-y-6">
                                        <Input
                                            {...register('title')}
                                            label="Project Title"
                                            placeholder="e.g., AI Resume Screener"
                                            error={errors.title?.message}
                                        />

                                        <Input
                                            {...register('teamName')}
                                            label="Team Name"
                                            placeholder="e.g., Team Innovate"
                                            error={errors.teamName?.message}
                                        />

                                        <div>
                                            <label className="block text-sm font-medium text-white/80 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                {...register('description')}
                                                rows={5}
                                                placeholder="Describe your project, what problem it solves, and what makes it unique..."
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                                            />
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                                            )}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <Select
                                                {...register('hackathon')}
                                                label="Hackathon (Optional)"
                                                options={[{ value: '', label: 'Select hackathon...' }, ...hackathonOptions]}
                                                error={errors.hackathon?.message}
                                            />

                                            <Select
                                                {...register('trl', { valueAsNumber: true })}
                                                label="Technology Readiness Level"
                                                options={trlOptions}
                                                error={errors.trl?.message}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Step 2: Tech & Domain */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card>
                                    <h2 className="text-xl font-semibold text-white mb-6">Technology & Domain</h2>

                                    <div className="space-y-6">
                                        <Select
                                            {...register('domain')}
                                            label="Project Domain"
                                            options={[{ value: '', label: 'Select domain...' }, ...domainOptions]}
                                            error={errors.domain?.message}
                                        />

                                        <div>
                                            <label className="block text-sm font-medium text-white/80 mb-3">
                                                Technology Stack
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {TECH_STACKS.map(tech => (
                                                    <button
                                                        key={tech.name}
                                                        type="button"
                                                        onClick={() => handleTechSelect(tech.name)}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedTech.includes(tech.name)
                                                            ? 'bg-indigo-500 text-white'
                                                            : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                                                            }`}
                                                    >
                                                        {tech.name}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="mt-3 text-sm text-white/40">
                                                Selected: {selectedTech.length > 0 ? selectedTech.join(', ') : 'None'}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Step 3: Links & Media */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card>
                                    <h2 className="text-xl font-semibold text-white mb-6">Links & Media</h2>

                                    <div className="space-y-6">
                                        <Input
                                            {...register('githubUrl')}
                                            label="GitHub Repository URL"
                                            placeholder="https://github.com/username/project"
                                            leftIcon={<Github className="w-5 h-5" />}
                                            error={errors.githubUrl?.message}
                                        />

                                        <Input
                                            {...register('demoUrl')}
                                            label="Live Demo URL (Optional)"
                                            placeholder="https://yourproject.vercel.app"
                                            leftIcon={<Globe className="w-5 h-5" />}
                                            error={errors.demoUrl?.message}
                                        />

                                        <Input
                                            {...register('videoUrl')}
                                            label="YouTube Video URL (Optional)"
                                            placeholder="https://youtube.com/watch?v=..."
                                            leftIcon={<Youtube className="w-5 h-5" />}
                                            error={errors.videoUrl?.message}
                                        />

                                        {/* Image Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-white/80 mb-3">
                                                Screenshots (Optional)
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {imageFiles.map((img, index) => (
                                                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
                                                        <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-2 right-2 p-1 rounded-lg bg-black/50 text-white hover:bg-black/70"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {imageFiles.length < 5 && (
                                                    <label className="aspect-video rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 transition-colors">
                                                        <ImageIcon className="w-6 h-6 text-white/40 mb-2" />
                                                        <span className="text-xs text-white/40">Add Image</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handleImageUpload}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        {/* Video Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-white/80 mb-3">
                                                Video Demo File (Optional)
                                            </label>
                                            {videoFile ? (
                                                <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5">
                                                    <video src={videoFile.previewUrl} controls className="w-full h-full" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVideo()}
                                                        className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="aspect-video rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 transition-colors">
                                                    <FileVideo className="w-10 h-10 text-white/30 mb-3" />
                                                    <span className="text-white/60 font-medium">Upload Video</span>
                                                    <span className="text-xs text-white/40 mt-1">MP4, WebM up to 100MB</span>
                                                    <input
                                                        type="file"
                                                        accept="video/*"
                                                        className="hidden"
                                                        onChange={handleVideoUpload}
                                                    />
                                                </label>
                                            )}
                                            <p className="text-xs text-white/30 mt-2">
                                                You can provide either a YouTube URL or upload a video file.
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Step 4: Review */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-white">Review Your Project</h2>
                                            <p className="text-sm text-white/60">Make sure everything looks good before submitting</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Preview Card */}
                                        <div className="p-6 bg-white/5 rounded-xl space-y-4">
                                            <div>
                                                <label className="text-xs text-white/40 uppercase tracking-wider">Project Title</label>
                                                <p className="text-lg font-semibold text-white mt-1">{watchedValues.title || 'Not provided'}</p>
                                            </div>

                                            <div>
                                                <label className="text-xs text-white/40 uppercase tracking-wider">Team</label>
                                                <p className="text-white mt-1">{watchedValues.teamName || 'Not provided'}</p>
                                            </div>

                                            <div>
                                                <label className="text-xs text-white/40 uppercase tracking-wider">Description</label>
                                                <p className="text-white/80 mt-1">{watchedValues.description || 'Not provided'}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs text-white/40 uppercase tracking-wider">Domain</label>
                                                    <p className="text-white mt-1">{watchedValues.domain || 'Not selected'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-white/40 uppercase tracking-wider">Hackathon</label>
                                                    <p className="text-white mt-1">{watchedValues.hackathon || 'None'}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs text-white/40 uppercase tracking-wider">Tech Stack</label>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {selectedTech.length > 0 ? (
                                                        selectedTech.map(tech => <TechBadge key={tech} name={tech} />)
                                                    ) : (
                                                        <p className="text-white/50">No tech selected</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-white/10">
                                                <label className="text-xs text-white/40 uppercase tracking-wider">Links</label>
                                                <div className="space-y-2 mt-2">
                                                    {watchedValues.githubUrl && (
                                                        <div className="flex items-center gap-2 text-white/80">
                                                            <Github className="w-4 h-4" />
                                                            <span className="text-sm truncate">{watchedValues.githubUrl}</span>
                                                        </div>
                                                    )}
                                                    {watchedValues.demoUrl && (
                                                        <div className="flex items-center gap-2 text-white/80">
                                                            <Globe className="w-4 h-4" />
                                                            <span className="text-sm truncate">{watchedValues.demoUrl}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {imageFiles.length > 0 && (
                                                <div className="pt-4 border-t border-white/10">
                                                    <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Media to Upload</label>
                                                    <div className="flex gap-2">
                                                        {imageFiles.map((img, i) => (
                                                            <img key={i} src={img.previewUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* AI Scoring Notice */}
                                        <div className="flex items-start gap-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                            <div className="p-2 rounded-lg bg-indigo-500/20">
                                                <Sparkles className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white">AI-Powered Scoring</h4>
                                                <p className="text-sm text-white/60 mt-1">
                                                    After submission, our AI will analyze your GitHub repository and provide a Signal Score within 24 hours.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-white/60">
                                            <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                                            <span>I agree to the Terms of Service and confirm this is my original work</span>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            leftIcon={<ChevronLeft className="w-5 h-5" />}
                        >
                            Back
                        </Button>

                        {currentStep < 4 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                rightIcon={<ChevronRight className="w-5 h-5" />}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                leftIcon={<Check className="w-5 h-5" />}
                            >
                                Submit Project
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
