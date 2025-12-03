'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getQuizHistory } from '@/lib/actions';
import type { QuizAttempt } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getQuizHistory(user.uid)
        .then(data => {
          if (data.success) {
            setHistory(data.quizzes || []);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Quiz History</h1>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Quiz History</h1>
      {history.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">You haven't completed any quizzes yet.</p>
            <Button asChild className="mt-4">
              <Link href="/quiz/select">Start a New Quiz</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map(attempt => (
            <Card key={attempt.id}>
              <CardContent className="pt-6 grid grid-cols-3 items-center gap-4">
                <div>
                  <p className="font-semibold">{new Date(attempt.timestamp).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">{attempt.subjectIds.join(', ')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{attempt.score}%</p>
                  <p className="text-sm text-muted-foreground">Score</p>
                </div>
                <div className="text-right">
                  <Button asChild>
                    <Link href={`/quiz/history/${attempt.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
