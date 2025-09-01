
import { auth, db } from '@/firebase-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { setDoc, doc, getDocs, query, where, collection } from 'firebase/firestore';

export const useAuth = () => {
  const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: 'user',
      createdAt: new Date(),
    });
    
    return userCredential;
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };
  
  const sendPasswordReset = async (email: string) => {
    // Firebase Auth's sendPasswordResetEmail handles the check internally.
    // It will not throw an error if the email does not exist, for security reasons.
    return sendPasswordResetEmail(auth, email);
  };

  return { signUp, login, logout, sendPasswordReset };
};
