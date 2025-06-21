// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from '@env';

// Validate environment variables
if (!FIREBASE_API_KEY || !FIREBASE_AUTH_DOMAIN || !FIREBASE_PROJECT_ID || 
    !FIREBASE_STORAGE_BUCKET || !FIREBASE_MESSAGING_SENDER_ID || !FIREBASE_APP_ID) {
  throw new Error('Missing required Firebase environment variables');
}

// Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Custom persistence with AsyncStorage
const AUTH_PERSISTENCE_KEY = 'firebase_auth_user';

const saveUserToStorage = async (user: any) => {
  try {
    if (user) {
      await AsyncStorage.setItem(AUTH_PERSISTENCE_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(AUTH_PERSISTENCE_KEY);
    }
  } catch (error) {
    console.error('Failed to save user to AsyncStorage:', error);
  }
};

const getUserFromStorage = async (): Promise<any> => {
  try {
    const userJson = await AsyncStorage.getItem(AUTH_PERSISTENCE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Failed to get user from AsyncStorage:', error);
    return null;
  }
};

// Sync auth state with AsyncStorage
onAuthStateChanged(auth, (user) => {
  saveUserToStorage(user);
});

export { app, auth, db, getUserFromStorage };