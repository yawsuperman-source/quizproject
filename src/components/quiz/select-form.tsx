'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useQuizStore from '@/components/quiz/store';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Subject, AnswerFilter } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type SelectFormProps = {
  subjects: Subject[];
};

export function SelectForm({ subjects }: SelectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const setQuizConfig = useQuizStore((state) => state.setQuizConfig);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [answerFilter, setAnswerFilter] = useState<AnswerFilter>('all');
  
  useEffect(() => {
    // Reset quiz state when component mounts
    useQuizStore.getState().resetQuiz();
  }, []);

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleStartQuiz = () => {
    if (selectedSubjects.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No subjects selected',
        description: 'Please select at least one subject to start the quiz.',
      });
      return;
    }
    setQuizConfig({ subjectIds: selectedSubjects, answerFilter });
    router.push('/quiz/play');
  };

  return (
    <>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">1. Choose Subjects</h3>
          {subjects.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject.id}
                    onCheckedChange={() => handleSubjectChange(subject.id)}
                  />
                  <Label htmlFor={subject.id} className="text-base">
                    {subject.name}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground">No subjects found. Please add some in the Admin Panel.</p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">2. Select Question Type</h3>
          <RadioGroup
            defaultValue="all"
            onValueChange={(value: AnswerFilter) => setAnswerFilter(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="r1" />
              <Label htmlFor="r1">All Questions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unanswered" id="r2" />
              <Label htmlFor="r2">Unanswered Questions Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="incorrect" id="r3" />
              <Label htmlFor="r3">Previously Incorrect Questions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="correct" id="r4" />
              <Label htmlFor="r4">Previously Correct Questions</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartQuiz} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          Start Quiz
        </Button>
      </CardFooter>
    </>
  );
}
