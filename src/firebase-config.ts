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
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (getApps().length === 0) {
        if (serviceAccountKey) {
            const serviceAccount = JSON.parse(serviceAccountKey);
            app = initializeApp({ credential: cert(serviceAccount) });
        } else if (privateKey) {
            const serviceAccount = {
                type: "service_account",
                project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                private_key: privateKey.replace(/\\n/g, '\n'),
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CLIENT_ID,
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
            };
            app = initializeApp({ credential: cert(serviceAccount) });
        } else {
            console.warn("Firebase Admin SDK credentials are not set. Server-side Firebase features will not work.");
        }
    } else {
        app = getApp();
    }

    if (app) {
        adminAuth = getAuth(app);
        db = getFirestore(app);
    }

} catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
}


export { app, adminAuth, db };
