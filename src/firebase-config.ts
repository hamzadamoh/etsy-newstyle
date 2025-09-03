// This file is for SERVER-SIDE Firebase configuration.
// It should use the Firebase Admin SDK.
// DO NOT USE THIS ON THE CLIENT.

import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App;
let adminAuth: Auth;
let db: Firestore;

try {
    // IMPORTANT: Set these environment variables in your hosting environment.
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : {
          type: "service_account",
          project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          // The `private_key` needs special handling for environment variables to preserve newlines.
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
        };

    if (!serviceAccount.private_key) {
        throw new Error("Firebase service account 'private_key' is missing. Ensure all FIREBASE_... environment variables are set correctly.");
    }
    
    app = getApps().length 
        ? getApp() 
        : initializeApp({ credential: cert(serviceAccount) });

    adminAuth = getAuth(app);
    db = getFirestore(app);

} catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
    // In a real app, you might want to handle this more gracefully.
    // For now, we'll re-throw to make the problem visible during development.
    throw error;
}


export { app, adminAuth, db };
