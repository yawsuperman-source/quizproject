'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { 
    addQuestion as addMockQuestion, 
    updateQuestion as updateMockQuestion,
    deleteQuestion as deleteMockQuestion
} from '@/lib/data';
import type { Question } from '@/lib/types';

const questionSchema = z.object({
  questionText: z.string().min(5, "Question text is too short."),
  options: z.array(z.string().min(1)).min(2, "Must have at least two options."),
  correctAnswer: z.string().min(1, "A correct answer must be selected."),
  subjectId: z.string().min(1, "A subject must be selected."),
  explanation: z.string().min(10, "Explanation is too short."),
});

export async function addQuestionAction(data: Omit<Question, 'id'>) {
    const validation = questionSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.flatten().fieldErrors };
    }
    
    // Check if correct answer is one of the options
    if (!data.options.includes(data.correctAnswer)) {
        return { success: false, error: { form: "The correct answer must be one of the provided options." } };
    }

    try {
        await addMockQuestion(data);
        revalidatePath('/admin');
        return { success: true };
    } catch(e) {
        return { success: false, error: { form: "Failed to add question." } };
    }
}

export async function updateQuestionAction(id: string, data: Partial<Question>) {
     const validation = questionSchema.partial().safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.flatten().fieldErrors };
    }

    try {
        const result = await updateMockQuestion(id, data);
        if (!result) throw new Error("Question not found");
        revalidatePath('/admin');
        return { success: true };
    } catch(e) {
        return { success: false, error: { form: "Failed to update question." } };
    }
}

export async function deleteQuestionAction(id: string) {
    try {
        const success = await deleteMockQuestion(id);
        if(!success) throw new Error("Failed to delete");
        revalidatePath('/admin');
        return { success: true };
    } catch(e) {
        return { success: false, error: "Failed to delete question." };
    }
}
