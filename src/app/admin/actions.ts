'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { 
    addQuestion as addQuestionToDb, 
    updateQuestion as updateQuestionInDb,
    deleteQuestion as deleteQuestionFromDb,
    addSubject as addSubjectToDb,
    deleteSubject as deleteSubjectFromDb,
    getSubjects
} from '@/lib/data';
import type { Question } from '@/lib/types';

const questionSchema = z.object({
  questionText: z.string().min(5, "Question text is too short."),
  options: z.array(z.string().min(1)).min(2, "Must have at least two options."),
  correctAnswer: z.string().min(1, "A correct answer must be selected."),
  subjectId: z.string().min(1, "A subject must be selected."),
  explanation: z.string().min(10, "Explanation is too short."),
});

const subjectSchema = z.object({
    name: z.string().min(2, "Subject name is too short."),
});

const csvQuestionSchema = z.object({
    questionText: z.string().min(1, "questionText is required"),
    options: z.string().min(1, "options are required"),
    correctAnswer: z.string().min(1, "correctAnswer is required"),
    subjectName: z.string().min(1, "subjectName is required"),
    explanation: z.string().min(1, "explanation is required"),
});

export async function addQuestionsFromCsvAction(data: unknown[]) {
    try {
        const subjects = await getSubjects();
        const subjectMap = new Map(subjects.map(s => [s.name.toLowerCase(), s.id]));

        const validatedQuestions = z.array(csvQuestionSchema).parse(data);

        const questionsToAdd = validatedQuestions.map(q => {
            const subjectId = subjectMap.get(q.subjectName.toLowerCase());
            if (!subjectId) {
                throw new Error(`Subject "${q.subjectName}" not found. Please create it first.`);
            }

            const options = q.options.split('|').map(opt => opt.trim());
            if (!options.includes(q.correctAnswer)) {
                throw new Error(`Correct answer "${q.correctAnswer}" is not in the options for question "${q.questionText}".`);
            }

            return {
                questionText: q.questionText,
                options,
                correctAnswer: q.correctAnswer,
                subjectId,
                explanation: q.explanation
            };
        });

        for (const question of questionsToAdd) {
            await addQuestionToDb(question);
        }

        revalidatePath('/admin');
        return { success: true, count: questionsToAdd.length };

    } catch (e: any) {
        if (e instanceof z.ZodError) {
             return { success: false, error: { form: "CSV data is invalid. Please check the format.", details: e.flatten().fieldErrors } };
        }
        return { success: false, error: { form: e.message || "Failed to import questions." } };
    }
}


export async function addSubjectAction(name: string) {
    const validation = subjectSchema.safeParse({ name });
    if (!validation.success) {
        return { success: false, error: validation.error.flatten().fieldErrors };
    }

    try {
        await addSubjectToDb(name);
        revalidatePath('/admin');
        revalidatePath('/quiz/select');
        return { success: true };
    } catch(e: any) {
        return { success: false, error: { form: e.message || "Failed to add subject." } };
    }
}

export async function deleteSubjectAction(id: string) {
    try {
        const success = await deleteSubjectFromDb(id);
        if(!success) throw new Error("Failed to delete");
        revalidatePath('/admin');
        revalidatePath('/quiz/select');
        return { success: true };
    } catch(e) {
        return { success: false, error: "Failed to delete subject." };
    }
}

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
        await addQuestionToDb(data);
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
        const result = await updateQuestionInDb(id, data);
        if (!result) throw new Error("Question not found");
        revalidatePath('/admin');
        return { success: true };
    } catch(e) {
        return { success: false, error: { form: "Failed to update question." } };
    }
}

export async function deleteQuestionAction(id: string) {
    try {
        const success = await deleteQuestionFromDb(id);
        if(!success) throw new Error("Failed to delete");
        revalidatePath('/admin');
        return { success: true };
    } catch(e) {
        return { success: false, error: "Failed to delete question." };
    }
}
