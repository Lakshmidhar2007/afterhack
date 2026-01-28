'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut,
    updateProfile,
    User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { User, UserRole, StudentProfile, FounderProfile } from '@/types';

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (
        email: string,
        password: string,
        displayName: string,
        role: UserRole,
        profile?: StudentProfile | FounderProfile
    ) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user data from Firestore
    const fetchUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
        try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
                return { id: userDoc.id, ...userDoc.data() } as User;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setFirebaseUser(firebaseUser);

            if (firebaseUser) {
                const userData = await fetchUserData(firebaseUser);
                setUser(userData);
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Sign in with email/password
    const signIn = async (email: string, password: string) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const userData = await fetchUserData(result.user);
            setUser(userData);
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    };

    // Sign up with email/password
    const signUp = async (
        email: string,
        password: string,
        displayName: string,
        role: UserRole,
        profile?: StudentProfile | FounderProfile
    ) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update Firebase profile
            await updateProfile(result.user, { displayName });

            // Create user document in Firestore
            const userData: Omit<User, 'id'> = {
                email,
                displayName,
                ...(result.user.photoURL && { photoURL: result.user.photoURL }),
                role,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            if (role === 'student' && profile) {
                userData.studentProfile = profile as StudentProfile;
            } else if ((role === 'founder' || role === 'recruiter') && profile) {
                userData.founderProfile = profile as FounderProfile;
            }

            await setDoc(doc(db, 'users', result.user.uid), {
                ...userData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            setUser({ id: result.user.uid, ...userData });
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);

            // Check if user exists in Firestore
            const existingUser = await fetchUserData(result.user);

            if (!existingUser) {
                // New user - they'll need to complete their profile
                const userData: Omit<User, 'id'> = {
                    email: result.user.email || '',
                    displayName: result.user.displayName || '',
                    ...(result.user.photoURL && { photoURL: result.user.photoURL }),
                    role: 'student', // Default role, can be changed in profile
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                await setDoc(doc(db, 'users', result.user.uid), {
                    ...userData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });

                setUser({ id: result.user.uid, ...userData });
            } else {
                setUser(existingUser);
            }
        } catch (error) {
            console.error('Google sign in error:', error);
            throw error;
        }
    };

    // Sign out
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    // Update user profile
    const updateUserProfile = async (data: Partial<User>) => {
        if (!firebaseUser) throw new Error('No user logged in');

        try {
            await setDoc(
                doc(db, 'users', firebaseUser.uid),
                { ...data, updatedAt: serverTimestamp() },
                { merge: true }
            );

            // Update display name in Firebase Auth if changed
            if (data.displayName) {
                await updateProfile(firebaseUser, { displayName: data.displayName });
            }

            // Refresh user data
            const updatedUser = await fetchUserData(firebaseUser);
            setUser(updatedUser);
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                firebaseUser,
                loading,
                signIn,
                signUp,
                signInWithGoogle,
                signOut,
                updateUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
