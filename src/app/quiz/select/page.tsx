'use server';

import { getSubjects } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { SelectForm } from '@/components/quiz/select-form';

export default async function SelectQuizPage() {
  const subjects = await getSubjects();

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Customize Your Quiz</CardTitle>
          <CardDescription>Choose your subjects and how you want to be quizzed.</CardDescription>
        </CardHeader>
        <SelectForm subjects={subjects} />
      </Card>
    </div>
  );
}
