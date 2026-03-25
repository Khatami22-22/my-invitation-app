/**
 * Firebase Authentication Utilities
 */

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { app } from './config';

const auth = getAuth(app);

/**
 * Sign in with email and password
 */
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    return { success: false, error: errorMessage };
  }
};

/**
 * Sign out current user
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Logout failed';
    return { success: false, error: errorMessage };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
