import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const STORAGE_KEY_FIREBASE = "the_ranking_firebase_config";

// Read from localStorage first, then fallback to Vite env variables
export function getStoredFirebaseConfig() {
  const local = localStorage.getItem(STORAGE_KEY_FIREBASE);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error reading stored Firebase config", e);
    }
  }

  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
  }

  return null;
}

export function saveFirebaseConfig(config) {
  if (!config) {
    localStorage.removeItem(STORAGE_KEY_FIREBASE);
  } else {
    localStorage.setItem(STORAGE_KEY_FIREBASE, JSON.stringify(config));
  }
}

let firebaseApp = null;
let firestoreDb = null;

export function getFirebaseInstance() {
  const config = getStoredFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return { app: null, db: null, isLive: false };
  }

  try {
    if (!firebaseApp) {
      firebaseApp = getApps().length > 0 ? getApp() : initializeApp(config);
      firestoreDb = getFirestore(firebaseApp);
    }
    return { app: firebaseApp, db: firestoreDb, isLive: true };
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return { app: null, db: null, isLive: false, error };
  }
}
