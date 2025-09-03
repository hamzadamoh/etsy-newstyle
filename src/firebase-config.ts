// This file is for SERVER-SIDE Firebase configuration.
// It should use the Firebase Admin SDK.
// DO NOT USE THIS ON THE CLIENT.

import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// IMPORTANT: Set these environment variables in your hosting environment.
// For local development, you can create a serviceAccountKey.json file.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : {
      "type": "service_account",
      "project_id": process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
      // The `private_key` needs special handling for environment variables to preserve newlines.
      "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      "client_email": process.env.FIREBASE_CLIENT_EMAIL,
      "client_id": process.env.FIREBASE_CLIENT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
    };


const app = !getApps().length ? initializeApp({
    credential: cert(serviceAccount)
}) : getApp();

const adminAuth = getAuth(app);
const db = getFirestore(app);

export { app, adminAuth, db };
