'use client';

import Link from 'next/link';
import type { Subject } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

type SubjectsManagementProps = {
  subjects: Subject[];
};

export function SubjectsManagement({ subjects }: SubjectsManagementProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold font-headline">Manage Subjects</h2>
        <p className="text-muted-foreground">Add, edit, or remove subjects.</p>
      </div>
       <div className="flex flex-wrap gap-2">
          {subjects.slice(0, 5).map(subject => (
              <Badge key={subject.id} variant="secondary" className="text-sm">
                  {subject.name}
              </Badge>
          ))}
          {subjects.length > 5 && (
              <Badge variant="outline" className="text-sm">
                  + {subjects.length - 5} more
              </Badge>
          )}
      </div>
      <Button asChild>
          <Link href="/admin/subjects">
              Manage All Subjects
              <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
      </Button>
    </div>
  );
}
