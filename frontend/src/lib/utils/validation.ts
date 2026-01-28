import { z } from 'zod';

// Sign In validation schema
export const signInSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Sign Up validation schema
export const signUpSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['student', 'founder', 'recruiter']),
    // Student fields
    college: z.string().optional(),
    graduationYear: z.number().optional(),
    githubUsername: z.string().optional(),
    // Founder fields
    companyName: z.string().optional(),
    companyWebsite: z.string().url().optional().or(z.literal('')),
    industry: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
}).refine((data) => {
    if (data.role === 'student') {
        return data.college && data.graduationYear && data.githubUsername;
    }
    return true;
}, {
    message: 'Please fill in all student fields',
    path: ['college'],
}).refine((data) => {
    if (data.role === 'founder' || data.role === 'recruiter') {
        return data.companyName && data.industry;
    }
    return true;
}, {
    message: 'Please fill in all company fields',
    path: ['companyName'],
});

// Project form validation schema
export const projectSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    teamName: z.string().min(2, 'Team name must be at least 2 characters'),
    hackathon: z.string().optional(),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    githubUrl: z.string().url('Please enter a valid URL').refine(
        (url) => url.includes('github.com'),
        'Must be a GitHub repository URL'
    ),
    techStack: z.array(z.string()).optional(),
    domain: z.string().min(1, 'Please select a domain'),
    trl: z.number().min(1).max(9).optional(),
    videoUrl: z.string().url().optional().or(z.literal('')),
    demoUrl: z.string().url().optional().or(z.literal('')),
});

// Request form validation schema
export const requestSchema = z.object({
    requestType: z.enum(['intro', 'poc', 'hiring']),
    message: z.string().min(20, 'Message must be at least 20 characters'),
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    // Student fields
    college: z.string().optional(),
    graduationYear: z.number().optional(),
    githubUsername: z.string().optional(),
    // Founder fields
    companyName: z.string().optional(),
    companyWebsite: z.string().url().optional().or(z.literal('')),
    industry: z.string().optional(),
});

// Export types from schemas
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type RequestFormData = z.infer<typeof requestSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
