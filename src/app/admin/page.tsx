import { getAllQuestions, getSubjects } from '@/lib/data';
import { QuestionsTable } from '@/components/admin/questions-table';
import { SubjectsManagement } from '@/components/admin/subjects-management';
import { CsvUpload } from '@/components/admin/csv-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminPage() {
  const questions = await getAllQuestions();
  const subjects = await getSubjects();

  return (
    <div className="container mx-auto py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                    <SubjectsManagement subjects={subjects} />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Import Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    <CsvUpload />
                </CardContent>
            </Card>
        </div>
      <Card>
        <CardHeader>
            <CardTitle>Manage Questions</CardTitle>
        </CardHeader>
        <CardContent>
            <QuestionsTable questions={questions} subjects={subjects} />
        </CardContent>
      </Card>
    </div>
  );
}
