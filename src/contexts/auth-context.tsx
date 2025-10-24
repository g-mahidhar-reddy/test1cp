
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import { useUser as useFirebaseUser, useAuth as useFirebaseAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (role: UserRole, email?: string, password?: string) => void;
  logout: () => void;
  signup: (role: UserRole, email: string, password: string, name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user: firebaseUser, isUserLoading, userError } = useFirebaseUser();
  const auth = useFirebaseAuth();

  useEffect(() => {
    if (!isUserLoading && firebaseUser) {
      // This is a simplified mapping. In a real app, you would fetch user profile
      // from Firestore based on firebaseUser.uid
      const mockUser = mockUsers.find(u => u.email === firebaseUser.email) || mockUsers.find(u => u.role === 'student');
      if (mockUser) {
        setUser({
          ...mockUser,
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || mockUser.name,
        });
      } else {
         setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'New User',
            email: firebaseUser.email!,
            role: 'student', // default role
         });
      }
    } else if (!isUserLoading && !firebaseUser) {
      setUser(null);
    }
  }, [firebaseUser, isUserLoading]);


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
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        // If user doesn't exist, create them
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          router.push('/dashboard');
        } catch (signupError) {
          console.error("Failed to sign up after failed login:", signupError);
        }
      } else {
        console.error("Failed to sign in:", error);
      }
    }
  };

  const signup = async (role: UserRole, email: string, password: string, name: string) => {
    if (!auth) return;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // In a real app, you would also create a user document in Firestore here.
      // For now, the user state will be updated by the useEffect hook.
      router.push('/dashboard');
    } catch (error) {
      console.error("Failed to sign up:", error);
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

  const value = { user, loading: isUserLoading, login, logout, signup };

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
