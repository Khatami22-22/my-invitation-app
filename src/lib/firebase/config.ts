import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate config
const isConfigValid = Object.values(firebaseConfig).every(value => value && value.trim() !== '');

if (!isConfigValid) {
  console.warn('⚠️ Firebase config tidak lengkap. Pastikan .env.local sudah diisi dengan benar.');
  console.warn('Check: NEXT_PUBLIC_FIREBASE_API_KEY, PROJECT_ID, dll');
}

// Mencegah inisialisasi ganda saat hot-reload
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export { app };