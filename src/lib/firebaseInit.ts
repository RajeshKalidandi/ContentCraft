import { auth } from './firebase';

export async function checkFirebaseInit() {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(true);
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      unsubscribe();
      resolve(false);
    }, 5000);
  });
} 