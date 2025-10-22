'use client';

import { useState } from 'react';
import type { Question, Subject } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Edit, Trash } from 'lucide-react';
import { QuestionForm } from './question-form';
import { DeleteDialog } from './delete-dialog';
import { addQuestionAction, updateQuestionAction, deleteQuestionAction } from '@/app/admin/actions';
import { useToast } from '@/hooks/use-toast';

type QuestionsTableProps = {
  questions: Question[];
  subjects: Subject[];
};

export function QuestionsTable({ questions, subjects }: QuestionsTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | undefined>(undefined);
  const { toast } = useToast();
  
  const openFormForEdit = (question: Question) => {
    setSelectedQuestion(question);
    setIsFormOpen(true);
  };

  const openFormForNew = () => {
    setSelectedQuestion(undefined);
    setIsFormOpen(true);
  };
  
  const openDeleteDialog = (question: Question) => {
      setSelectedQuestion(question);
      setIsDeleteDialogOpen(true);
  }
  
  const handleDeleteConfirm = async () => {
      if (!selectedQuestion) return;
      const result = await deleteQuestionAction(selectedQuestion.id);
      if(result.success) {
          toast({ title: "Question deleted successfully." });
          setIsDeleteDialogOpen(false);
      } else {
          toast({ variant: 'destructive', title: "Error", description: result.error });
      }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-headline">Manage Questions</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openFormForNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{selectedQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <QuestionForm 
                subjects={subjects} 
                question={selectedQuestion} 
                onSubmit={(data) => selectedQuestion ? updateQuestionAction(selectedQuestion.id, data) : addQuestionAction(data)}
                onFinished={() => setIsFormOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Question</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Options</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium truncate max-w-sm">{question.questionText}</TableCell>
                <TableCell>{subjects.find(s => s.id === question.subjectId)?.name || 'N/A'}</TableCell>
                <TableCell>{question.options.length}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openFormForEdit(question)}>
                        <Edit className="mr-2 h-4 w-4"/> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDeleteDialog(question)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4"/> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <DeleteDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
