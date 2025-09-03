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
    if (getApps().length === 0) {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

        // Ensure all required environment variables are present
        if (privateKey && clientEmail && projectId) {
            const serviceAccount = {
                projectId: projectId,
                clientEmail: clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            };

            app = initializeApp({
                credential: cert(serviceAccount)
            });
        } else {
            console.warn("Firebase Admin SDK credentials are not fully set in environment variables. Server-side Firebase features will not work.");
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
