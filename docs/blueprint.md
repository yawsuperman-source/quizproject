# **App Name**: QuizMaster

## Core Features:

- Question Display: Display one multiple-choice question at a time from the Firestore database.
- Answer Submission: Allow users to submit their answer and show the correct/incorrect feedback, incorporating an explanation with the help of an LLM tool to identify keywords for search
- Score Tracking: Keep track of the number of correct and incorrect answers for each quiz session using Firestore.
- Results Display: Display the quiz results including the score and a simple chart using Chart.js.
- Admin Question Management: Admin panel to add, edit, and delete questions stored in Firestore, accessible to logged-in admins only.
- Home Page: Welcome message with button to start the quiz.
- User Authentication: User authentication via email/password. If a user doesn't exist, they have to register.
- Subject Choice: Allow user to choose the subject or subjects he wants questions from.
- Question Selection: Allow user to answer only previously wrongly answered questions, answered questions or unanswered questions

## Style Guidelines:

- Primary color: Dark blue (#3F51B5) to reflect intelligence and focus, suitable for an educational context.
- Background color: Very light blue (#E8EAF6), almost white, for a clean and uncluttered feel.
- Accent color: Bright orange (#FF9800) to draw attention to the submit button and important information; offers high contrast with the primary color.
- Use green for correct answers, red for wrong answers, and yellow for hints.
- Body and headline font: 'PT Sans' (sans-serif) for readability and a modern, approachable feel.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use simple and clear icons related to quizzes, scores, and settings.
- Subtle animations for question transitions and answer feedback.