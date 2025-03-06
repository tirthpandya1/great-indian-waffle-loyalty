const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

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

module.exports = { auth };
