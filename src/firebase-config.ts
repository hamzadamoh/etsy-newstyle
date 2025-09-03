
// This file is for SERVER-SIDE Firebase configuration.
// It should use the Firebase Admin SDK.
// DO NOT USE THIS ON THE CLIENT.

import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App | null = null;
let adminAuth: Auth | null = null;
let db: Firestore | null = null;

try {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (getApps().length === 0 && serviceAccountString) {
    const serviceAccount = JSON.parse(serviceAccountString);
    app = initializeApp({
      credential: cert(serviceAccount)
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } else if (getApps().length > 0) {
    app = getApp();
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Server-side Firebase features will not work.");
  }

  if (app) {
    adminAuth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
}

export { app, adminAuth, db };

    