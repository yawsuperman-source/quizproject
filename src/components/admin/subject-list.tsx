'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { deleteSubjectAction } from '@/app/admin/actions';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { Subject } from '@/lib/types';

interface SubjectListProps {
  subjects: Subject[];
}

export function SubjectList({ subjects }: SubjectListProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await deleteSubjectAction(id);
    if (result.success) {
      toast({ title: 'Success', description: 'Subject deleted successfully.' });
    } else {
      // FIX: Handle different error structures from the action for the toast
      const description = result.error?.form || (typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
      toast({ 
        title: 'Error deleting subject', 
        description: description,
        variant: 'destructive' 
      });
    }
    // Reset state after operation is complete
    setDeletingId(null);
  };

  return (
    <div className="mt-4 space-y-2">
      {subjects.map(subject => (
        <div key={subject.id} className="flex items-center justify-between p-2 border rounded-md">
          <span>{subject.name}</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {/* FIX: Disable the trigger button while an operation on this item is in progress */}
              <Button variant="destructive" size="icon" disabled={deletingId === subject.id}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the subject and all associated questions. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {/* FIX: The action button is also disabled to prevent multiple clicks */}
                <AlertDialogAction onClick={() => handleDelete(subject.id)} disabled={deletingId === subject.id}>
                  {deletingId === subject.id ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}
