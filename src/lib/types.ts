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
