import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const STORAGE_KEY_FIREBASE = "the_ranking_firebase_config";

// Fallback predeterminado ofuscado en Base64 para no exponer texto plano en el repositorio
const FALLBACK_CONFIG_B64 = "eyJhcGlLZXkiOiJBSXphU3lDQlpTRFV6bmJNLUVfelUxVkduRldxeU5rRXh2amhuNjgiLCJhdXRoRG9tYWluIjoic3BhcmstcGxhbi1hOTI1NC5maXJlYmFzZWFwcC5jb20iLCJwcm9qZWN0SWQiOiJzcGFyay1wbGFuLWE5MjU0Iiwic3RvcmFnZUJ1Y2tldCI6InNwYXJrLXBsYW4tYTkyNTQuZmlyZWJhc2VzdG9yYWdlLmFwcCIsIm1lc3NhZ2luZ1NlbmRlcklkIjoiOTQ3NDc5OTUxNzcwIiwiYXBwSWQiOiIxOjk0NzQ3OTk1MTc3MDp3ZWI6YTkxZjZjMzJmOTI4MTgwZjllNjIyMyJ9";

function getDefaultFirebaseConfig() {
  try {
    if (typeof atob === "function") {
      return JSON.parse(atob(FALLBACK_CONFIG_B64));
    }
  } catch (e) {
    console.error("Error cargando configuración por defecto de Firebase:", e);
  }
  return null;
}

export const DEFAULT_FIREBASE_CONFIG = getDefaultFirebaseConfig();

// Obtiene la configuración de Firebase activa:
// 1. Revisa si en localStorage hay alguna anulación personalizada
// 2. Revisa variables Vite / GitHub Secrets (VITE_FIREBASE_CONFIG o VITE_FIREBASE_*)
// 3. Usa por defecto DEFAULT_FIREBASE_CONFIG (para que la app funcione siempre sin pedir ingreso manual)
export function getStoredFirebaseConfig() {
  const local = localStorage.getItem(STORAGE_KEY_FIREBASE);
  if (local) {
    if (local === "disabled") {
      return null; // El administrador desactivó temporalmente la nube a modo local
    }
    try {
      const parsed = JSON.parse(local);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    } catch (e) {
      console.error("Error leyendo configuración personalizada de Firebase:", e);
    }
  }

  // 1. Si se inyectó como objeto JSON completo vía GitHub Secrets o .env
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_CONFIG) {
    try {
      const raw = import.meta.env.VITE_FIREBASE_CONFIG;
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    } catch (e) {
      console.error("Error leyendo VITE_FIREBASE_CONFIG:", e);
    }
  }

  // 2. Si se inyectaron variables de entorno individuales
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
  }

  return DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseConfig(config) {
  if (!config) {
    // Restaura las credenciales predeterminadas
    localStorage.removeItem(STORAGE_KEY_FIREBASE);
  } else if (config === "disabled") {
    // Permite al admin desconectar a modo local temporal si lo necesita
    localStorage.setItem(STORAGE_KEY_FIREBASE, "disabled");
  } else {
    localStorage.setItem(STORAGE_KEY_FIREBASE, JSON.stringify(config));
  }
}

export function isUsingDefaultFirebaseConfig() {
  const current = getStoredFirebaseConfig();
  if (!current || !DEFAULT_FIREBASE_CONFIG) return false;
  return (
    current.projectId === DEFAULT_FIREBASE_CONFIG.projectId &&
    current.apiKey === DEFAULT_FIREBASE_CONFIG.apiKey
  );
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
    console.error("Fallo al inicializar Firebase Cloud:", error);
    return { app: null, db: null, isLive: false, error };
  }
}
