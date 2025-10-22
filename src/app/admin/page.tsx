import { getAllQuestions, getSubjects } from '@/lib/data';
import { QuestionsTable } from '@/components/admin/questions-table';
import { SubjectsManagement } from '@/components/admin/subjects-management';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function AdminPage() {
  const questions = await getAllQuestions();
  const subjects = await getSubjects();

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        <CardContent className="pt-6">
            <SubjectsManagement subjects={subjects} />
        </CardContent>
      </Card>
      <Separator />
      <Card>
        <CardContent className="pt-6">
            <QuestionsTable questions={questions} subjects={subjects} />
        </CardContent>
      </Card>
    </div>
  );
}
