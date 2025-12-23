import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Configuração Firebase (Vite .env)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Evita múltiplas inicializações em HMR (Vite)
 */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * Firebase Auth
 */
export const auth = getAuth(app);

/**
 * Firestore Database
 */
export const db = getFirestore(app);

export const addNotification = async (notification) => {
  const docRef = await addDoc(collection(db, 'notifications'), {
    ...notification,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const getNotifications = async () => {
  const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteNotification = async (id) => {
  await deleteDoc(doc(db, 'notifications', id));
};