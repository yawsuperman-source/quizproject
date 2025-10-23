'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from '@/hooks/use-auth';
import type { User } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebase';

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Direct check for admin email, removing the dependency on checkUserRole
        const isAdminUser = firebaseUser.email === 'admin@quizmaster.com';
        const appUser: User = {
          ...firebaseUser,
          id: firebaseUser.uid,
          isAdmin: isAdminUser
        };
        setUser(appUser);
        setIsAdmin(isAdminUser);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {loading ? (
         <div className="w-full h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}
