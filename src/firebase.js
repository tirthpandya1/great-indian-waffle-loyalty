const { initializeApp } = require('firebase/app');
const { getAuth, onAuthStateChanged, signInWithPopup, getRedirectResult, GoogleAuthProvider, signInAnonymously } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
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
const db = getFirestore(app);

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

// Debug function for anonymous sign-in as fallback
const debugSignInAnonymously = async () => {
  try {
    console.log('Attempting anonymous sign-in as fallback...');
    const result = await signInAnonymously(auth);
    console.log('Anonymous sign-in successful:', result.user);
    return result.user;
  } catch (error) {
    console.error('Anonymous sign-in failed:', error);
    return null;
  }
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
  debugSignInAnonymously,
  logEvent
};
