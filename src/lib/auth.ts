// This file provides mock authentication functions.
// In a real application, you would replace these with calls to the Firebase Authentication SDK.
import { users, userAnswers } from './data';
import type { User } from './types';

// This function is no longer needed and has been removed as the logic is now handled directly in providers.tsx
// export async function checkUserRole(userId: string): Promise<'admin' | 'user'>

// Mock function to get user answers.
export async function getMockUserAnswers(userId: string) {
    return userAnswers[userId] || [];
}

export async function getMockUserById(userId: string): Promise<User | null> {
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    return {
        ...user,
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "mock-token",
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => "mock-id-token",
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({}),
    };
}
