// User types
export type UserRole = 'student' | 'founder' | 'recruiter';

export interface StudentProfile {
    college: string;
    graduationYear: number;
    githubUsername: string;
}

export interface FounderProfile {
    companyName: string;
    companyWebsite: string;
    industry: string;
}

export interface User {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: UserRole;
    studentProfile?: StudentProfile;
    founderProfile?: FounderProfile;
    createdAt: Date;
    updatedAt: Date;
}

// Project types
export type ProjectStatus = 'draft' | 'published' | 'archived';
export type ProjectVisibility = 'public' | 'private';

export interface Project {
    id: string;
    userId: string; // Project owner ID
    teamName: string;
    title: string;
    description: string;
    hackathon?: string;
    githubUrl: string;
    videoUrl?: string;
    demoUrl?: string;
    techStack: string[];
    domain: string;
    trl: number;
    teamMembers: string[];
    status: ProjectStatus;
    visibility: ProjectVisibility;
    thumbnailUrl?: string;
    screenshots: string[];
    signalScore?: SignalScore;
    views: number;
    stars: number;
    createdAt: Date;
    updatedAt: Date;
}

// Signal Score types
export interface SignalScore {
    id: string;
    projectId: string;
    overall: number;
    githubActivity: number;
    codeQuality: number;
    userExperience: number;
    innovation: number;
    completeness: number;
    lastEvaluated: Date;
}

// Request types
export type RequestType = 'intro' | 'poc' | 'hiring';
export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface Request {
    id: string;
    fromUserId: string;
    toUserId?: string; // For direct messages
    projectId?: string; // For project-related requests
    type: RequestType;
    status: RequestStatus;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

// Interaction types
export type InteractionType = 'view' | 'bookmark' | 'share';

export interface Interaction {
    id: string;
    userId: string;
    projectId: string;
    type: InteractionType;
    timestamp: Date;
}

// Form types
export interface SignUpFormData {
    email: string;
    password: string;
    displayName: string;
    role: UserRole;
    studentProfile?: StudentProfile;
    founderProfile?: FounderProfile;
}

export interface SignInFormData {
    email: string;
    password: string;
}

export interface ProjectFormData {
    title: string;
    teamName: string;
    hackathon?: string;
    description: string;
    githubUrl: string;
    techStack?: string[];
    domain: string;
    trl?: number;
    videoUrl?: string;
    demoUrl?: string;
    visibility?: ProjectVisibility;
}
