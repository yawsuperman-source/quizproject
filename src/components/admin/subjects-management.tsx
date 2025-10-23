'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Subject } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { addSubjectAction } from '@/app/admin/actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PlusCircle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Subject name must be at least 2 characters.' }),
});

type SubjectsManagementProps = {
  subjects: Subject[];
};

export function SubjectsManagement({ subjects }: SubjectsManagementProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
  });

  const handleAddSubject = async (values: z.infer<typeof formSchema>) => {
    const result = await addSubjectAction(values.name);
    if (result.success) {
      toast({ title: 'Subject added successfully.' });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to add subject.',
        description: result.error?.form || JSON.stringify(result.error),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-headline">Manage Subjects</h2>
        <div className="flex flex-wrap gap-2 mt-4">
            {subjects.map(subject => (
                <Badge key={subject.id} variant="secondary" className="text-sm">
                    {subject.name}
                </Badge>
            ))}
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddSubject)} className="flex items-end gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormLabel>New Subject Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. TypeScript" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {form.formState.isSubmitting ? 'Adding...' : 'Add Subject'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
