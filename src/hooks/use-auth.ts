
import { auth, db } from '@/firebase-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

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
  
  const sendPasswordReset = (email: string) => {
    // Rely directly on Firebase Authentication. It will not throw an error
    // if the user does not exist, but will only send an email if they do.
    // This is the standard and secure way to handle password resets.
    return sendPasswordResetEmail(auth, email);
  };

  return { signUp, login, logout, sendPasswordReset };
};
