'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthContext } from '@/hooks/use-auth';
import type { User } from '@/lib/types';
import { checkUserRole, getMockUserById } from '@/lib/auth';
import { Skeleton } from './ui/skeleton';

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, onAuthStateChanged would be sufficient.
    // For mock, we check if there's a user in localStorage.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            // In a real app, you might fetch additional user profile data from Firestore.
            // For mock, we'll use our mock data.
            const fullUser = await getMockUserById(firebaseUser.uid);
            if(fullUser) {
                const role = await checkUserRole(fullUser.id);
                setUser({ ...fullUser, id: firebaseUser.uid });
                setIsAdmin(role === 'admin');
            } else {
                 setUser(null);
                 setIsAdmin(false);
            }
        } else {
            setUser(null);
            setIsAdmin(false);
        }
        setLoading(false);
    });

    // Fallback for mock environment if onAuthStateChanged doesn't fire as expected
    const checkMockAuth = async () => {
        try {
            const storedUser = localStorage.getItem('quizmaster_user');
            if (storedUser) {
                const parsedUser: User = JSON.parse(storedUser);
                const role = await checkUserRole(parsedUser.id);
                setUser(parsedUser);
                setIsAdmin(role === 'admin');
            }
        } catch (error) {
            console.error("Failed to parse mock user from local storage", error);
        }
        setTimeout(() => setLoading(false), 500);
    };

    if (process.env.NODE_ENV === 'development') {
        checkMockAuth();
    }
    

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
