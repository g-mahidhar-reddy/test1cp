
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import { useUser as useFirebaseUser, useAuth as useFirebaseAuth, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, Firestore } from 'firebase/firestore';


interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  login: (role: UserRole, email?: string, password?: string) => void;
  logout: () => void;
  signup: (role: UserRole, email: string, password: string, name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchAndSetUser = async (firebaseUser: FirebaseUser, firestore: Firestore, setUser: Dispatch<SetStateAction<User | null>>) => {
  const userDocRef = doc(firestore, 'users', firebaseUser.uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    setUser({ id: docSnap.id, ...docSnap.data() } as User);
    return { id: docSnap.id, ...docSnap.data() } as User;
  } else {
    // This case might happen if Firestore profile creation fails after auth creation.
    // We can try to recover by creating a profile now.
    const mockUser = mockUsers.find(u => u.email === firebaseUser.email) || mockUsers[0];
    const newUserProfile: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name: firebaseUser.displayName || mockUser.name || "New User",
      role: mockUser.role || 'student',
      avatarUrl: mockUser.avatarUrl,
      skills: [],
    };
    await setDoc(userDocRef, newUserProfile);
    setUser(newUserProfile);
    return newUserProfile;
  }
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user: firebaseUser, isUserLoading, userError } = useFirebaseUser();
  const auth = useFirebaseAuth();
  const firestore = useFirestore();

  useEffect(() => {
    // This effect handles the initial user load or auth state changes from Firebase
    if (!isUserLoading && firebaseUser && firestore && !user) {
        fetchAndSetUser(firebaseUser, firestore, setUser);
    } else if (!isUserLoading && !firebaseUser) {
        setUser(null);
    }
  }, [firebaseUser, isUserLoading, firestore, user]);


  useEffect(() => {
    if (isUserLoading) return;

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isDashboardPage = pathname.startsWith('/dashboard');

    if (!user && isDashboardPage) {
      router.push('/login');
    } else if (user && isAuthPage) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, pathname, router]);

  const login = async (role: UserRole, email = 'student@example.com', password = 'password') => {
    if (!auth || !firestore) return;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await fetchAndSetUser(userCredential.user, firestore, setUser);
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        // If user doesn't exist, sign them up and then log in.
        try {
          await signup(role, email, password, "New User", true);
        } catch (signupError) {
          console.error("Failed to sign up after failed login:", signupError);
        }
      } else {
        console.error("Failed to sign in:", error);
      }
    }
  };

  const signup = async (role: UserRole, email: string, password: string, name: string, redirect: boolean = true) => {
    if (!auth || !firestore) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user: newFirebaseUser } = userCredential;

      const newUserProfile: User = {
        id: newFirebaseUser.uid,
        name,
        email,
        role,
        skills: [],
      };
      
      const userDocRef = doc(firestore, 'users', newFirebaseUser.uid);
      await setDoc(userDocRef, newUserProfile);
      
      setUser(newUserProfile);
      if (redirect) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Failed to sign up:", error);
      throw error; // Re-throw to be caught by login function if needed
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const value = { user, setUser, loading: isUserLoading, login, logout, signup };

  if (isUserLoading && !user) {
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isLandingPage = pathname === '/';
    // Show loading spinner only on protected pages, not on auth or landing pages.
    if (!isAuthPage && !isLandingPage) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      );
    }
  }


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
