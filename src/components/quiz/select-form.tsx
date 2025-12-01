'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useQuizStore from '@/components/quiz/store';
import { getQuestionCounts } from '@/lib/actions';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Subject, AnswerFilter } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

type SubjectWithCount = Subject & { questionCount: number };

type SelectFormProps = {
  subjects: SubjectWithCount[];
};

const initialCounts: Record<AnswerFilter, number> = {
    all: 0,
    unanswered: 0,
    correct: 0,
    incorrect: 0,
    answered: 0,
    bookmarked: 0,
};

export function SelectForm({ subjects }: SelectFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const setQuizConfig = useQuizStore((state) => state.setQuizConfig);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [answerFilter, setAnswerFilter] = useState<AnswerFilter>('all');
  const [numQuestions, setNumQuestions] = useState(10);
  const [questionCounts, setQuestionCounts] = useState(initialCounts);
  const [isCountsLoading, setIsCountsLoading] = useState(false);

  useEffect(() => {
    // Reset quiz state when component mounts
    useQuizStore.getState().resetQuiz();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchCounts = async () => {
      if (selectedSubjects.length > 0) {
        setIsCountsLoading(true);
        const result = await getQuestionCounts(selectedSubjects, user.id);
        if (result.success && result.counts) {
          setQuestionCounts(result.counts);
        } else {
          toast({ variant: 'destructive', title: 'Error', description: result.error });
          setQuestionCounts(initialCounts);
        }
        setIsCountsLoading(false);
      } else {
        setQuestionCounts(initialCounts);
      }
    };

    fetchCounts();
  }, [selectedSubjects, user, toast]);

  const availableQuestions = questionCounts[answerFilter] || 0;
  const maxQuestions = Math.min(availableQuestions, 30);

  useEffect(() => {
    setNumQuestions((prev) => Math.min(prev, maxQuestions > 0 ? maxQuestions : 10));
  }, [answerFilter, maxQuestions]);


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
    if (availableQuestions === 0) {
         toast({
            variant: 'destructive',
            title: 'No questions available',
            description: 'There are no questions for the selected filter. Please choose another one.',
        });
        return;
    }
    setQuizConfig({
      subjectIds: selectedSubjects,
      answerFilter,
      numQuestions: Math.min(numQuestions, maxQuestions),
    });
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
                    disabled={subject.questionCount === 0}
                  />
                  <Label htmlFor={subject.id} className="text-base flex items-center gap-2">
                    {subject.name}
                    <Badge variant="secondary" className={subject.questionCount === 0 ? 'text-muted-foreground' : ''}>{subject.questionCount}</Badge>
                  </Label>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground">No subjects found. Please add some in the Admin Panel.</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-lg">2. Select Question Type</h3>
            {isCountsLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          </div>
          <RadioGroup
            defaultValue="all"
            onValueChange={(value: AnswerFilter) => setAnswerFilter(value)}
            disabled={selectedSubjects.length === 0}
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="r1" className="flex items-center gap-2 text-base">
                <RadioGroupItem value="all" id="r1" />
                All Questions
              </Label>
              <Badge variant="outline">{questionCounts.all}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="r2" className="flex items-center gap-2 text-base">
                <RadioGroupItem value="unanswered" id="r2" />
                Unanswered
              </Label>
              <Badge variant="outline">{questionCounts.unanswered}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="r3" className="flex items-center gap-2 text-base">
                <RadioGroupItem value="incorrect" id="r3" />
                Previously Incorrect
              </Label>
               <Badge variant="outline">{questionCounts.incorrect}</Badge>
            </div>
             <div className="flex items-center justify-between">
                <Label htmlFor="r4" className="flex items-center gap-2 text-base">
                    <RadioGroupItem value="correct" id="r4" />
                    Previously Correct
                </Label>
                <Badge variant="outline">{questionCounts.correct}</Badge>
            </div>
             <div className="flex items-center justify-between">
                <Label htmlFor="r5" className="flex items-center gap-2 text-base">
                    <RadioGroupItem value="bookmarked" id="r5" />
                    Bookmarked
                </Label>
                <Badge variant="outline">{questionCounts.bookmarked}</Badge>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
            <h3 className="font-semibold text-lg">3. Number of Questions</h3>
            <div className="flex items-center justify-between">
                <Label htmlFor="num-questions">
                Number of questions: {numQuestions}
                </Label>
                <Badge variant="outline">
                Available: {maxQuestions}
                </Badge>
            </div>
            <Slider
                id="num-questions"
                min={1}
                max={maxQuestions > 0 ? maxQuestions : 1}
                value={[numQuestions]}
                onValueChange={(value) => setNumQuestions(value[0])}
                disabled={availableQuestions === 0}
            />
        </div>

      </CardContent>
      <CardFooter>
        <Button onClick={handleStartQuiz} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={selectedSubjects.length === 0 || availableQuestions === 0}>
          Start Quiz
        </Button>
      </CardFooter>
    </>
  );
}
