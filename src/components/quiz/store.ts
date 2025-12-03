import { create } from 'zustand';
import type { Question, AnswerFilter } from '@/lib/types';
import { saveQuizAttempt } from '@/lib/actions';

type QuizState = {
  subjectIds: string[];
  answerFilter: AnswerFilter;
  numQuestions: number;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (string | null)[];
  isSubmitted: boolean[];
  correctAnswers: number;
  incorrectAnswers: number;
  isQuizFinished: boolean;
  attemptId: string | null;
  setQuizConfig: (config: { subjectIds: string[], answerFilter: AnswerFilter, numQuestions: number }) => void;
  setQuestions: (questions: Question[]) => void;
  startQuizWithQuestions: (questions: Question[]) => void;
  nextQuestion: (userId: string) => Promise<void>;
  previousQuestion: () => void;
  recordAnswer: (selectedAnswer: string) => void;
  endQuiz: (userId: string) => Promise<void>;
  resetQuiz: () => void;
};

const useQuizStore = create<QuizState>((set, get) => ({
  subjectIds: [],
  answerFilter: 'all',
  numQuestions: 10,
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  isSubmitted: [],
  correctAnswers: 0,
  incorrectAnswers: 0,
  isQuizFinished: false,
  attemptId: null,

  setQuizConfig: (config) => set({
    subjectIds: config.subjectIds,
    answerFilter: config.answerFilter,
    numQuestions: config.numQuestions,
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isSubmitted: [],
    correctAnswers: 0,
    incorrectAnswers: 0,
    isQuizFinished: false,
    attemptId: null,
  }),

  setQuestions: (questions) => set({
    questions,
    userAnswers: Array(questions.length).fill(null),
    isSubmitted: Array(questions.length).fill(false),
   }),

  startQuizWithQuestions: (questions) => set(() => ({
    questions,
    subjectIds: Array.from(new Set(questions.map(q => q.subjectId))),
    numQuestions: questions.length,
    answerFilter: 'all',
    currentQuestionIndex: 0,
    userAnswers: Array(questions.length).fill(null),
    isSubmitted: Array(questions.length).fill(false),
    correctAnswers: 0,
    incorrectAnswers: 0,
    isQuizFinished: false,
    attemptId: null, // Reset attemptId for redos
  })),

  nextQuestion: async (userId: string) => {
    const state = get();
    if (state.currentQuestionIndex < state.questions.length - 1) {
      set({ currentQuestionIndex: state.currentQuestionIndex + 1 });
      return;
    }

    const { questions, userAnswers, subjectIds } = state;
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      if (answer && questions[index] && answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    
    const result = await saveQuizAttempt(userId, subjectIds, questions, userAnswers);
    if (result.success && result.attempt) {
        set({ isQuizFinished: true, correctAnswers: correct, incorrectAnswers: questions.length - correct, attemptId: result.attempt.id });
    } else {
        set({ isQuizFinished: true, correctAnswers: correct, incorrectAnswers: questions.length - correct });
    }
  },

  previousQuestion: () => set((state) => {
    if (state.currentQuestionIndex > 0) {
      return { currentQuestionIndex: state.currentQuestionIndex - 1 };
    }
    return {};
  }),

  recordAnswer: (selectedAnswer) => set((state) => {
    const newAnswers = [...state.userAnswers];
    newAnswers[state.currentQuestionIndex] = selectedAnswer;

    const newSubmitted = [...state.isSubmitted];
    newSubmitted[state.currentQuestionIndex] = true;

    return {
      userAnswers: newAnswers,
      isSubmitted: newSubmitted,
    };
  }),

  endQuiz: async (userId: string) => {
    const { questions, userAnswers, subjectIds } = get();
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      if (answer && questions[index] && answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    
    const result = await saveQuizAttempt(userId, subjectIds, questions, userAnswers);
    if (result.success && result.attempt) {
        set({ isQuizFinished: true, correctAnswers: correct, incorrectAnswers: questions.length - correct, attemptId: result.attempt.id });
    } else {
        set({ isQuizFinished: true, correctAnswers: correct, incorrectAnswers: questions.length - correct });
    }
  },

  resetQuiz: () => set({
    subjectIds: [],
    answerFilter: 'all',
    numQuestions: 10,
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isSubmitted: [],
    correctAnswers: 0,
    incorrectAnswers: 0,
    isQuizFinished: false,
    attemptId: null,
  }),
}));

export default useQuizStore;
