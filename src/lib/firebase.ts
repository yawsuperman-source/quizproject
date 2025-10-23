'use client';
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  projectId: "studio-2352139503-fdaf9",
  appId: "1:179343020175:web:4f7c43996cff392e5c20fa",
  apiKey: "AIzaSyAkXHCJGGJcx13JLSGR9mPLpYWazDkvIi4",
  authDomain: "studio-2352139503-fdaf9.firebaseapp.com",
  messagingSenderId: "179343020175"
};

// Initialize Firebase for client-side
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
