import { getAllQuestions, getSubjects } from '@/lib/data';
import { QuestionsTable } from '@/components/admin/questions-table';
import { Card, CardContent } from '@/components/ui/card';

export default async function AdminPage() {
  const questions = await getAllQuestions();
  const subjects = await getSubjects();

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardContent className="pt-6">
            <QuestionsTable questions={questions} subjects={subjects} />
        </CardContent>
      </Card>
    </div>
  );
}
