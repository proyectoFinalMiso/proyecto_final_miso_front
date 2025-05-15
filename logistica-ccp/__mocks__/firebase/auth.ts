export const getAuth = jest.fn(() => ({
  currentUser: null,
}));

export const onAuthStateChanged = jest.fn((auth, callback) => {
  callback({ uid: '123', email: 'test@example.com' });
  return jest.fn();
});

export const createUserWithEmailAndPassword = jest.fn();

export const signInWithEmailAndPassword = jest.fn();

export const sendEmailVerification = jest.fn();

export const sendPasswordResetEmail = jest.fn();

export const signOut = jest.fn();
