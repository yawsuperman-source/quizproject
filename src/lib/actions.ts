'use server';

import { getQuestions as getMockQuestions, saveUserAnswer as saveMockUserAnswer, userAnswers as mockUserAnswers } from './data';
import type { AnswerFilter } from './types';

export async function getQuizQuestions(subjectIds: string[], filter: AnswerFilter, userId: string) {
  try {
    // In a real app, you'd fetch the user's answers from Firestore here
    const allUserAnswers = mockUserAnswers[userId] || [];
    const questions = await getMockQuestions(subjectIds, filter, userId, allUserAnswers);
    return { success: true, questions };
  } catch (error) {
    console.error("Failed to get quiz questions:", error);
    return { success: false, error: "Could not fetch questions." };
  }
}

export async function saveUserAnswer(userId: string, questionId: string, isCorrect: boolean) {
    try {
        // In a real app, you'd save this to Firestore
        await saveMockUserAnswer(userId, questionId, isCorrect);
        return { success: true };
    } catch(error) {
        console.error("Failed to save user answer:", error);
        return { success: false, error: "Could not save your answer." };
    }
}
