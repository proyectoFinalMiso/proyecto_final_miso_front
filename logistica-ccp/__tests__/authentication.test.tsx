import {
  signup,
  signin,
  signOutUser,
  resetPassword,
} from '../firebase-utils/authentication';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth'; // Importamos las funciones como de costumbre

jest.mock('firebase/auth'); // Jest automáticamente usará los mocks de __mocks__/firebase/auth.ts

describe('Authentication Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should sign up a user and send verification email', async () => {
    const mockUser = { user: { uid: '123', email: 'test@example.com' } };
    createUserWithEmailAndPassword.mockResolvedValue(mockUser);

    const result = await signup('test@example.com', 'password123');

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password123'
    );
    expect(result).toBeUndefined(); // signup no tiene valor de retorno
    expect(sendEmailVerification).toHaveBeenCalledWith(mockUser.user);
  });

  it('should handle signin success', async () => {
    const mockUserCredential = {
      user: { uid: '123', email: 'test@example.com' },
    };
    signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

    const result = await signin('test@example.com', 'password123');

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password123'
    );
    expect(result).toEqual({ success: true, user: mockUserCredential.user });
  });

  it('should handle signin failure with invalid credentials', async () => {
    const mockError = { code: 'auth/invalid-credential' };
    signInWithEmailAndPassword.mockRejectedValue(mockError);

    const result = await signin('test@example.com', 'wrongpassword');

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'wrongpassword'
    );
    expect(result).toEqual({ success: false, code: 'auth_invalid_credential' });
  });

  it('should sign out user successfully', async () => {
    signOut.mockResolvedValue(undefined); // Simulamos que la salida fue exitosa

    await signOutUser();

    expect(signOut).toHaveBeenCalledWith(expect.anything());
  });

  it('should reset password', async () => {
    sendPasswordResetEmail.mockResolvedValue(undefined); // Simulamos éxito

    await resetPassword('test@example.com');

    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com'
    );
  });
});
