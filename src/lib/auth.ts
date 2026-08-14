import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

export type { User };

export async function loginAdmin(email: string, password: string): Promise<User> {
  if (!auth || !isFirebaseConfigured()) {
    throw new Error("Firebase Auth is not configured. Please set your Firebase environment variables.");
  }
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function logoutAdmin(): Promise<void> {
  if (!auth || !isFirebaseConfigured()) return;
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void): Unsubscribe | (() => void) {
  if (!auth || !isFirebaseConfigured()) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  if (!auth || !isFirebaseConfigured()) return null;
  return auth.currentUser;
}
