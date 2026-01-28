import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    type DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, UserRole } from '@/types';

const USERS_COLLECTION = 'users';

// Helper to convert Firestore doc to User type
const convertDocToUser = (docSnapshot: DocumentData): User => {
    const data = docSnapshot.data();
    return {
        id: docSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    } as User;
};

export const userService = {
    // Get user profile by ID
    async getUser(userId: string): Promise<User | null> {
        try {
            const docRef = doc(db, USERS_COLLECTION, userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return convertDocToUser(docSnap);
            }
            return null;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    // Update user profile
    async updateUser(userId: string, data: Partial<User>): Promise<void> {
        try {
            const docRef = doc(db, USERS_COLLECTION, userId);
            await updateDoc(docRef, data);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    // Get users by role (e.g. find all founders for students to browse)
    async getUsersByRole(role: UserRole): Promise<User[]> {
        try {
            const q = query(
                collection(db, USERS_COLLECTION),
                where('role', '==', role)
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(convertDocToUser);
        } catch (error) {
            console.error('Error fetching users by role:', error);
            throw error;
        }
    }
};
