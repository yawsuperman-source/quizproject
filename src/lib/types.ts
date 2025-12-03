import type { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {
  id: string;
  isAdmin?: boolean;
}

export type Subject = {
  id: string;
  name: string;
};

export type Question = {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  subjectId: string;
  explanation: string;
};

export type UserAnswer = {
  questionId: string;
  isCorrect: boolean;
};

export type AnswerFilter = 'all' | 'answered' | 'unanswered' | 'correct' | 'incorrect' | 'bookmarked';

export interface QuizAttempt {
  id: string;
  userId: string;
  timestamp: number;
  score: number;
  subjectIds: string[];
  questions: QuizAttemptQuestion[];
}

// This interface now includes all necessary question data for the review page.
export interface QuizAttemptQuestion {
  questionId: string;
  questionText: string;
  options: string[];
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  subjectId: string;
}
