import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { auth } from './config';

const signup = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user: User | null = userCredential.user;

  if (user) {
    await sendEmailVerification(user);
  } else {
    throw new Error('No se pudo obtener el usuario después del registro');
  }
};

const signin = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

const signOutUser = () => signOut(auth);

const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export { signup, signin, signOutUser, resetPassword };
