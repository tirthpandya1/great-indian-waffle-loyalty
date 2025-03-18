const { initializeApp } = require('firebase/app');
const { getAuth, onAuthStateChanged, signInWithPopup, getRedirectResult, GoogleAuthProvider, signInAnonymously } = require('firebase/auth');
const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore');
const { getAnalytics, logEvent } = require('firebase/analytics');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAE_86RLBe5np5A1AVxsTZQ-NKx2v_nwy0",
  authDomain: "great-indian-waffle-1.firebaseapp.com",
  projectId: "great-indian-waffle-1",
  storageBucket: "great-indian-waffle-1.firebasestorage.app",
  messagingSenderId: "152691464276",
  appId: "1:152691464276:web:1fd4eb2bfe30e15032f5c1",
  measurementId: "G-C0M4039KJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firestore with specific settings
const db = getFirestore(app);

// Set persistence to local for better offline support
const { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } = require('firebase/firestore');

// Re-initialize Firestore with better caching settings
try {
  // Use the initialized app but with better cache settings
  const firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
  
  // Replace the default db with our enhanced version
  Object.assign(db, firestoreDb);
  console.log('Enhanced Firestore initialized with persistent cache');
} catch (error) {
  console.warn('Could not initialize enhanced Firestore:', error);
  // Continue with standard db
}

// Configure Firestore for better reliability
const { setLogLevel } = require('firebase/firestore');

// Set logging level to debug during development
try {
  setLogLevel('debug');
  console.log('Firestore logging level set to debug');
} catch (error) {
  console.warn('Could not set Firestore logging level:', error);
}

// Helper function to check Firestore connection
const checkFirestoreConnection = async () => {
  try {
    const { collection, getDocs, query, limit } = require('firebase/firestore');
    // Try to fetch a single document to test connection
    const testQuery = query(collection(db, 'users'), limit(1));
    await getDocs(testQuery);
    console.log('Firestore connection verified successfully');
    return true;
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return false;
  }
};

// Call this function to verify connection
checkFirestoreConnection();

// Initialize Analytics only in browser environment
let analytics = null;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
    console.log('Firebase Analytics initialized successfully');
    logEvent(analytics, 'app_initialized');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Analytics:', error);
}

// Function to check if user is authenticated
const checkAuthState = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, (error) => {
      console.error('Error checking auth state:', error);
      unsubscribe();
      resolve(null);
    });
  });
};

module.exports = { 
  app, 
  auth, 
  db, 
  analytics, 
  onAuthStateChanged, 
  signInWithPopup, 
  getRedirectResult, 
  GoogleAuthProvider,
  checkAuthState,
  logEvent
};
