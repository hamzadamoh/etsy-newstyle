// This is a placeholder for your Firebase configuration.
// In a real application, you would replace this with the actual config object from your Firebase project console.
// It is safe to expose this configuration on the client-side.
// Security is handled by Firebase Security Rules and App Check.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCj32onIpmDZLazMuW4RlqsLK6hI9hg144",
  authDomain: "etsy-6a694.firebaseapp.com",
  projectId: "etsy-6a694",
  storageBucket: "etsy-6a694.firebasestorage.app",
  messagingSenderId: "120161962221",
  appId: "1:120161962221:web:b734fb0c05306f5554e4e4",
  measurementId: "G-910GTKGRMZ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
