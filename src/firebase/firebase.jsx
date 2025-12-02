// firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdJ1oZ5Wdm0Dsts27dcimYf1BAY5m543Y",
  authDomain: "attendanceapp-6abcb.firebaseapp.com",
  projectId: "attendanceapp-6abcb",
  storageBucket: "attendanceapp-6abcb.firebasestorage.app",
  messagingSenderId: "849169932083",
  appId: "1:849169932083:web:b4c22d965b436eae512846"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
//const analytics = getAnalytics(app);

// Export
export { app, auth, db, GoogleAuthProvider , signInWithPopup };