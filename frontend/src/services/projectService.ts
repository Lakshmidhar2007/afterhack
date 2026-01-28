import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    updateDoc,
    serverTimestamp,
    startAfter,
    type DocumentData,
    type QueryConstraint,
    type QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, ProjectFormData, ProjectStatus } from '@/types';

const PROJECTS_COLLECTION = 'projects';

// Helper to convert Firestore doc to Project type
const convertDocToProject = (docSnapshot: DocumentData): Project => {
    const data = docSnapshot.data();
    return {
        id: docSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        // Ensure arrays are initialized
        techStack: data.techStack || [],
        teamMembers: data.teamMembers || [],
        screenshots: data.screenshots || [],
    } as Project;
};

export const projectService = {
    // Create a new project
    async createProject(userId: string, data: ProjectFormData & { screenshots?: string[] }): Promise<string> {
        try {
            const projectData = {
                ...data,
                userId, // Owner
                teamMembers: [userId], // Add owner to team
                status: 'published' as ProjectStatus, // Default to published for now
                views: 0,
                stars: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                screenshots: data.screenshots || [],
            };

            const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectData);
            return docRef.id;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    // Get a single project by ID
    async getProject(id: string): Promise<Project | null> {
        try {
            const docRef = doc(db, PROJECTS_COLLECTION, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return convertDocToProject(docSnap);
            }
            return null;
        } catch (error) {
            console.error('Error getting project:', error);
            throw error;
        }
    },

    // Get projects with filtering and pagination
    async getProjects(filters?: {
        userId?: string;
        domain?: string;
        limit?: number;
        status?: ProjectStatus;
        lastVisible?: QueryDocumentSnapshot<DocumentData>;
    }): Promise<{ projects: Project[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> {
        try {
            const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

            if (filters?.userId) {
                constraints.push(where('userId', '==', filters.userId));
            }

            if (filters?.domain) {
                constraints.push(where('domain', '==', filters.domain));
            }

            if (filters?.status) {
                constraints.push(where('status', '==', filters.status));
            } else {
                if (!filters?.userId) {
                    constraints.push(where('status', '==', 'published'));
                }
            }

            if (filters?.lastVisible) {
                constraints.push(startAfter(filters.lastVisible));
            }

            const limitCount = filters?.limit || 20;
            constraints.push(limit(limitCount));

            const q = query(collection(db, PROJECTS_COLLECTION), ...constraints);
            const querySnapshot = await getDocs(q);

            const projects = querySnapshot.docs.map(convertDocToProject);
            const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

            return { projects, lastVisible };
        } catch (error) {
            console.error('Error getting projects:', error);
            throw error;
        }
    },

    // Update a project
    async updateProject(id: string, data: Partial<ProjectFormData>): Promise<void> {
        try {
            const docRef = doc(db, PROJECTS_COLLECTION, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    }
};
