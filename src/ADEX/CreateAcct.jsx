import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import ADEXimge from "../assets/ADEXimge.jpg";

import { doc, getDoc } from "firebase/firestore";
import { db, auth,GoogleAuthProvider, signInWithPopup } from "../firebase/firebase.jsx";

import { initDB, addUser } from "./iDB";

async function checkUserEmailPresent(user) {
  const email = user.email.toLowerCase();
  const ref = doc(db, 'EmailIndex', email);
  try {
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) return { exists: true, data: snapshot.data() };
    return { exists: false };
  } catch (err) {
    console.error('Error checking user:', err.message);
    alert(err.message);
  }
}

export default function CreateAcct() {
  const [loadingMessage, setLoadingMessage] = useState("");
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const autoLoginIfStored = async () => {
    try {
      const local = localStorage.getItem('currentUser');
      let localResult = local ? JSON.parse(local) : null;
      console.log(localResult);

      const db = await initDB();
      const tx = db.transaction("users", "readonly");
      const store = tx.objectStore("users");
      const getUser = await store.getAll();

      if (getUser.result) {
        setLoadingMessage(`${getUser.result.name || 'User'} logging in...`);
        console.log(getUser.result);
      }
      else if (localResult) {
        setLoadingMessage(`${localResult.name || 'User'} logging in...`);
        console.log(localResult);
      }
    } catch (err) {
      console.error('Error during auto-login:', err);
    }
  }

  useEffect(() => {
    autoLoginIfStored();
  }, []);

  const handleCreateAcct = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setLoadingMessage("Checking user data...");
      setSpinnerVisible(true);

      const check = await checkUserEmailPresent(user);
      setSpinnerVisible(false);

      if (check.exists) {
        addUser(check.data);
      } else {
        alert('Sign in successful. Please complete your registration.');
      }
    } catch (err) {
      setSpinnerVisible(false);
      if (err.code === 'auth/popup-closed-by-user') {
        alert("You closed the popup. Try again.");
      } else {
        console.log('Error from create acct button click :', err.message);
        alert("Oops your internet connection is bad");
      }
    }
  };

  return (
    <div className="relative bg-black flex flex-col justify-center items-center w-full h-screen overflow-hidden p-6">

      {/* 🔥 Floating Neon Blobs (Gen-Z Energy) */}
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-500"></div>

      {/* Spinner */}
      {spinnerVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          flex items-center gap-4 bg-black/40 backdrop-blur-xl p-4 rounded-2xl 
          border border-green-400/40 shadow-lg shadow-green-500/20 z-50 w-72 h-20"
        >
          <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-green-400 font-semibold text-lg">{loadingMessage}</p>
        </motion.div>
      )}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 
        bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,200,0.3)]"
      >
        ADEX
      </motion.div>

      {/* Glass Card */}
      <motion.div
        initial={{ y: 70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9 }}
        whileHover={{ scale: 1.02 }}
        className="flex flex-col items-center gap-6 
        bg-white/10 backdrop-blur-xl border border-white/20 
        shadow-lg shadow-green-500/10 w-80 rounded-3xl p-8 mt-10 relative"
      >
        {/* Glow circle behind avatar */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute w-40 h-40 rounded-full bg-green-400/10 blur-2xl -top-8"
        ></motion.div>

        {/* Profile Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 6 }}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400/40 to-green-700/40 
          border border-green-300/30 shadow-lg shadow-green-500/20"
        >
          <img src={ADEXimge} alt="ADEX Profile" className="w-full h-full rounded-full object-cover" />
        </motion.div>

        <h2 className="text-white/90 font-bold text-2xl tracking-wide drop-shadow">
          Welcome to ADEX
        </h2>

        {/* Create Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 0 15px rgba(0,255,200,0.2)",
              "0 0 25px rgba(0,255,200,0.4)",
              "0 0 15px rgba(0,255,200,0.2)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
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
        transition={{
          duration: 1,
          type: "spring",
          stiffness: 150,
          delay: 0.5,
        }}
        className="text-sm text-white/60 mt-8"
      >
        Already have an account?{" "}
        <span className="text-green-400 cursor-pointer hover:underline hover:text-green-300">
          Login
        </span>
      </motion.p>
    </div>
  );
}
