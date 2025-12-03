'use client';

import { useEffect, useState } from 'react';
import { getQuizAttempt } from '@/lib/actions';
import type { QuizAttempt } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getSubjectName } from '@/lib/utils';

export default function ReviewPage({ params }: { params: { attemptId: string } }) {
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        setLoading(true);
        const data = await getQuizAttempt(params.attemptId);
        if (!data) {
          setError('Quiz attempt not found.');
        } else {
          setAttempt(data);
        }
      } catch (err) {
        setError('Failed to load quiz attempt.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [params.attemptId]);

  if (loading) {
    return <div className="container mx-auto py-10 px-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-10 px-4 text-center text-red-500">{error}</div>;
  }

  if (!attempt) {
    return <div className="container mx-auto py-10 px-4 text-center">No quiz data found.</div>;
  }

  const subjectNames = attempt.subjectIds.map(getSubjectName).join(', ');

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Reviewing Your Quiz</CardTitle>
            <div className="text-sm text-muted-foreground pt-2">
              <p>Subject(s): {subjectNames}</p>
              <p>Score: {attempt.score}%</p>
              <p>Date: {new Date(attempt.timestamp).toLocaleString()}</p>
            </div>
          </CardHeader>
        </Card>

        <h2 className="text-2xl font-bold text-center mb-4 font-headline">Your Answers</h2>
        <Accordion type="single" collapsible className="w-full">
          {attempt.questions.map((q, index) => {
            const isCorrect = q.userAnswer === q.correctAnswer;
            return (
              <AccordionItem value={`item-${index}`} key={q.questionId}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <p className="text-left truncate w-11/12">{q.questionText}</p>
                    {isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-muted/50 rounded-md">
                  <p className="mb-2 text-sm">
                    Your answer: <span className={isCorrect ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>{q.userAnswer || 'Not Answered'}</span>
                  </p>
                  {!isCorrect && (
                    <p className="mb-4 text-sm">
                      Correct answer: <span className="font-semibold text-green-600">{q.correctAnswer}</span>
                    </p>
                  )}
                  <h4 className="font-semibold mb-2">Explanation:</h4>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{q.explanation}</ReactMarkdown>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        <div className="flex justify-center mt-8">
            <Button asChild size="lg">
                <Link href="/quiz/history">Back to Quiz History</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
