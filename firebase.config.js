// Firebase Configuration
// Replace with your Firebase project credentials
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'foodtracking-5a8ea',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'foodtracking-5a8ea',
  databaseURL: 'https://foodtracking-5a8ea-default-rtdb.firebaseio.com/',
};

let app;
let auth;
let database;
let storage;

// Only initialize if valid credentials are provided
try {
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('YOUR_')) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);
    storage = getStorage(app);
  } else {
    // Create dummy objects for development
    console.warn('Firebase credentials not configured. Using mock objects.');
    app = null;
    auth = {};
    database = {};
    storage = {};
  }
} catch (error) {
  console.warn('Firebase initialization error:', error.message);
  app = null;
  auth = {};
  database = {};
  storage = {};
}

export { auth, database, storage };
export default app;
