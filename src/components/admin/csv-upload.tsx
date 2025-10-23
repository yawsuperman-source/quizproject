'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Papa from 'papaparse';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addQuestionsFromCsvAction } from '@/app/admin/actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  csvFile: z.any()
    .refine(files => files?.length === 1, 'File is required.')
    .refine(files => files?.[0]?.type === 'text/csv', 'File must be a CSV.'),
});

export function CsvUpload() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleFileUpload = async (values: z.infer<typeof formSchema>) => {
    setIsUploading(true);
    const file = values.csvFile[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const result = await addQuestionsFromCsvAction(results.data);
        if (result.success) {
          toast({ title: 'Upload successful!', description: `${result.count} questions have been added.` });
          form.reset();
        } else {
            let description = result.error.form;
            if (result.error.details) {
                description += ` Details: ${JSON.stringify(result.error.details)}`;
            }
          toast({
            variant: 'destructive',
            title: 'Upload failed',
            description: description,
          });
        }
        setIsUploading(false);
      },
      error: (error: any) => {
        toast({
          variant: 'destructive',
          title: 'CSV Parsing Error',
          description: error.message,
        });
        setIsUploading(false);
      },
    });
  };

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline">Import from CSV</h2>
        <Alert>
            <AlertTitle>CSV Format Instructions</AlertTitle>
            <AlertDescription>
                <p className="mb-2">Your CSV file must contain the following headers:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li><code className="font-mono bg-muted p-1 rounded">questionText</code>: The text of the question.</li>
                    <li><code className="font-mono bg-muted p-1 rounded">options</code>: Pipe-separated choices (e.g., "Option A|Option B").</li>
                    <li><code className="font-mono bg-muted p-1 rounded">correctAnswer</code>: Must exactly match one of the options.</li>
                    <li><code className="font-mono bg-muted p-1 rounded">subjectName</code>: The name of an existing subject.</li>
                    <li><code className="font-mono bg-muted p-1 rounded">explanation</code>: The explanation for the correct answer.</li>
                </ul>
            </AlertDescription>
        </Alert>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFileUpload)} className="flex items-end gap-4">
            <FormField
                control={form.control}
                name="csvFile"
                render={({ field }) => (
                <FormItem className="flex-grow">
                    <FormLabel>CSV File</FormLabel>
                    <FormControl>
                    <Input 
                        type="file" 
                        accept=".csv"
                        onChange={(e) => field.onChange(e.target.files)}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" disabled={isUploading}>
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
            </form>
      </Form>
    </div>
  );
}
