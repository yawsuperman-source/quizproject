'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useQuizStore from '@/components/quiz/store';
import type { Question } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RedoQuizDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  questions: Question[];
};

export function RedoQuizDialog({ isOpen, onOpenChange, questions }: RedoQuizDialogProps) {
  const router = useRouter();
  const { startQuizWithQuestions } = useQuizStore();
  const [mode, setMode] = useState<'select' | 'exam'>('select');
  const [timer, setTimer] = useState(10);

  const handlePracticeRedo = () => {
    if (!questions || questions.length === 0) return;
    startQuizWithQuestions(questions, { isExamMode: false, timer: 0 });
    onOpenChange(false);
    router.push('/quiz/play');
  };

  const handleExamRedo = () => {
    if (!questions || questions.length === 0) return;
    startQuizWithQuestions(questions, { isExamMode: true, timer });
    onOpenChange(false);
    router.push('/quiz/play');
  };
  
  // Reset to selection screen when dialog is opened
  useEffect(() => {
    if (isOpen) {
      setMode('select');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {mode === 'select' && (
          <>
            <DialogHeader>
              <DialogTitle>Redo Quiz</DialogTitle>
              <DialogDescription>
                How would you like to redo this quiz?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-around py-4">
              <Button onClick={handlePracticeRedo} variant="outline" className="flex-1 mr-2">Practice Mode</Button>
              <Button onClick={() => setMode('exam')} className="flex-1 ml-2">Exam Mode</Button>
            </div>
          </>
        )}
        {mode === 'exam' && (
          <>
            <DialogHeader>
              <DialogTitle>Redo in Exam Mode</DialogTitle>
              <DialogDescription>
                Set a timer for your exam. You won't see feedback until the end.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timer" className="text-right">
                  Timer (minutes)
                </Label>
                <Input
                  id="timer"
                  type="number"
                  value={timer}
                  onChange={(e) => setTimer(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="col-span-3"
                  min={1}
                  max={180}
                />
              </div>
            </div>
            <DialogFooter>
                <Button onClick={() => setMode('select')} variant="ghost">Back</Button>
                <Button onClick={handleExamRedo}>Start Exam</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}