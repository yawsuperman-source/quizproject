'use client';

import { useState, useEffect } from 'react';
import useQuizStore from '@/components/quiz/store';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export function TimerDisplay() {
  const { user } = useAuth();
  const { startTime, timer, endQuiz, isQuizFinished } = useQuizStore();
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    if (!startTime || isQuizFinished) return;

    const endTime = startTime + timer * 60 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const newRemainingTime = Math.max(0, endTime - now);
      setRemainingTime(newRemainingTime);

      if (newRemainingTime === 0) {
        if (user) {
            endQuiz(user.id);
        }
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, timer, endQuiz, isQuizFinished, user]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (remainingTime === null || isQuizFinished) return null;

  return (
    <Card className="fixed top-4 right-4 z-50 w-[150px]">
      <CardContent className="p-3 flex items-center justify-center space-x-2">
        <Clock className="h-6 w-6 text-primary" />
        <span className="text-2xl font-bold font-mono tracking-widest">
          {formatTime(remainingTime)}
        </span>
      </CardContent>
    </Card>
  );
}
