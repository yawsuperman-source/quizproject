// This file contains mock data for the application.
// In a real-world scenario, you would fetch this data from a database like Firestore.
// For development, we use JSON files to simulate a persistent data store.
import fs from 'fs/promises';
import path from 'path';

import type { Subject, Question, User, AnswerFilter, UserAnswer, QuizAttempt, QuizAttemptQuestion } from './types';

// --- FILE-BASED DATABASE ---
const subjectsPath = path.join(process.cwd(), 'src', 'lib', 'data', 'subjects.json');
const questionsPath = path.join(process.cwd(), 'src', 'lib', 'data', 'questions.json');
const userAnswersPath = path.join(process.cwd(), 'src', 'lib', 'data', 'user-answers.json');
const userBookmarksPath = path.join(process.cwd(), 'src', 'lib', 'data', 'user-bookmarks.json');
const quizHistoryPath = path.join(process.cwd(), 'src', 'lib', 'data', 'quiz-history.json');

async function readSubjects(): Promise<Subject[]> {
  try {
    const data = await fs.readFile(subjectsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    const defaultSubjects = [
      { id: 'js', name: 'JavaScript' },
      { id: 'react', name: 'React' },
      { id: 'nextjs', name: 'Next.js' },
      { id: 'css', name: 'CSS' },
    ];
    await writeSubjects(defaultSubjects);
    return defaultSubjects;
  }
}

async function writeSubjects(subjects: Subject[]): Promise<void> {
  await fs.writeFile(subjectsPath, JSON.stringify(subjects, null, 2), 'utf-8');
}

async function readQuestions(): Promise<Question[]> {
  try {
    const data = await fs.readFile(questionsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    const defaultQuestions = [
      {
        id: 'js1',
        subjectId: 'js',
        questionText: "What is the output of `typeof null` in JavaScript?",
        options: ["'object'", "'null'", "'undefined'", "'string'"],
        correctAnswer: "'object'",
        explanation: "This is a long-standing bug in JavaScript. The `typeof` operator returns 'object' for `null` due to how JavaScript was originally implemented. `null` is a primitive value, but this quirk remains for historical reasons."
      },
      {
        id: 'js2',
        subjectId: 'js',
        questionText: "Which of the following is NOT a JavaScript data type?",
        options: ["Symbol", "BigInt", "Tuple", "Undefined"],
        correctAnswer: "Tuple",
        explanation: "JavaScript has several primitive data types: String, Number, BigInt, Boolean, Undefined, Symbol, and Null. 'Tuple' is a data structure in other languages like Python and TypeScript, but not a primitive type in JavaScript."
      },
      {
        id: 'react1',
        subjectId: 'react',
        questionText: "What is JSX?",
        options: ["A JavaScript library", "A syntax extension for JavaScript", "A CSS preprocessor", "A database query language"],
        correctAnswer: "A syntax extension for JavaScript",
        explanation: "JSX stands for JavaScript XML. It's a syntax extension that allows you to write HTML-like code in your JavaScript files. Babel transpiles JSX into `React.createElement()` calls."
      },
      {
        id: 'react2',
        subjectId: 'react',
        questionText: "How do you pass data from a parent component to a child component in React?",
        options: ["Using state", "Using props", "Using context", "Using Redux"],
        correctAnswer: "Using props",
        explanation: "Props (short for properties) are the primary way to pass data from a parent component to a child component. Data flows one way in React, from parent to child."
      },
      {
        id: 'nextjs1',
        subjectId: 'nextjs',
        questionText: "What is the primary benefit of Server-Side Rendering (SSR) in Next.js?",
        options: ["Faster client-side navigation", "Improved SEO and initial page load", "Smaller bundle sizes", "Easier state management"],
        correctAnswer: "Improved SEO and initial page load",
        explanation: "SSR pre-renders the page on the server, sending fully-formed HTML to the browser. This allows search engine crawlers to easily index the content and improves the perceived performance for users on initial load."
      },
       {
        id: 'css1',
        subjectId: 'css',
        questionText: "What does the `box-sizing: border-box;` property do?",
        options: ["It includes padding and border in the element's total width and height.", "It makes the element a flex container.", "It adds a shadow to the box.", "It changes the element's display to block."],
        correctAnswer: "It includes padding and border in the element's total width and height.",
        explanation: "By default, an element's width and height are calculated as `content`. `border-box` tells the browser to account for any border and padding in the values you specify for an element's width and height."
      },
    ];
    await writeQuestions(defaultQuestions);
    return defaultQuestions;
  }
}

async function writeQuestions(questions: Question[]): Promise<void> {
  await fs.writeFile(questionsPath, JSON.stringify(questions, null, 2), 'utf-8');
}

async function readUserAnswers(): Promise<Record<string, UserAnswer[]>> {
  try {
    const data = await fs.readFile(userAnswersPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    const defaultUserAnswers = {
      'normal-user-id': [
        { questionId: 'js1', isCorrect: false },
        { questionId: 'react1', isCorrect: true },
      ]
    };
    await writeUserAnswers(defaultUserAnswers);
    return defaultUserAnswers;
  }
}

async function writeUserAnswers(userAnswers: Record<string, UserAnswer[]>): Promise<void> {
  await fs.writeFile(userAnswersPath, JSON.stringify(userAnswers, null, 2), 'utf-8');
}

async function readUserBookmarks(): Promise<Record<string, string[]>> {
    try {
        const data = await fs.readFile(userBookmarksPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        const defaultUserBookmarks = {
            'normal-user-id': ['js2', 'react2']
        };
        await writeUserBookmarks(defaultUserBookmarks);
        return defaultUserBookmarks;
    }
}

async function writeUserBookmarks(bookmarks: Record<string, string[]>): Promise<void> {
    await fs.writeFile(userBookmarksPath, JSON.stringify(bookmarks, null, 2), 'utf-8');
}

async function readQuizHistory(): Promise<QuizAttempt[]> {
  try {
    const data = await fs.readFile(quizHistoryPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeQuizHistory(history: QuizAttempt[]): Promise<void> {
  await fs.writeFile(quizHistoryPath, JSON.stringify(history, null, 2), 'utf-8');
}


// In-memory data for things that don't need to persist across server restarts for this mock setup.
export let users: (Omit<User, keyof import('firebase/auth').User> & { id: string })[] = [
  {
    id: 'admin-user-id',
    uid: 'admin-user-id',
    email: 'admin@quizmaster.com',
    displayName: 'Admin User',
    isAdmin: true,
    photoURL: null,
  },
  {
    id: 'normal-user-id',
    uid: 'normal-user-id',
    email: 'user@quizmaster.com',
    displayName: 'Normal User',
    isAdmin: false,
    photoURL: null,
  },
];

// --- Mock Data Access Functions ---

export async function getSubjects(): Promise<Subject[]> {
  return await readSubjects();
}

export async function addSubject(name: string): Promise<Subject> {
    const currentSubjects = await readSubjects();
    const newSubjectId = name.toLowerCase().replace(/\s+/g, '-');
    if (currentSubjects.some(s => s.id === newSubjectId || s.name.toLowerCase() === name.toLowerCase())) {
        throw new Error("Subject with this name already exists.");
    }
    const newSubject: Subject = {
        id: newSubjectId,
        name,
    };
    const updatedSubjects = [...currentSubjects, newSubject];
    await writeSubjects(updatedSubjects);
    return newSubject;
}

export async function deleteSubject(id: string): Promise<boolean> {
  const subjects = await readSubjects();
  const initialLength = subjects.length;
  const updatedSubjects = subjects.filter(s => s.id !== id);
  const success = updatedSubjects.length < initialLength;
  if(success) {
      await writeSubjects(updatedSubjects);
      const questions = await readQuestions();
      const updatedQuestions = questions.filter(q => q.subjectId !== id);
      await writeQuestions(updatedQuestions);
  }
  return success;
}

export async function getQuestions(
    subjectIds: string[], 
    filter: AnswerFilter, 
    userId: string,
): Promise<Question[]> {
  const allQuestions = await readQuestions();
  const userAnswers = await readUserAnswers();
  const allUserAnswers = userAnswers[userId] || [];
  const userBookmarks = await readUserBookmarks();
  const bookmarkedQuestionIds = new Set(userBookmarks[userId] || []);

  const subjectQuestions = allQuestions.filter(q => subjectIds.includes(q.subjectId));

  if (filter === 'all' || !userId) {
    return subjectQuestions;
  }

  const subjectQuestionIds = new Set(subjectQuestions.map(q => q.id));
  const relevantUserAnswers = allUserAnswers.filter(a => subjectQuestionIds.has(a.questionId));

  const answeredQuestionIds = new Set(relevantUserAnswers.map(a => a.questionId));

  switch (filter) {
    case 'answered':
      return subjectQuestions.filter(q => answeredQuestionIds.has(q.id));
    case 'unanswered':
      return subjectQuestions.filter(q => !answeredQuestionIds.has(q.id));
    case 'correct':
      const correctIds = new Set(relevantUserAnswers.filter(a => a.isCorrect).map(a => a.questionId));
      return subjectQuestions.filter(q => correctIds.has(q.id));
    case 'incorrect':
      const incorrectIds = new Set(relevantUserAnswers.filter(a => !a.isCorrect).map(a => a.questionId));
      return subjectQuestions.filter(q => incorrectIds.has(q.id));
    case 'bookmarked':
        return subjectQuestions.filter(q => bookmarkedQuestionIds.has(q.id));
    default:
        return subjectQuestions;
  }
}

export async function getQuestionCounts(
  subjectIds: string[],
  userId: string
): Promise<Record<AnswerFilter | 'answered', number>> {
  if (subjectIds.length === 0) {
    return { all: 0, unanswered: 0, correct: 0, incorrect: 0, answered: 0, bookmarked: 0 };
  }

  const allQuestions = await readQuestions();
  const userAnswers = await readUserAnswers();
  const allUserAnswers = userAnswers[userId] || [];
  const userBookmarks = await readUserBookmarks();
  const bookmarkedQuestionIds = new Set(userBookmarks[userId] || []);

  const subjectQuestions = allQuestions.filter(q => subjectIds.includes(q.subjectId));
  const subjectQuestionIds = new Set(subjectQuestions.map(q => q.id));

  const relevantUserAnswers = allUserAnswers.filter(a => subjectQuestionIds.has(a.questionId));

  const answeredQuestionIds = new Set(relevantUserAnswers.map(a => a.questionId));
  const correctQuestionIds = new Set(relevantUserAnswers.filter(a => a.isCorrect).map(a => a.questionId));
  const incorrectQuestionIds = new Set(relevantUserAnswers.filter(a => !a.isCorrect).map(a => a.questionId));
  const relevantBookmarkedIds = new Set(subjectQuestions.filter(q => bookmarkedQuestionIds.has(q.id)).map(q => q.id));

  const counts = {
    all: subjectQuestions.length,
    unanswered: subjectQuestions.length - answeredQuestionIds.size,
    correct: correctQuestionIds.size,
    incorrect: incorrectQuestionIds.size,
    answered: answeredQuestionIds.size,
    bookmarked: relevantBookmarkedIds.size,
  };

  return counts;
}

export async function getAllQuestions(): Promise<Question[]> {
  return await readQuestions();
}

export async function getQuestionById(id: string): Promise<Question | null> {
  const questions = await readQuestions();
  return questions.find(q => q.id === id) || null;
}

export async function addQuestion(questionData: Omit<Question, 'id'>): Promise<Question> {
  const questions = await readQuestions();
  const newQuestion: Question = {
    ...questionData,
    id: `q-${Date.now()}`
  };
  const updatedQuestions = [...questions, newQuestion];
  await writeQuestions(updatedQuestions);
  return newQuestion;
}

export async function updateQuestion(id: string, updates: Partial<Question>): Promise<Question | null> {
  const questions = await readQuestions();
  const questionIndex = questions.findIndex(q => q.id === id);
  if (questionIndex === -1) return null;
  
  questions[questionIndex] = { ...questions[questionIndex], ...updates };
  await writeQuestions(questions);
  return questions[questionIndex];
}

export async function deleteQuestion(id: string): Promise<boolean> {
  const questions = await readQuestions();
  const initialLength = questions.length;
  const updatedQuestions = questions.filter(q => q.id !== id);
  const success = updatedQuestions.length < initialLength;
  if(success) {
      await writeQuestions(updatedQuestions);
  }
  return success;
}

export async function saveUserAnswer(userId: string, questionId: string, isCorrect: boolean): Promise<void> {
    const userAnswers = await readUserAnswers();

    if(!userAnswers[userId]) {
        userAnswers[userId] = [];
    }
    const existingAnswerIndex = userAnswers[userId].findIndex(a => a.questionId === questionId);
    if(existingAnswerIndex > -1) {
        userAnswers[userId][existingAnswerIndex].isCorrect = isCorrect;
    } else {
        userAnswers[userId].push({ questionId, isCorrect });
    }
    
    await writeUserAnswers(userAnswers);
}

export async function isBookmarked(userId: string, questionId: string): Promise<boolean> {
    const bookmarks = await readUserBookmarks();
    return bookmarks[userId]?.includes(questionId) || false;
}

export async function toggleBookmark(userId: string, questionId: string): Promise<boolean> {
    const bookmarks = await readUserBookmarks();
    if (!bookmarks[userId]) {
        bookmarks[userId] = [];
    }

    const questionIndex = bookmarks[userId].indexOf(questionId);
    if (questionIndex > -1) {
        bookmarks[userId].splice(questionIndex, 1);
    } else {
        bookmarks[userId].push(questionId);
    }

    await writeUserBookmarks(bookmarks);
    return await isBookmarked(userId, questionId);
}

export async function getQuizHistory(userId: string): Promise<QuizAttempt[]> {
  const history = await readQuizHistory();
  return history.filter(attempt => attempt.userId === userId);
}

export async function getQuizAttempt(attemptId: string): Promise<QuizAttempt | null> {
  const history = await readQuizHistory();
  return history.find(attempt => attempt.id === attemptId) || null;
}

export async function saveQuizAttempt(userId: string, subjectIds: string[], questions: Question[], userAnswers: (string | null)[]): Promise<QuizAttempt> {
  const history = await readQuizHistory();
  
  const correctAnswers = questions.map(q => q.correctAnswer);
  const score = (userAnswers.filter((ua, i) => ua === correctAnswers[i]).length / questions.length) * 100;

  // CRITICAL FIX: Ensure all necessary question data is saved for the review page.
  // The previous implementation was missing these fields, causing the TypeError.
  const attemptQuestions: QuizAttemptQuestion[] = questions.map((q, i) => ({
    questionId: q.id,
    userAnswer: userAnswers[i] || '',
    correctAnswer: q.correctAnswer,
    questionText: q.questionText,
    options: q.options,
    explanation: q.explanation,
    subjectId: q.subjectId,
  }));

  const newAttempt: QuizAttempt = {
    id: `attempt-${Date.now()}`,
    userId,
    subjectIds,
    timestamp: Date.now(),
    score: Math.round(score),
    questions: attemptQuestions,
  };

  const updatedHistory = [newAttempt, ...history];
  await writeQuizHistory(updatedHistory);
  return newAttempt;
}
