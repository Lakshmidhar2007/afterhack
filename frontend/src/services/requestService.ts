import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    updateDoc,
    doc,
    serverTimestamp,
    onSnapshot,
    type DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Request, RequestType, RequestStatus } from '@/types';

const REQUESTS_COLLECTION = 'requests';

const convertDocToRequest = (docSnapshot: DocumentData): Request => {
    const data = docSnapshot.data();
    return {
        id: docSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Request;
};

export const requestService = {
    // Send a new request
    async sendRequest(fromUserId: string, data: {
        toUserId?: string;
        projectId?: string;
        type: RequestType;
        message: string;
    }): Promise<string> {
        try {
            const requestData = {
                ...data,
                fromUserId,
                status: 'pending' as RequestStatus,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, REQUESTS_COLLECTION), requestData);
            return docRef.id;
        } catch (error) {
            console.error('Error sending request:', error);
            throw error;
        }
    },

    // Get requests received by a user (e.g., founder requests to student or vice versa)
    async getReceivedRequests(userId: string): Promise<Request[]> {
        try {
            const q = query(
                collection(db, REQUESTS_COLLECTION),
                where('toUserId', '==', userId)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(convertDocToRequest);
        } catch (error) {
            console.error('Error fetching received requests:', error);
            throw error;
        }
    },

    // Get requests sent by a user
    async getSentRequests(userId: string): Promise<Request[]> {
        try {
            const q = query(
                collection(db, REQUESTS_COLLECTION),
                where('fromUserId', '==', userId)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(convertDocToRequest);
        } catch (error) {
            console.error('Error fetching sent requests:', error);
            throw error;
        }
    },

    // Update request status (accept/reject)
    async updateRequestStatus(id: string, status: RequestStatus): Promise<void> {
        try {
            const docRef = doc(db, REQUESTS_COLLECTION, id);
            await updateDoc(docRef, {
                status,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error updating request status:', error);
            throw error;
        }
    },

    // Subscribe to received requests
    subscribeToReceivedRequests(userId: string, callback: (requests: Request[]) => void): () => void {
        const q = query(
            collection(db, REQUESTS_COLLECTION),
            where('toUserId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(convertDocToRequest);
            callback(requests);
        }, (error) => {
            console.error('Error subscribing to received requests:', error);
        });
    },

    // Subscribe to sent requests
    subscribeToSentRequests(userId: string, callback: (requests: Request[]) => void): () => void {
        const q = query(
            collection(db, REQUESTS_COLLECTION),
            where('fromUserId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(convertDocToRequest);
            callback(requests);
        }, (error) => {
            console.error('Error subscribing to sent requests:', error);
        });
    }
};
