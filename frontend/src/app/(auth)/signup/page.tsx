'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, Building, ArrowRight, Github, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/common/Toast';
import { signUpSchema, type SignUpFormData } from '@/lib/utils/validation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Card from '@/components/common/Card';
import { INDUSTRIES } from '@/lib/utils/constants';
import { UserRole } from '@/types';

export default function SignUpPage() {
    const searchParams = useSearchParams();
    const defaultRole = (searchParams.get('role') as UserRole) || 'student';

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
    const router = useRouter();
    const { signUp, signInWithGoogle } = useAuth();
    const { addToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            role: defaultRole,
        },
    });

    const currentYear = new Date().getFullYear();
    const graduationYears = Array.from({ length: 6 }, (_, i) => ({
        value: String(currentYear + i),
        label: String(currentYear + i),
    }));

    const industryOptions = INDUSTRIES.map(ind => ({ value: ind, label: ind }));

    const onSubmit = async (data: SignUpFormData) => {
        setIsLoading(true);
        try {
            const profile = selectedRole === 'student'
                ? {
                    college: data.college || '',
                    graduationYear: Number(data.graduationYear) || currentYear,
                    githubUsername: data.githubUsername || '',
                }
                : {
                    companyName: data.companyName || '',
                    companyWebsite: data.companyWebsite || '',
                    industry: data.industry || '',
                };

            await signUp(data.email, data.password, data.displayName, selectedRole, profile);

            addToast({
                type: 'success',
                title: 'Account created!',
                message: 'Welcome to AfterHack. Let\'s get started!',
            });

            router.push(selectedRole === 'student' ? '/student' : '/founder');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
            addToast({
                type: 'error',
                title: 'Sign up failed',
                message: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            addToast({
                type: 'success',
                title: 'Welcome!',
                message: 'Account created with Google.',
            });
            router.push('/student');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to sign up with Google';
            addToast({
                type: 'error',
                title: 'Sign up failed',
                message: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-900">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-grid opacity-30" />
            <div className="fixed top-1/4 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px]" />
            <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />

            {/* Left Side - Form */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg"
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold">AH</span>
                        </div>
                        <span className="text-2xl font-bold text-white">AfterHack</span>
                    </Link>

                    <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
                    <p className="text-white/60 mb-8">Join thousands of builders and founders</p>

                    {/* Role Selector */}
                    <div className="flex gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setSelectedRole('student')}
                            className={`flex-1 p-4 rounded-xl border transition-all ${selectedRole === 'student'
                                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/50'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                        >
                            <GraduationCap className={`w-6 h-6 mx-auto mb-2 ${selectedRole === 'student' ? 'text-indigo-400' : 'text-white/60'
                                }`} />
                            <p className={`text-sm font-medium ${selectedRole === 'student' ? 'text-white' : 'text-white/60'
                                }`}>
                                I&apos;m a Student
                            </p>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('founder')}
                            className={`flex-1 p-4 rounded-xl border transition-all ${selectedRole === 'founder'
                                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/50'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                        >
                            <Building className={`w-6 h-6 mx-auto mb-2 ${selectedRole === 'founder' ? 'text-indigo-400' : 'text-white/60'
                                }`} />
                            <p className={`text-sm font-medium ${selectedRole === 'founder' ? 'text-white' : 'text-white/60'
                                }`}>
                                I&apos;m a Founder
                            </p>
                        </button>
                    </div>

                    {/* Google Sign Up */}
                    <button
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors disabled:opacity-50 mb-6"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign up with Google
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-900 text-white/40">or continue with email</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <input type="hidden" {...register('role')} value={selectedRole} />

                        <Input
                            {...register('displayName')}
                            label="Full Name"
                            placeholder="John Doe"
                            leftIcon={<User className="w-5 h-5" />}
                            error={errors.displayName?.message}
                        />

                        <Input
                            {...register('email')}
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            leftIcon={<Mail className="w-5 h-5" />}
                            error={errors.email?.message}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <Input
                                    {...register('password')}
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    leftIcon={<Lock className="w-5 h-5" />}
                                    error={errors.password?.message}
                                />
                            </div>
                            <div className="relative">
                                <Input
                                    {...register('confirmPassword')}
                                    label="Confirm Password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    leftIcon={<Lock className="w-5 h-5" />}
                                    error={errors.confirmPassword?.message}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[38px] text-white/40 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Role-specific fields */}
                        <AnimatePresence mode="wait">
                            {selectedRole === 'student' ? (
                                <motion.div
                                    key="student"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-5"
                                >
                                    <Input
                                        {...register('githubUsername')}
                                        label="GitHub Username"
                                        placeholder="octocat"
                                        leftIcon={<Github className="w-5 h-5" />}
                                        error={errors.githubUsername?.message}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            {...register('college')}
                                            label="College/University"
                                            placeholder="MIT"
                                            error={errors.college?.message}
                                        />
                                        <Select
                                            {...register('graduationYear', { valueAsNumber: true })}
                                            label="Graduation Year"
                                            options={graduationYears}
                                            error={errors.graduationYear?.message}
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="founder"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-5"
                                >
                                    <Input
                                        {...register('companyName')}
                                        label="Company Name"
                                        placeholder="Acme Inc."
                                        leftIcon={<Building className="w-5 h-5" />}
                                        error={errors.companyName?.message}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            {...register('companyWebsite')}
                                            label="Website (optional)"
                                            placeholder="https://acme.com"
                                            leftIcon={<Globe className="w-5 h-5" />}
                                            error={errors.companyWebsite?.message}
                                        />
                                        <Select
                                            {...register('industry')}
                                            label="Industry"
                                            options={industryOptions}
                                            error={errors.industry?.message}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isLoading}
                                rightIcon={<ArrowRight className="w-5 h-5" />}
                            >
                                Create Account
                            </Button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-white/60">
                        Already have an account?{' '}
                        <Link href="/signin" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative z-10 max-w-md text-center"
                >
                    <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        {selectedRole === 'student' ? (
                            <GraduationCap className="w-12 h-12 text-white" />
                        ) : (
                            <Building className="w-12 h-12 text-white" />
                        )}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        {selectedRole === 'student'
                            ? 'Showcase your projects'
                            : 'Discover top talent'}
                    </h2>
                    <p className="text-white/60 text-lg">
                        {selectedRole === 'student'
                            ? 'Upload your hackathon projects, get AI-powered scores, and connect with founders who want to build with you.'
                            : 'Browse innovative student projects, connect with talented builders, and find your next star hire or co-founder.'}
                    </p>

                    {/* Feature List */}
                    <ul className="mt-8 space-y-4 text-left">
                        {(selectedRole === 'student'
                            ? [
                                'AI-powered project scoring',
                                'Direct founder connections',
                                'Showcase your tech skills',
                            ]
                            : [
                                'Curated student projects',
                                'Signal scores for quick evaluation',
                                'Direct collaboration requests',
                            ]
                        ).map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-white/80">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20" />
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
            </div>
        </div>
    );
}
