// This file contains mock data for the application.
// In a real-world scenario, you would fetch this data from a database like Firestore.

import type { Subject, Question, User, AnswerFilter, UserAnswer } from './types';

export let subjects: Subject[] = [
  { id: 'js', name: 'JavaScript' },
  { id: 'react', name: 'React' },
  { id: 'nextjs', name: 'Next.js' },
  { id: 'css', name: 'CSS' },
];

export let questions: Question[] = [
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


export let userAnswers: Record<string, UserAnswer[]> = {
    'normal-user-id': [
        { questionId: 'js1', isCorrect: false },
        { questionId: 'react1', isCorrect: true },
    ]
};

// --- Mock Data Access Functions ---

export async function getSubjects(): Promise<Subject[]> {
  return Promise.resolve(subjects);
}

export async function addSubject(name: string): Promise<Subject> {
    const newSubjectId = name.toLowerCase().replace(/\s+/g, '-');
    if (subjects.some(s => s.id === newSubjectId || s.name.toLowerCase() === name.toLowerCase())) {
        throw new Error("Subject with this name already exists.");
    }
    const newSubject: Subject = {
        id: newSubjectId,
        name,
    };
    subjects.push(newSubject);
    return Promise.resolve(newSubject);
}

export async function getQuestions(
    subjectIds: string[], 
    filter: AnswerFilter, 
    userId: string,
    allUserAnswers: UserAnswer[]
): Promise<Question[]> {
  let filteredQuestions = questions.filter(q => subjectIds.includes(q.subjectId));

  if (filter === 'all' || !userId) {
    return Promise.resolve(filteredQuestions);
  }

  const answeredQuestionIds = new Set(allUserAnswers.map(a => a.questionId));

  switch (filter) {
    case 'answered':
      filteredQuestions = filteredQuestions.filter(q => answeredQuestionIds.has(q.id));
      break;
    case 'unanswered':
      filteredQuestions = filteredQuestions.filter(q => !answeredQuestionIds.has(q.id));
      break;
    case 'correct':
      const correctIds = new Set(allUserAnswers.filter(a => a.isCorrect).map(a => a.questionId));
      filteredQuestions = filteredQuestions.filter(q => correctIds.has(q.id));
      break;
    case 'incorrect':
       const incorrectIds = new Set(allUserAnswers.filter(a => !a.isCorrect).map(a => a.questionId));
       filteredQuestions = filteredQuestions.filter(q => incorrectIds.has(q.id));
      break;
  }
  
  return Promise.resolve(filteredQuestions);
}

export async function getAllQuestions(): Promise<Question[]> {
  return Promise.resolve(questions);
}

export async function addQuestion(questionData: Omit<Question, 'id'>): Promise<Question> {
  const newQuestion: Question = {
    ...questionData,
    id: `q-${Date.now()}`,
  };
  questions.push(newQuestion);
  return Promise.resolve(newQuestion);
}

export async function updateQuestion(id: string, updates: Partial<Question>): Promise<Question | null> {
  const questionIndex = questions.findIndex(q => q.id === id);
  if (questionIndex === -1) return null;
  
  questions[questionIndex] = { ...questions[questionIndex], ...updates };
  return Promise.resolve(questions[questionIndex]);
}

export async function deleteQuestion(id: string): Promise<boolean> {
  const initialLength = questions.length;
  questions = questions.filter(q => q.id !== id);
  return Promise.resolve(questions.length < initialLength);
}

export async function saveUserAnswer(userId: string, questionId: string, isCorrect: boolean): Promise<void> {
    if(!userAnswers[userId]) {
        userAnswers[userId] = [];
    }
    const existingAnswerIndex = userAnswers[userId].findIndex(a => a.questionId === questionId);
    if(existingAnswerIndex > -1) {
        userAnswers[userId][existingAnswerIndex].isCorrect = isCorrect;
    } else {
        userAnswers[userId].push({ questionId, isCorrect });
    }
    console.log(`Saved answer for user ${userId}`, userAnswers[userId]);
    return Promise.resolve();
}
