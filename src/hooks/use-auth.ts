
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
    // First, check if a user with this email exists in the Firestore database.
    // This is a security measure to prevent email enumeration.
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Throw an error if the email is not found in our user records.
      throw new Error("This email is not registered with an account.");
    }
    
    // If the user exists, proceed with sending the password reset email via Firebase Auth.
    return sendPasswordResetEmail(auth, email);
  };

  return { signUp, login, logout, sendPasswordReset };
};
