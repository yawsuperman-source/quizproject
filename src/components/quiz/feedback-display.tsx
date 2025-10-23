'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

type FeedbackDisplayProps = {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
};

export function FeedbackDisplay({
  isCorrect,
  correctAnswer,
  explanation
}: FeedbackDisplayProps) {

  const isCode = correctAnswer.startsWith("'") && correctAnswer.endsWith("'");

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 animate-slide-down-and-fade">
      <Alert
        variant={isCorrect ? 'default' : 'destructive'}
        className={isCorrect ? 'border-success/50 text-success [&>svg]:text-success' : ''}
      >
        {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        <AlertTitle>{isCorrect ? 'Correct!' : 'Incorrect'}</AlertTitle>
        <AlertDescription>
          {!isCorrect && (
            <p>The correct answer is: <strong className={isCode ? 'font-code' : 'font-semibold'}>{correctAnswer}</strong></p>
          )}
        </AlertDescription>
      </Alert>

      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <CardTitle className="text-lg font-headline">Explanation</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm">{explanation}</p>
        </CardContent>
      </Card>
    </div>
  );
}
