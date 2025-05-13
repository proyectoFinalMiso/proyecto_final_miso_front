export const signin = jest.fn(async (email: string, password: string) => {
  if (email === 'test@example.com' && password === 'validpassword') {
    return { success: true, user: { uid: 'abc123' } };
  }

  return { success: false, code: 'auth_invalid_credential' };
});

export const signOutUser = jest.fn(async () => {
  console.log('Mock: Usuario deslogeado exitosamente.');
});
