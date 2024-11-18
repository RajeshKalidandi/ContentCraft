import { initializeApp, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
};

let firebaseApp;

try {
  firebaseApp = getApp();
} catch {
  firebaseApp = initializeApp(firebaseConfig);
}

export const auth = getAuth(firebaseApp);

// Initialize persistence synchronously to avoid race conditions
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Persistence error:", error);
});

export const database = getDatabase(firebaseApp);
export default firebaseApp;