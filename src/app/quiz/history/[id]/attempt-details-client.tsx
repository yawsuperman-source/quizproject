'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { getQuizAttempt } from '@/lib/actions';
import type { QuizAttempt, QuizAttemptQuestion, Question } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { QuestionDisplay } from '@/components/quiz/question-display';
import { FeedbackDisplay } from '@/components/quiz/feedback-display';

interface AttemptDetails extends Omit<QuizAttempt, 'questions'> {
  questions: QuizAttemptQuestion[];
}

export default function AttemptDetailsClientPage({ id }: { id: string }) {
  const [attempt, setAttempt] = useState<AttemptDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getQuizAttempt(id).then(data => {
      if (data.success && data.attempt) {
        setAttempt(data.attempt as AttemptDetails);
      }
      setLoading(false);
    });
  }, [id]);

  const handleNext = () => {
    if (attempt && currentQuestionIndex < attempt.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const currentQuestionData = useMemo(() => {
      if (!attempt) return null;
      const currentQ = attempt.questions[currentQuestionIndex];
      // Explicitly map the properties to match the 'Question' type.
      // This is the most robust way to fix the mismatch.
      const questionForDisplay: Question = {
          id: currentQ.questionId,
          questionText: currentQ.questionText,
          options: currentQ.options,
          correctAnswer: currentQ.correctAnswer,
          subjectId: currentQ.subjectId,
          explanation: currentQ.explanation,
      };
      return questionForDisplay;
  }, [attempt, currentQuestionIndex]);
  
  const progress = useMemo(() => attempt ? ((currentQuestionIndex + 1) / attempt.questions.length) * 100 : 0, [attempt, currentQuestionIndex]);

  if (loading) {
    return (
      <div className="container py-12 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-8" />
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-80 w-full mb-8" />
        <div className="flex justify-between">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    );
  }

  if (!attempt || !currentQuestionData) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">Attempt not found</h1>
        <p className="text-muted-foreground mb-6">This quiz attempt could not be found.</p>
        <Button asChild>
            <Link href="/quiz/history">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to History
            </Link>
        </Button>
      </div>
    );
  }
  
  const { correctAnswer, explanation } = currentQuestionData;
  const userAnswer = attempt.questions[currentQuestionIndex].userAnswer;
  const isCorrect = userAnswer === correctAnswer;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Quiz Review</h1>
            <p className="text-muted-foreground">
                Taken on {new Date(attempt.timestamp).toLocaleString()} | Score: {attempt.score}%
            </p>
        </div>

        <Progress value={progress} className="w-full" />
        
        <QuestionDisplay
            question={currentQuestionData}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={attempt.questions.length}
            selectedAnswer={userAnswer}
            onAnswerSelect={() => {}} // Read-only
            isSubmitted={true}
        />
        
        <FeedbackDisplay 
            isCorrect={isCorrect}
            correctAnswer={correctAnswer}
            explanation={explanation}
        />

        <div className="flex justify-between items-center pt-4">
            <Button onClick={handlePrevious} variant="outline" size="lg" disabled={currentQuestionIndex === 0}>
                <ChevronLeft className="mr-2 h-4 w-4"/>
                Previous
            </Button>
            {currentQuestionIndex === attempt.questions.length - 1 ? (
                <Button asChild size="lg">
                    <Link href="/quiz/history">
                        <Home className="mr-2 h-4 w-4" />
                        Back to History
                    </Link>
                </Button>
            ) : (
                <Button onClick={handleNext} size="lg" >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            )}
        </div>
      </div>
    </div>
  );
}
