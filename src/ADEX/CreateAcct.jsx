import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithRedirect, onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { initDB, addUser } from "./iDB";

export default function CreateAcct() {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Check DB for email
  const checkEmail = async (email) => {
    const ref = doc(db, "EmailIndex", email.toLowerCase());
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  };

  // Watch auth state (MOST RELIABLE)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setLoading(true);
      setLoadingMessage("Checking account...");

      const userExists = await checkEmail(user.email);

      setLoading(false);

      if (userExists) {
        addUser(userExists);
      } else {
        alert("Welcome! Continue your registration.");
      }
    });

    return () => unsub();
  }, []);

  // Catch redirect errors only
  useEffect(() => {
    getRedirectResult(auth).catch((err) => {
      console.error("Redirect error:", err);
      alert(err.message);
    });
  }, []);

  const handleGoogle = () => {
    setLoading(true);
    setLoadingMessage("Redirecting...");
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      {loading && <p>{loadingMessage}</p>}
      <button 
        onClick={handleGoogle}
        className="bg-green-500 px-6 py-3 rounded-xl font-bold"
      >
        Continue with Google
      </button>
    </div>
  );
}
