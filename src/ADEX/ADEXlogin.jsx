import { useState } from "react";
import {
  getDoc,
  doc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth,db } from "../firebase/firebase.jsx";
import { addUser, deleteUser } from "./iDB.jsx";
import { useNavigate } from "react-router-dom";

export default function ADEXLogin() {
  const [regNm, setRegNm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", state: null }); // success or fail
  const navigate = useNavigate();

  // ===== MESSAGE DISPLAY =====
  const showMessage = (state, text) => {
    setMessage({ state, text });
    setTimeout(() => setMessage({ text: "", state: null }), 4000);
  };

  // ===== REG NUMBER FORMAT =====
  const standardizeRegNumber = (regNumber) => {
    const separators = [',', '-', ':', '_', ' ', ';', '|', ')', '(', '[', ']', '..'];
    const pattern = new RegExp(separators.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
    return regNumber.replace(pattern, '/').replace(/\/+/g, '/');
  };

  const displayDeptfromReg = (reg) => {
    const depath = `${reg.split('/')[1]}${reg.split('/')[2]}`;
    const objDept = {
      "EGCO": "COMPUTER_ENGINEERING",
      "EGCV": "CIVIL_ENGINEERING",
      "EGCE": "CHEMICAL_ENGINEERING",
      "EGEE": "ELECTRICAL_AND_ELECTRONICS_ENGINEERING",
    };
    return objDept[depath];
  };

  // ===== FIRESTORE LOOKUP ======
  async function findUserInFirestore(regNm) {
    const reg = regNm.replace(/\//g, "-");
    const dept = displayDeptfromReg(regNm);
    const level = regNm.split("/")[0];
    const docm = doc(db, "UNIUYO", level, dept, reg);

    try {
      const user = await getDoc(docm);
      if (user.exists()) return user.data();
    } catch (err) {
      console.error("Error finding user", err.message);
    }
    return false;
  }

  async function clearUserData() {
    // SIGN OUT from Firebase Auth (critical for mobile)
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Sign-out warning:", err.message);
    }

    // CLEAR IDB USER
    await deleteUser();

    // CLEAR OTHER STORES
    localStorage.removeItem("att-his");
    localStorage.removeItem("att-his-state");
    localStorage.removeItem("currentUser");

    // CLEAR INDEXEDDB DATABASES
    indexedDB.deleteDatabase("ADEXusers");
    indexedDB.deleteDatabase("warn");
  }


  // ===== INTERNET CHECK =====
  async function isOnline() {
    try {
      await fetch("https://www.gstatic.com/generate_204", {
        method: "GET",
        cache: "no-cache",
        mode: "no-cors",
      });
      return true;
    } catch {
      return false;
    }
  }

  // ==== SUBMIT LOGIN ====
  async function handleLogin(e) {
    e.preventDefault();

    if (!(await isOnline())) {
      return showMessage(false, "No internet connection!");
    }

    const reg = standardizeRegNumber(regNm.trim().toUpperCase());
    if (!reg) return showMessage(false, "Registration number is required.");

    setLoading(true);

    const userData = await findUserInFirestore(reg);

    if (!userData) {
      setLoading(false);
      showMessage(false, "User not found.");
      clearUserData();
      return navigate("/create");
    }

    if (userData.regNm === reg) {
      alert("user data" + JSON.stringify(userData));
      clearUserData();
      await addUser(userData);

      setLoading(false);
      showMessage(true, "Login successful!");

      return setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      setLoading(false);
      showMessage(false, "Credentials do not match.");
      await clearUserData();
    }
  }

  const handleNavigateToCreate = () => {
    clearUserData();
    navigate("/create");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[radial-gradient(circle_at_top_right,black,#213d1c)] text-green-500 font-sans">

      {/* ADEX */}
      <h1 className="bg-[#323232ba] mt-10 px-8 py-3 rounded-xl border border-white/50 text-3xl font-bold">
        ADEX
      </h1>

      <div className="mt-10 bg-[radial-gradient(circle_at_top_right,black,#323232ba)] p-8 rounded-2xl border border-white/40 w-[90%] max-w-md shadow-xl">

        <h2 className="text-center text-2xl font-bold mb-1 text-white">Welcome Back</h2>
        <p className="text-center text-gray-300 mb-6">Login to mark your attendance</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Registration Number"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#424242] text-white outline-none"
            value={regNm}
            onChange={(e) => setRegNm(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        {/* Spinner */}
        {loading && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-xl p-6 rounded-xl shadow-lg z-50">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {/* Footer */}
        <button
          onClick={handleNavigateToCreate}
          className="mt-6 w-full text-center text-yellow-400 font-bold"
        >
          Don’t have an account? <span className="text-blue-500 ">Create one</span>
        </button>
      </div>

      {/* Message Popup */}
      {message.text && (
        <div
          className={`fixed left-1/2 -translate-x-1/2 top-5 px-6 py-3 rounded-xl shadow-lg 
        ${message.state ? "bg-green-700 text-white" : "bg-red-700 text-white"}`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
