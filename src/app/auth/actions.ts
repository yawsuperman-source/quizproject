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
    // Add or update user in mock DB for isAdmin property
    // In a real app, this would be a 'users' collection in Firestore.
    let existingUser = users.find(u => u.uid === values.uid);
    const isAdmin = values.email === 'admin@quizmaster.com';

    if (existingUser) {
        // Update existing user's details, just in case they changed
        existingUser.displayName = values.displayName;
        existingUser.email = values.email;
        existingUser.isAdmin = isAdmin;
    } else {
        // Create new user entry
        users.push({
            id: values.uid,
            uid: values.uid,
            email: values.email,
            displayName: values.displayName,
            isAdmin: isAdmin,
            photoURL: null,
        });
    }

    console.log("Current users in mock DB:", users);

    return { success: true, userId: values.uid };
  } catch (error: any) {
    console.error("Sign up action error:", error);
    return { success: false, error: "Failed to save user data." };
  }
}
