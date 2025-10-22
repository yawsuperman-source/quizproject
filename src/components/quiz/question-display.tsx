'use client';

import type { Question } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type QuestionDisplayProps = {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  isSubmitted: boolean;
};

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  isSubmitted
}: QuestionDisplayProps) {
    
  return (
    <Card className="w-full max-w-3xl mx-auto animate-slide-down-and-fade">
      <CardHeader>
        <CardDescription>
          Question {questionNumber} of {totalQuestions}
        </CardDescription>
        <CardTitle className="text-2xl font-headline">{question.questionText}</CardTitle>
        {question.questionText.includes('`') && (
            <p className="text-sm text-muted-foreground mt-2">
              Note: Code snippets are displayed using a <code className="font-code bg-muted p-1 rounded-sm">monospace font</code>.
            </p>
        )}
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer || ''}
          onValueChange={onAnswerSelect}
          disabled={isSubmitted}
          className="space-y-4"
        >
          {question.options.map((option, index) => {
            const isCorrect = option === question.correctAnswer;
            const isSelected = option === selectedAnswer;
            let itemClass = '';
            if (isSubmitted) {
              if (isCorrect) itemClass = 'border-success text-success';
              else if (isSelected && !isCorrect) itemClass = 'border-destructive text-destructive';
            }

            const isCode = option.startsWith("'") && option.endsWith("'");

            return (
              <Label
                key={index}
                htmlFor={`option-${index}`}
                className={`flex items-center space-x-3 p-4 border rounded-md transition-all cursor-pointer hover:bg-secondary/50 ${itemClass} ${isSubmitted ? 'cursor-not-allowed' : ''}`}
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <span className={isCode ? 'font-code' : 'font-body'}>{option}</span>
              </Label>
            )
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
