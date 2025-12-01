'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as data from './data';
import type { Question, AnswerFilter, Subject } from './types';

// --- SUBJECT ACTIONS ---

export async function getSubjects() {
  try {
    const subjects = await data.getSubjects();
    return { success: true, subjects };
  } catch (error) {
    return { success: false, error: 'Failed to load subjects.' };
  }
}

export async function addSubject(formData: FormData) {
  const subjectName = formData.get('subjectName') as string;
  if (!subjectName || subjectName.trim().length === 0) {
    return { success: false, error: 'Subject name cannot be empty.' };
  }

  try {
    await data.addSubject(subjectName.trim());
    revalidatePath('/admin/subjects');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteSubject(subjectId: string) {
  try {
    await data.deleteSubject(subjectId);
    revalidatePath('/admin/subjects');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete subject.' };
  }
}

// --- QUESTION ACTIONS ---

export async function getQuizQuestions(
  subjectIds: string[], 
  answerFilter: AnswerFilter, 
  userId: string, 
  numQuestions: number
) {
  try {
    let questions = await data.getQuestions(subjectIds, answerFilter, userId);

    // Shuffle questions for randomness
    questions.sort(() => Math.random() - 0.5);

    // Limit the number of questions based on user selection
    if (numQuestions > 0 && questions.length > numQuestions) {
      questions = questions.slice(0, numQuestions);
    }

    return { success: true, questions };
  } catch (error) {
    console.error('Error getting quiz questions:', error);
    return { success: false, error: 'Failed to load questions.' };
  }
}

export async function getQuestionCounts(subjectIds: string[], userId: string) {
  try {
    const counts = await data.getQuestionCounts(subjectIds, userId);
    return { success: true, counts };
  } catch (error) {
    console.error('Error getting question counts:', error);
    return { success: false, error: 'Failed to load question counts.' };
  }
}

export async function getAllQuestions() {
    try {
        const questions = await data.getAllQuestions();
        return { success: true, questions };
    } catch (error) {
        return { success: false, error: 'Failed to load questions.' };
    }
}

export async function getQuestionById(id: string) {
    try {
        const questions = await data.getAllQuestions();
        const question = questions.find(q => q.id === id);
        if (!question) {
            return { success: false, error: 'Question not found.' };
        }
        return { success: true, question };
    } catch (error) {
        return { success: false, error: 'Failed to load question.' };
    }
}


export async function addQuestion(formData: FormData) {
    const questionData = {
        subjectId: formData.get('subjectId') as string,
        questionText: formData.get('questionText') as string,
        options: (formData.get('options') as string).split('|'),
        correctAnswer: formData.get('correctAnswer') as string,
        explanation: formData.get('explanation') as string,
    };

    // Basic validation
    if (!questionData.subjectId || !questionData.questionText || !questionData.options || !questionData.correctAnswer) {
        return { success: false, error: "Missing required fields" };
    }
    if (questionData.options.length < 2) {
        return { success: false, error: "Question must have at least two options." };
    }
     if (!questionData.options.includes(questionData.correctAnswer)) {
        return { success: false, error: "The correct answer must be one of the options." };
    }

    try {
        await data.addQuestion(questionData);
        revalidatePath('/admin/questions');
        redirect('/admin/questions');
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function updateQuestion(questionId: string, formData: FormData) {
    const updates: Partial<Question> = {
        subjectId: formData.get('subjectId') as string,
        questionText: formData.get('questionText') as string,
        options: (formData.get('options') as string).split('|'),
        correctAnswer: formData.get('correctAnswer') as string,
        explanation: formData.get('explanation') as string,
    };

    if (!updates.subjectId || !updates.questionText || !updates.options || !updates.correctAnswer) {
        return { success: false, error: "Missing required fields" };
    }
    if (updates.options.length < 2) {
        return { success: false, error: "Question must have at least two options." };
    }
    if (!updates.options.includes(updates.correctAnswer)) {
        return { success: false, error: "The correct answer must be one of the options." };
    }

    try {
        await data.updateQuestion(questionId, updates);
        revalidatePath('/admin/questions');
        revalidatePath(`/admin/questions/${questionId}/edit`);
        redirect('/admin/questions');
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteQuestion(questionId: string) {
    try {
        await data.deleteQuestion(questionId);
        revalidatePath('/admin/questions');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete question" };
    }
}

// --- USER ACTIONS ---

export async function saveUserAnswer(userId: string, questionId: string, isCorrect: boolean) {
    try {
        await data.saveUserAnswer(userId, questionId, isCorrect);
        revalidatePath('/quiz/select');
        return { success: true };
    } catch (error) {
        console.error('Error saving user answer:', error);
        return { success: false, error: "Failed to save answer." };
    }
}
