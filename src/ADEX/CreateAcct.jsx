import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ADEXimge from "../assets/ADEXimge.jpg";
import { useNavigate } from "react-router-dom";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase.jsx";

import { addUser } from "./iDB";

// ─────────────────────────────────────────────
// 🔸 CHECK FIRESTORE IF USER EMAIL EXISTS
// ─────────────────────────────────────────────
async function checkUserEmailPresent(user) {
  const email = user.email.toLowerCase();
  const ref = doc(db, "EmailIndex", email);

  try {
    const snap = await getDoc(ref);
    return snap.exists()
      ? { exists: true, data: snap.data() }
      : { exists: false };
  } catch (err) {
    console.error("Email check error:", err.message);
    return { exists: false };
  }
}

// ─────────────────────────────────────────────
// 🔸 UNIVERSAL PAGE
// ─────────────────────────────────────────────
export default function CreateAcct() {
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [redirectHandled, setRedirectHandled] = useState(false);

  const navigate = useNavigate();

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const provider = new GoogleAuthProvider();

  // ─────────────────────────────────────────────
  // 🔸 HANDLE THE USER AFTER AUTH
  // ─────────────────────────────────────────────
  async function processUser(user) {
    if (!user) return;

    setSpinnerVisible(true);
    setLoadingMessage("Checking your account...");

    const check = await checkUserEmailPresent(user);

    if (check.exists) {
      await addUser(check.data);
      localStorage.setItem("currentUser", JSON.stringify(check.data));
      navigate("/");
    } else {
      localStorage.setItem(
        "pendingUser",
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          uid: user.uid,
          photo: user.photoURL,
        })
      );
      navigate("/signup");
    }
  }

  // ─────────────────────────────────────────────
  // 🔸 HANDLE REDIRECT RETURN (MOBILE)
  // ─────────────────────────────────────────────
  useEffect(() => {
    async function handleRedirect() {
      try {
        const result = await getRedirectResult(auth);

        if (result && result.user) {
          setRedirectHandled(true);
          await processUser(result.user);
        }
      } catch (err) {
        console.error("Redirect error:", err.message);
      }
    }

    handleRedirect();
  }, []);


  // ─────────────────────────────────────────────
  // 🔸 AUTH LISTENER (CATCH ALL CASES)
  // ─────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (redirectHandled) return;  // prevent double firing

      if (user) {
        await processUser(user);
      }
    });

    return () => unsub();
  }, [redirectHandled]);


  // ─────────────────────────────────────────────
  // 🔸 MAIN LOGIN HANDLER (AUTO-CHOOSES METHOD)
  // ─────────────────────────────────────────────
  const handleCreateAcct = async () => {
    try {
      setSpinnerVisible(true);

      if (isMobile) {
        setLoadingMessage("Redirecting to Google...");
        await signInWithRedirect(auth, provider);
        return;
      }

      setLoadingMessage("Opening popup...");
      const result = await signInWithPopup(auth, provider);
      await processUser(result.user);

    } catch (err) {
      setSpinnerVisible(false);
      console.error("Login error:", err.message);
      alert(err.message);
    }
  };

  // ─────────────────────────────────────────────
  // 🔸 UI
  // ─────────────────────────────────────────────
  return (
    <div className="relative bg-black flex flex-col justify-start items-center w-full h-screen overflow-hidden p-6">

      {/* Floating Glows */}
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-500"></div>

      {/* Spinner */}
      {spinnerVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          flex items-center gap-4 bg-black/40 backdrop-blur-xl p-6 rounded-2xl
          border border-green-400/40 shadow-lg shadow-green-500/20 z-50 w-80 h-24"
        >
          <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-green-400 font-semibold text-lg text-center">
            {loadingMessage}
          </p>
        </motion.div>
      )}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 
        bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,200,0.3)]"
      >
        ADEX
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ y: 70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center gap-6 
        bg-white/10 backdrop-blur-xl border border-white/20 
        shadow-lg shadow-green-500/10 w-80 rounded-3xl p-8 mt-10 relative"

      >
        {/* Glow */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute w-40 h-40 rounded-full bg-green-400/10 blur-2xl -top-8"
        />

        <motion.div
          whileHover={{ scale: 1.1, rotate: 6 }}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400/40 to-green-700/40 
          border border-green-300/30 shadow-lg shadow-green-500/20"
        >
          <img src={ADEXimge} className="w-full h-full rounded-full object-cover" />
        </motion.div>

        <h2 className="text-white/90 font-bold text-2xl tracking-wide drop-shadow">
          Welcome to ADEX
        </h2>

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateAcct}
          className="bg-gradient-to-r from-green-400 to-green-600 
          text-black font-bold rounded-2xl py-3 px-10 
          shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Create Account
        </motion.button>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-sm text-white/60 mt-8"
      >
        Already have an account?{" "}
        <button onClick={() => navigate("/login")} className="oorder border-none background-transparent text-green-400 cursor-pointer hover:underline">
          Login
        </button>
      </motion.p>
    </div>
  );
}
