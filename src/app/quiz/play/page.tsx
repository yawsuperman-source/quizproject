'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useQuizStore from '@/components/quiz/store';
import { getQuizQuestions, saveUserAnswer } from '@/lib/actions';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { answerExplanationWithLLM } from '@/ai/flows/answer-explanation-with-llm';

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
    questions,
    setQuestions,
    currentQuestionIndex,
    nextQuestion,
    recordAnswer,
    isQuizFinished,
  } = useQuizStore();

  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [llmExplanation, setLlmExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  useEffect(() => {
    if (subjectIds.length === 0) {
      // Redirect if the page is reloaded or accessed directly
      router.replace('/quiz/select');
      return;
    }

    async function fetchQuestions() {
      if (!user) return;
      setLoading(true);
      const result = await getQuizQuestions(subjectIds, answerFilter, user.id);
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
  }, [subjectIds, answerFilter, setQuestions, router, user, toast]);
  
  useEffect(() => {
    if(isQuizFinished){
      router.push('/quiz/results');
    }
  }, [isQuizFinished, router])

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const progressValue = useMemo(() => (questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0), [currentQuestionIndex, questions.length]);


  const handleSubmit = async () => {
    if (!selectedAnswer) {
        toast({
            variant: 'destructive',
            title: 'No answer selected',
            description: 'Please choose an option before submitting.',
        });
        return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsSubmitted(true);
    recordAnswer(isCorrect);
    if(user) {
        saveUserAnswer(user.id, currentQuestion.id, isCorrect);
    }

    setIsLoadingExplanation(true);
    try {
        const explanationResult = await answerExplanationWithLLM({
            question: currentQuestion.questionText,
            correctAnswer: currentQuestion.correctAnswer,
            userAnswer: selectedAnswer,
            explanation: currentQuestion.explanation,
        });
        setLlmExplanation(explanationResult.llmExplanation);
    } catch (error) {
        console.error("Error fetching LLM explanation:", error);
        setLlmExplanation("Could not load AI explanation. Using default: " + currentQuestion.explanation);
    } finally {
        setIsLoadingExplanation(false);
    }
  };

  const handleNext = () => {
    setIsSubmitted(false);
    setSelectedAnswer(null);
    setLlmExplanation(null);
    nextQuestion();
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
                onAnswerSelect={setSelectedAnswer}
                isSubmitted={isSubmitted}
            />
        )}
        
        {isSubmitted && (
            <FeedbackDisplay 
                isCorrect={selectedAnswer === currentQuestion.correctAnswer}
                correctAnswer={currentQuestion.correctAnswer}
                llmExplanation={llmExplanation}
                isLoadingExplanation={isLoadingExplanation}
            />
        )}

        <div className="flex justify-end">
          {isSubmitted ? (
            <Button onClick={handleNext} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          ) : (
            <Button onClick={handleSubmit} size="lg">
              Submit Answer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
