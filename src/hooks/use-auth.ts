
import { auth, db } from '@/firebase-config-client'; // Use client config
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { setDoc, doc, getFirestore } from 'firebase/firestore';

export const useAuth = () => {
  const firestore = getFirestore(auth.app); // Get firestore instance from the client app

  const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a user profile in Firestore
    await setDoc(doc(firestore, 'users', user.uid), {
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
    return sendPasswordResetEmail(auth, email);
  };

  return { signUp, login, logout, sendPasswordReset };
};
