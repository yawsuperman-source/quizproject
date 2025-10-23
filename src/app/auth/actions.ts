'use server';

import { z } from 'zod';
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

// Mock user creation
async function mockSignUp(data: z.infer<typeof signUpSchema>) {
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
        throw new Error('auth/email-already-in-use');
    }
    const newId = `mock-uid-${Date.now()}`;
    const newUser = {
        id: newId,
        uid: newId,
        email: data.email,
        displayName: data.displayName,
        isAdmin: false,
        photoURL: null,
    };
    users.push(newUser);
    return { user: newUser };
}


// Mock user sign-in
async function mockSignIn(data: z.infer<typeof signInSchema>) {
    const user = users.find(u => u.email === data.email);
    if (!user) {
        throw new Error('auth/user-not-found');
    }
    // In a real app, you'd check the password
    return { user };
}


export async function signUpUser(values: z.infer<typeof signUpSchema>) {
  try {
    const { user } = await mockSignUp(values);
    return { success: true, userId: user.uid };
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred.";
    if (error.message.includes('auth/email-already-in-use')) {
      errorMessage = "This email is already in use.";
    }
    return { success: false, error: errorMessage };
  }
}

export async function signInUser(values: z.infer<typeof signInSchema>) {
  try {
    const { user } = await mockSignIn(values);
    
    return { success: true, user: JSON.stringify(user) };

  } catch (error: any)
{
    let errorMessage = "Invalid email or password.";
    if (error.message.includes('auth/user-not-found') || error.message.includes('auth/wrong-password')) {
      errorMessage = "Invalid email or password.";
    }
    return { success: false, error: errorMessage };
  }
}

export async function signOutUser() {
  try {
    console.log("Signing out user.");
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to sign out.' };
  }
}
