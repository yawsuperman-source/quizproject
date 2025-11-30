import { getSubjects } from '@/lib/data';
import { AddSubjectForm } from '@/components/admin/add-subject-form';
import { SubjectList } from '@/components/admin/subject-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ManageSubjectsPage() {
  const subjects = await getSubjects();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <AddSubjectForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Existing Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <SubjectList subjects={subjects} />
        </CardContent>
      </Card>
    </div>
  );
}
