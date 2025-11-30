'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { addSubjectAction } from '@/app/admin/actions';
import { useToast } from '@/hooks/use-toast';

const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name must be at least 2 characters.'),
});

export function AddSubjectForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (values: z.infer<typeof subjectSchema>) => {
    const result = await addSubjectAction(values.name);
    if (result.success) {
      toast({ title: 'Success', description: 'Subject added successfully.' });
      form.reset();
    } else {
      // FIX: Handle different error structures from the action
      const description = result.error?.form || (typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
      toast({ 
        title: 'Error adding subject', 
        description: description,
        variant: 'destructive' 
      });
    }
  };

  return (
    <Form {...form}> 
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Subject Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Advanced CSS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Adding...' : 'Add Subject'}
        </Button>
      </form>
    </Form>
  );
}
