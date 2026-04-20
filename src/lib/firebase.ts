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
// Backend Auth Helper
export const signInWithGoogleBackend = async () => {
  try {
    const res = await fetch('/api/auth/google/url');
    if (!res.ok) throw new Error('Failed to get auth URL');
    const { url } = await res.json();
    
    const width = 600;
    const height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    
    window.open(url, 'google_login', `width=${width},height=${height},top=${top},left=${left}`);
  } catch (error) {
    console.error("Backend Google Login Error:", error);
    // Fallback to standard Firebase popup if backend fails
    return await signInWithGoogle();
  }
};

export const superAccessLogin = async (email: string, password: string) => {
  const res = await fetch('/api/auth/super-access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (res.ok) {
    const user = await res.json();
    setSimulatedUser(user);
    return user;
  }
  throw new Error('Invalid super access credentials');
};

export const logout = async () => {
  clearSimulatedUser();
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    await signOut(auth);
  } catch (err) {
    console.error('Logout error:', err);
  }
  window.location.href = "/";
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

// Custom Hook to manage Auth State (Unifies Firebase + Simulated + Backend)
import { useState, useEffect } from 'react';

export const fetchBackendUser = async () => {
  try {
    const res = await fetch('/api/auth/user', {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // Silent in production-like preview environment unless it's a real issue
    // This often happens during dev server cold starts or restarts
    console.warn('Backend user fetch was interrupted or server is starting up.');
  }
  return null;
};

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check simulated user first
      const simUser = getSimulatedUser();
      if (simUser) {
        setUser(simUser);
        setLoading(false);
        return;
      }

      // 2. Check backend session
      const backendUser = await fetchBackendUser();
      if (backendUser) {
        setUser(backendUser);
        setLoading(false);
        return;
      }

      // 3. Fallback to Firebase Real Auth listener
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          setUser(fbUser);
        }
        setLoading(false);
      });
      return unsubscribe;
    };

    initAuth();

    const handleStorageChange = () => {
      const updatedSimUser = getSimulatedUser();
      if (updatedSimUser) {
        setUser(updatedSimUser);
      } else {
        fetchBackendUser().then(bu => setUser(bu));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Listen for OAuth success from popup
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const u = event.data.user;
        if (u) {
          setSimulatedUser(u);
          setUser(u);
        }
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const adminEmails = ['umairmayo607@gmail.com', 'carenexon143@gmail.com', 'admin@test.com'];
  const isAdmin = user ? adminEmails.includes(user.email || '') : false;

  return { user, loading, isAdmin };
}
