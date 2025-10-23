import { create } from 'zustand';
import type { Question, AnswerFilter } from '@/lib/types';

type QuizState = {
  subjectIds: string[];
  answerFilter: AnswerFilter;
  questions: Question[];
  currentQuestionIndex: number;
  correctAnswers: number;
  incorrectAnswers: number;
  isQuizFinished: boolean;
  setQuizConfig: (config: { subjectIds: string[], answerFilter: AnswerFilter }) => void;
  setQuestions: (questions: Question[]) => void;
  nextQuestion: () => void;
  recordAnswer: (isCorrect: boolean) => void;
  endQuiz: () => void;
  resetQuiz: () => void;
};

const useQuizStore = create<QuizState>((set, get) => ({
  subjectIds: [],
  answerFilter: 'all',
  questions: [],
  currentQuestionIndex: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  isQuizFinished: false,

  setQuizConfig: (config) => set({ 
    subjectIds: config.subjectIds,
    answerFilter: config.answerFilter,
    // Reset quiz state when config changes
    questions: [],
    currentQuestionIndex: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    isQuizFinished: false,
  }),

  setQuestions: (questions) => set({ questions }),

  nextQuestion: () => set((state) => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      return { currentQuestionIndex: state.currentQuestionIndex + 1 };
    }
    return { isQuizFinished: true };
  }),

  recordAnswer: (isCorrect) => set((state) => ({
    correctAnswers: state.correctAnswers + (isCorrect ? 1 : 0),
    incorrectAnswers: state.incorrectAnswers + (isCorrect ? 0 : 1),
  })),

  endQuiz: () => set({ isQuizFinished: true }),
  
  resetQuiz: () => set({
    subjectIds: [],
    answerFilter: 'all',
    questions: [],
    currentQuestionIndex: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    isQuizFinished: false,
  }),
}));

export default useQuizStore;
