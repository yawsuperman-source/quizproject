'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from '@/hooks/use-auth';
import type { User } from '@/lib/types';
import { checkUserRole } from '@/lib/auth';
import { Skeleton } from './ui/skeleton';

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
        setLoading(true);
        try {
            const storedUser = localStorage.getItem('quizmaster_user');
            if (storedUser) {
                const parsedUser: User = JSON.parse(storedUser);
                const role = await checkUserRole(parsedUser.id);
                setUser(parsedUser);
                setIsAdmin(role === 'admin');
            } else {
                setUser(null);
                setIsAdmin(false);
            }
        } catch (error) {
            console.error("Failed to parse user from local storage", error);
            setUser(null);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    checkAuth();
    
    const handleStorageChange = () => {
        checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for a custom event that we can dispatch on login/logout
    window.addEventListener('authChange', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('authChange', handleStorageChange);
    };
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
