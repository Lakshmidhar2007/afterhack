import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const storageService = {
    // Upload a file and return the download URL
    async uploadFile(file: File, path: string): Promise<string> {
        try {
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            return await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    },

    // Delete a file
    async deleteFile(path: string): Promise<void> {
        try {
            const storageRef = ref(storage, path);
            await deleteObject(storageRef);
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }
};
