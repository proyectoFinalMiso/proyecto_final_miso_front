import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

console.log(initializeApp);

const firebaseConfig = {
  apiKey: 'AIzaSyCBTgagW_0yNiUbOvUWdIMgiGF5TmQJMkg',
  authDomain: 'no-monolitos-2bf52.firebaseapp.com',
  projectId: 'no-monolitos-2bf52',
  storageBucket: 'no-monolitos-2bf52.firebasestorage.app',
  messagingSenderId: '789567421228',
  appId: '1:789567421228:web:ab088fc4c8978f0ff6ca89',
  measurementId: 'G-NYFH07M000',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log(getAuth);

export { app, auth };
