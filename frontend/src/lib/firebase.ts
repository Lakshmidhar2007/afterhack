import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAD_RzConnCJhxsxCIJLrSqYPVynNpnc5A",
    authDomain: "studio-8148291470-70625.firebaseapp.com",
    projectId: "studio-8148291470-70625",
    storageBucket: "studio-8148291470-70625.firebasestorage.app",
    messagingSenderId: "10904713228",
    appId: "1:10904713228:web:41cb493352db5ababe9629"
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
