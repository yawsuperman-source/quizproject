'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useQuizStore from '@/components/quiz/store';
import { ResultsChart } from '@/components/quiz/results-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Confetti from 'react-dom-confetti';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const { correctAnswers, incorrectAnswers, questions, userAnswers, resetQuiz } = useQuizStore();
  const totalQuestions = questions.length;
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    // If user lands here without finishing a quiz, redirect.
    if(totalQuestions === 0) {
      router.replace('/quiz/select');
    }
  }, [totalQuestions, router]);

  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  const getFeedback = () => {
    if (score === 100) return "Perfect Score! You're a true QuizMaster!";
    if (score >= 80) return "Excellent work! You really know your stuff.";
    if (score >= 60) return "Good job! A little more practice and you'll be an expert.";
    if (score >= 40) return "Not bad, but there's room for improvement. Keep trying!";
    return "Don't give up! Review your answers and try again.";
  }
  
  const handlePlayAgain = () => {
      resetQuiz();
      router.push('/quiz/select');
  }

  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
       <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Confetti active={score >= 80} config={confettiConfig} />
      </div>
      <div className="max-w-3xl mx-auto">
        <Card className="w-full text-center mb-8">
          <CardHeader>
            <CardTitle className="text-4xl font-headline">Quiz Complete!</CardTitle>
            <CardDescription className="text-lg">{getFeedback()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-4xl font-bold text-primary">{score}%</p>
                <p className="text-sm text-muted-foreground">Your Score</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-green-500">{correctAnswers}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-red-500">{incorrectAnswers}</p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResultsChart correct={correctAnswers} incorrect={incorrectAnswers} />
            </div>

            <div className="flex justify-center gap-4 pt-4">
                <Button onClick={handlePlayAgain} size="lg">Play Again</Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10">
            <h2 className="text-2xl font-bold text-center mb-4 font-headline">Review Your Answers</h2>
            <Accordion type="single" collapsible className="w-full">
              {questions.map((q, index) => {
                const userAnswer = userAnswers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                  <AccordionItem value={`item-${index}`} key={q.id}>
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full pr-4">
                        <p className="text-left truncate w-11/12">{q.questionText}</p>
                        {isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-muted/50 rounded-md">
                      <p className="mb-2 text-sm">Your answer: <span className={isCorrect ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>{userAnswer}</span></p>
                      <p className="mb-4 text-sm">Correct answer: <span className="font-semibold text-green-600">{q.correctAnswer}</span></p>
                      <h4 className="font-semibold mb-2">Explanation:</h4>
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{q.explanation}</ReactMarkdown>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
        </div>
      </div>
    </div>
  );
}
