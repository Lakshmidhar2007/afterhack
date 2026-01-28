import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCZVk6vkjBnl7UXJWvQsvE3Ql1uhLnVsIk",
    authDomain: "afterhacks-2cc4a.firebaseapp.com",
    projectId: "afterhacks-2cc4a",
    storageBucket: "afterhacks-2cc4a.firebasestorage.app",
    messagingSenderId: "501464202625",
    appId: "1:501464202625:web:de8e2a50ba91d53173bc80"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();

export default app;
