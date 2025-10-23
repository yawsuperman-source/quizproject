'use server';

import { z } from 'zod';
import { auth } from '@/lib/firebase-admin';
import { users } from '@/lib/data';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signUpUser(values: z.infer<typeof signUpSchema>) {
  try {
    const userRecord = await auth.createUser({
        email: values.email,
        password: values.password,
        displayName: values.displayName,
    });
    // Add user to mock DB for isAdmin property
    users.push({
        id: userRecord.uid,
        uid: userRecord.uid,
        email: values.email,
        displayName: values.displayName,
        isAdmin: false,
        photoURL: null,
    });
    return { success: true, userId: userRecord.uid };
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred.";
    if (error.code === 'auth/email-already-exists') {
      errorMessage = "This email is already in use.";
    }
    return { success: false, error: errorMessage };
  }
}

// This action is now for server-side validation, client will handle sign-in state
export async function signInUser(values: z.infer<typeof signInSchema>) {
  try {
    // We don't actually sign in here on the server.
    // The client will use the Firebase SDK to sign in and get a token.
    // This is just to check if the user exists for the purpose of the flow.
    // In a real app, you might not even need this server action if login is purely client-side.
    const user = await auth.getUserByEmail(values.email);
    return { success: true, user: JSON.stringify(user) };
  } catch (error: any) {
    let errorMessage = "Invalid email or password.";
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = "Invalid email or password.";
    }
    return { success: false, error: errorMessage };
  }
}

// This action is now a placeholder as client will handle sign-out state
export async function signOutUser() {
  try {
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to sign out.' };
  }
}
