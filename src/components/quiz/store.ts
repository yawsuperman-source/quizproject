import { create } from 'zustand';
import type { Question, AnswerFilter } from '@/lib/types';

type QuizState = {
  subjectIds: string[];
  answerFilter: AnswerFilter;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (string | null)[];
  isSubmitted: boolean[];
  correctAnswers: number;
  incorrectAnswers: number;
  isQuizFinished: boolean;
  setQuizConfig: (config: { subjectIds: string[], answerFilter: AnswerFilter }) => void;
  setQuestions: (questions: Question[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  recordAnswer: (selectedAnswer: string) => void;
  endQuiz: () => void;
  resetQuiz: () => void;
};

const useQuizStore = create<QuizState>((set, get) => ({
  subjectIds: [],
  answerFilter: 'all',
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  isSubmitted: [],
  correctAnswers: 0,
  incorrectAnswers: 0,
  isQuizFinished: false,

  setQuizConfig: (config) => set({
    subjectIds: config.subjectIds,
    answerFilter: config.answerFilter,
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isSubmitted: [],
    correctAnswers: 0,
    incorrectAnswers: 0,
    isQuizFinished: false,
  }),

  setQuestions: (questions) => set({
    questions,
    userAnswers: Array(questions.length).fill(null),
    isSubmitted: Array(questions.length).fill(false),
   }),

  nextQuestion: () => set((state) => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      return { currentQuestionIndex: state.currentQuestionIndex + 1 };
    }
    const { questions, userAnswers } = get();
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      if (answer && questions[index] && answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return { isQuizFinished: true, correctAnswers: correct, incorrectAnswers: questions.length - correct };
  }),

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

  endQuiz: () => set((state) => {
    const { questions, userAnswers } = state;
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      if (answer && questions[index] && answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return { isQuizFinished: true, correctAnswers: correct, incorrectAnswers: questions.length - correct };
  }),

  resetQuiz: () => set({
    subjectIds: [],
    answerFilter: 'all',
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isSubmitted: [],
    correctAnswers: 0,
    incorrectAnswers: 0,
    isQuizFinished: false,
  }),
}));

export default useQuizStore;