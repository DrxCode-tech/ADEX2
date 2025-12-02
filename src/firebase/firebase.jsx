// firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdJ1oZ5Wdm0Dsts27dcimYf1BAY5m543Y",
  authDomain: "note-44501.firebaseapp.com",
  projectId: "note-44501",
  storageBucket: "note-44501.firebasestorage.app",
  messagingSenderId: "65494389243",
  appId: "1:65494389243:web:a7938405576405d9dafb5e",
  measurementId: "G-KPHR5F2LBL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
//const analytics = getAnalytics(app);

// Export
export { app, auth, db, GoogleAuthProvider , signInWithPopup };