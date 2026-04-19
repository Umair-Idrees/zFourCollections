import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, onSnapshot, query, where, orderBy, limit, serverTimestamp, Timestamp, setDoc, getDocFromServer } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// @ts-ignore - JSON file is generated at runtime
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Connection test to verify Firebase setup
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase is offline. Check your configuration and authorized domains.");
    }
  }
}
testConnection();

// Auth Helpers
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save user profile to Firestore if it's their first login
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        role: ['umairmayo607@gmail.com', 'carenexon143@gmail.com'].includes(user.email || '') ? 'admin' : 'user'
      });
    }
    
    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

// Simulated Auth for Testing / Local Development
export const getSimulatedUser = () => {
  const data = localStorage.getItem('simulated_user');
  return data ? JSON.parse(data) : null;
};

export const setSimulatedUser = (user: any) => {
  localStorage.setItem('simulated_user', JSON.stringify(user));
  window.dispatchEvent(new Event('storage')); // Trigger update across tabs
};

export const clearSimulatedUser = () => {
  localStorage.removeItem('simulated_user');
  window.dispatchEvent(new Event('storage'));
};

const DEMO_ADMIN = {
  uid: 'demo-admin-123',
  email: 'umairmayo607@gmail.com',
  displayName: 'Admin Demo',
  photoURL: 'https://ui-avatars.com/api/?name=Admin+Demo&background=c5a059&color=fff',
  role: 'admin'
};

const DEMO_USER = {
  uid: 'demo-user-456',
  email: 'user@example.com',
  displayName: 'User Demo',
  photoURL: 'https://ui-avatars.com/api/?name=User+Demo&background=eee&color=333',
  role: 'user'
};

export const loginAsDemoAdmin = () => setSimulatedUser(DEMO_ADMIN);
export const loginAsDemoUser = () => setSimulatedUser(DEMO_USER);

export const loginWithGoogle = signInWithGoogle; // Alias for backward compatibility
export const logout = async () => {
  clearSimulatedUser();
  await signOut(auth);
};

// Firestore Error Handler
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export { collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, onSnapshot, query, where, orderBy, limit, serverTimestamp, Timestamp, onAuthStateChanged };
export { ref, uploadBytes, getDownloadURL };

// Custom Hook to manage Auth State (Unifies Firebase + Simulated)
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial check - check simulated user first
    const simUser = getSimulatedUser();
    if (simUser) {
      setUser(simUser);
    }

    // 2. Listen to Firebase Real Auth
    const unsubscribeFirebase = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
      } else if (!getSimulatedUser()) {
        setUser(null);
      }
      setLoading(false);
    });

    // 3. Listen to Simulated Auth changes (storage events)
    const handleStorageChange = () => {
      const updatedSimUser = getSimulatedUser();
      if (updatedSimUser) {
        setUser(updatedSimUser);
      } else if (!auth.currentUser) {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribeFirebase();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { user, loading, isAdmin: user && ['umairmayo607@gmail.com', 'carenexon143@gmail.com'].includes(user.email || '') };
}
