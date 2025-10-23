'use server';

import { z } from 'zod';
import { users } from '@/lib/data';

const signUpSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().min(2),
});

// This action no longer creates the user in Firebase Auth.
// It only adds the user to our mock database for role-based logic.
export async function signUpUser(values: z.infer<typeof signUpSchema>) {
  try {
    // Add user to mock DB for isAdmin property
    // In a real app, this would be a 'users' collection in Firestore.
    const existingUser = users.find(u => u.uid === values.uid);
    if (!existingUser) {
        users.push({
            id: values.uid,
            uid: values.uid,
            email: values.email,
            displayName: values.displayName,
            // Check if the email is the admin email.
            isAdmin: values.email === 'admin@quizmaster.com',
            photoURL: null,
        });
    }

    return { success: true, userId: values.uid };
  } catch (error: any) {
    console.error("Sign up action error:", error);
    return { success: false, error: "Failed to save user data." };
  }
}
