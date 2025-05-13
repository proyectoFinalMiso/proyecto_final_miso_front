import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
  AuthError,
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

type SignInResult =
  | { success: true; user: any }
  | { success: false; code: string };

const signin = async (
  email: string,
  password: string
): Promise<SignInResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    const firebaseError = error as AuthError;

    let code = 'unexpected_error';

    console.log(firebaseError);

    switch (firebaseError.code) {
      case 'auth/invalid-credential':
        code = 'auth_invalid_credential';
        break;
      case 'auth/invalid-email':
        code = 'auth_invalid_email';
      case 'auth/too-many-requests':
        code = 'auth_too_many_requests';
        break;
    }

    return {
      success: false,
      code,
    };
  }
};

const signOutUser = () => signOut(auth);

const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export { signup, signin, signOutUser, resetPassword };
