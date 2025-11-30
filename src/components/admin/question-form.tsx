'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Question, Subject } from '@/lib/types';
import { Trash, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  questionText: z.string().min(10, { message: 'Question must be at least 10 characters.' }),
  options: z.array(z.string().min(1, { message: 'Option cannot be empty.' })).min(2, { message: 'Must have at least two options.' }),
  correctAnswer: z.string().min(1, { message: 'Please select a correct answer.' }),
  subjectId: z.string({ required_error: 'Please select a subject.' }),
  explanation: z.string().min(10, { message: 'Explanation must be at least 10 characters.' }),
});

type QuestionFormProps = {
  subjects: Subject[];
  question?: Question;
  onSubmit: (data: any) => Promise<{ success: boolean; error?: any }>;
  onFinished: () => void;
};

export function QuestionForm({ subjects, question, onSubmit, onFinished }: QuestionFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: question || {
      questionText: '',
      options: ['', ''],
      correctAnswer: '',
      subjectId: '',
      explanation: '',
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const options = form.watch('options');
  const explanation = form.watch('explanation');

  useEffect(() => {
    // if the correct answer is no longer a valid option, reset it
    if (form.getValues('correctAnswer') && !form.getValues('options').includes(form.getValues('correctAnswer'))) {
        form.setValue('correctAnswer', '');
    }
  }, [options, form]);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.options.includes(values.correctAnswer)) {
      form.setError('correctAnswer', { message: 'Correct answer must be one of the options.' });
      return;
    }

    const result = await onSubmit(values);

    if (result.success) {
      toast({
        title: `Question ${question ? 'updated' : 'added'} successfully.`,
      });
      onFinished();
    } else {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: result.error?.form || JSON.stringify(result.error),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="questionText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <Textarea placeholder="What is the capital of France?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Label>Options</Label>
          <div className="space-y-2 mt-2">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`options.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 2}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => append('')} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Option
          </Button>
        </div>

        <FormField
          control={form.control}
          name="correctAnswer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correct Answer</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the correct option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {form.getValues('options').map((option, index) => (
                    option && <SelectItem key={index} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation (Supports Markdown)</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide a brief explanation for the correct answer. You can use markdown for formatting." {...field} rows={8} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
            <Label>Explanation Preview</Label>
            <div className="prose dark:prose-invert rounded-md border p-4 min-h-[100px] mt-2">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                    {explanation}
                </ReactMarkdown>
            </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Question'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
