'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container flex items-center justify-center py-20">
        <Card className="max-w-md text-center">
            <CardHeader>
                <CardTitle>Authentication Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>You need to be logged in to start a quiz.</p>
                <Button asChild>
                    <Link href="/login">Go to Login</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
