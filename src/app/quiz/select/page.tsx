'use server';

import { getSubjects } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { SelectForm } from '@/components/quiz/select-form';
import { PageTitle } from '@/components/ui/page-title';

export default async function SelectQuizPage() {
  const { subjects, error } = await getSubjects();

  if (error || !subjects) {
    return <p className="text-destructive">{error || 'Could not load subjects.'}</p>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <PageTitle
          title="Customize Your Quiz"
          description="Choose your subjects and how you want to be quizzed."
        />
        <Card>
            <CardContent className="pt-6">
                <SelectForm subjects={subjects} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
