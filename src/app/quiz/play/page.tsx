'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useQuizStore from '@/components/quiz/store';
import { getQuizQuestions, saveUserAnswer } from '@/lib/actions';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

import { QuestionDisplay } from '@/components/quiz/question-display';
import { FeedbackDisplay } from '@/components/quiz/feedback-display';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function PlayQuizPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    subjectIds,
    answerFilter,
    numQuestions,
    questions,
    setQuestions,
    currentQuestionIndex,
    nextQuestion,
    previousQuestion,
    userAnswers,
    isSubmitted,
    recordAnswer,
    isQuizFinished,
    endQuiz,
  } = useQuizStore();

  const [loading, setLoading] = useState(true);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (subjectIds.length === 0) {
      router.replace('/quiz/select');
      return;
    }

    async function fetchQuestions() {
      if (!user) return;
      setLoading(true);
      const result = await getQuizQuestions(subjectIds, answerFilter, user.id, numQuestions);
      if (result.success && result.questions) {
        setQuestions(result.questions);
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to load quiz',
          description: result.error,
        });
        router.replace('/quiz/select');
      }
      setLoading(false);
    }
    fetchQuestions();
  }, [subjectIds, answerFilter, numQuestions, setQuestions, router, user, toast]);
  
  useEffect(() => {
    if(isQuizFinished){
      router.push('/quiz/results');
    }
  }, [isQuizFinished, router])

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const progressValue = useMemo(() => (questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0), [currentQuestionIndex, questions.length]);

  const isCurrentQuestionSubmitted = useMemo(() => {
    if (!isSubmitted || isSubmitted.length === 0) {
        return false;
    }
    return isSubmitted[currentQuestionIndex];
  }, [isSubmitted, currentQuestionIndex]);

  useEffect(() => {
    if (userAnswers && userAnswers.length > 0) {
        setSelectedAnswer(userAnswers[currentQuestionIndex] || null);
    }
  }, [currentQuestionIndex, userAnswers]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    recordAnswer(answer);
    if (user && currentQuestion) {
      const isCorrect = answer === currentQuestion.correctAnswer;
      saveUserAnswer(user.id, currentQuestion.id, isCorrect);
    }
  };

  const handleNext = async () => {
    if (!user) return;
    await nextQuestion(user.id);
  };

  const handleEndQuiz = async () => {
    if (!user) return;
    await endQuiz(user.id);
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
        <div className="container flex items-center justify-center py-20">
            <Card className="max-w-md text-center">
                <CardHeader>
                    <CardTitle>No Questions Found</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>We couldn't find any questions matching your criteria.</p>
                    <Button asChild>
                        <Link href="/quiz/select">Try Different Options</Link>
                    </Button>
                </CardContent>
            </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <Progress value={progressValue} className="w-full" />
        
        {currentQuestion && (
            <QuestionDisplay
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={handleAnswerSelect}
                isSubmitted={isCurrentQuestionSubmitted}
            />
        )}
        
        {isCurrentQuestionSubmitted && (
            <FeedbackDisplay 
                isCorrect={userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer}
                correctAnswer={currentQuestion.correctAnswer}
                explanation={currentQuestion.explanation}
            />
        )}

        <div className="flex justify-between items-center">
            <div>
                <Button onClick={handlePrevious} variant="outline" size="lg" disabled={currentQuestionIndex === 0}>Previous</Button>
            </div>
            <div className="flex items-center space-x-4">
                <Button onClick={handleEndQuiz} variant="destructive" size="lg">End Quiz</Button>
                <Button onClick={handleNext} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
