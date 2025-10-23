import * as admin from 'firebase-admin';

// This prevents initialization errors in environments where default credentials are not available.
// The SDK will be initialized with default credentials where available (e.g., in a deployed environment)
// or will work with emulators if configured.
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (e) {
    console.error('Firebase admin initialization error. This can happen in dev environments where default credentials are not set up. It can often be ignored if you are using emulators.', e);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
