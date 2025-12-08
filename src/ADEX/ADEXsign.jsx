import { useState } from "react";
import { db, auth } from "../firebase/firebase.jsx";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { addUser } from "./iDB.jsx"; 
import { useNavigate } from "react-router-dom";

export default function CreateAccount() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [regNm, setRegNm] = useState("");
  const [dept, setDept] = useState("COMPUTER_ENGINEERING");

  const [message, setMessage] = useState({ state: null, text: "" });
  const [loading, setLoading] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  // ================= MESSAGE =================
  function showMessage(state, text) {
    setMessage({ state, text });
    setTimeout(() => setMessage({ text: "", state: null }), 5000);
  }

  // =============== STANDARDIZE REG =================
  function standardizeRegNumber(regNumber) {
    const separators = [
      "),", ")-", ")(", "].[",
      ",", "-", ":", "_", " ", ";", "|", ")", "(", "[", "]",
      ".."
    ];

    const pattern = new RegExp(
      separators.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|"),
      "g"
    );

    return regNumber.replace(pattern, "/").replace(/\/+/g, "/");
  }

  // ================= CHECK USER IN FIRESTORE =================
  async function checkUser(email, dept, regNm) {
    const level = regNm.split("/")[0];
    const reg = regNm.replace(/\//g, "-");
    const docm = doc(db, "UNIUYO", level, dept, reg);
    const snap = await getDoc(docm);
    return snap.exists();
  }

  // ================= GET FIREBASE AUTH CURRENT USER =================
  function getCurrentUser() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) resolve(user);
        else reject("User not logged in");
      });
    });
  }

  // ================= OPEN EXISTING ACCOUNT =================
  async function verifyAndOpen(email, regNm, dept) {
    const level = regNm.split("/")[0];
    const reg = regNm.replace(/\//g, "-");
    const docm = doc(db, "UNIUYO", level, dept, reg);

    const snap = await getDoc(docm);
    if (!snap.exists()) return showMessage(false, "User not found");

    const user = snap.data();

    if (user.email !== email || user.regNm !== regNm) {
      return showMessage(false, "Invalid email or reg number");
    }

    await addUser(user);
    showMessage(true, `Welcome back ${user.name}`);
    navigate("/");
  }

  // ================= CREATE ACCOUNT =================
  async function createUser(user, name, regNm, email, dept) {
    const level = regNm.split("/")[0];
    const regNumber = regNm.split("/").pop();

    const newUser = {
      uid: user.uid,
      name,
      level,
      regNm,
      regNumber,
      email,
      dept,
      date: new Date().toISOString(),
      stdObj: {
        lockState: 0,
        lockStateTime: 0,
        lockStateDate: "",
      },
    };

    const reg = regNm.replace(/\//g, "-");

    const docm = doc(db, "UNIUYO", level, dept, reg);
    const emailDocm = doc(db, "EmailIndex", email);

    await setDoc(docm, newUser);
    await setDoc(emailDocm, newUser);

    await addUser(newUser);
    showMessage(true, "Account created successfully");
    navigate("/");
  }

  // ================= SUBMIT =================
  async function handleSubmit(e) {
    e.preventDefault();

    if (!navigator.onLine) return showMessage(false, "You are offline");

    const fullName = name.trim();
    const reg = standardizeRegNumber(regNm.trim()).toUpperCase();
    const department = dept.trim();

    if (!fullName || !reg || !department)
      return showMessage(false, "All fields are required");

    try {
      const firebaseUser = await getCurrentUser();
      const email = firebaseUser.email.toLowerCase();

      const exists = await checkUser(email, department, reg);

      if (exists) {
        setLoggingIn(true);
        await verifyAndOpen(email, reg, department);
        setLoggingIn(false);
        return;
      }

      setLoading(true);
      await createUser(firebaseUser, fullName, reg, email, department);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      showMessage(false, String(err));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-700 to-white flex flex-col items-center py-10 px-4">

      <h1 className="text-white text-4xl font-bold border-2 px-10 py-2 rounded-xl mb-6">
        ADEX
      </h1>

      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-2xl text-green-700 font-bold mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col">

          <input
            type="text"
            placeholder="Full Name"
            className="border-2 border-green-700 rounded-lg px-4 py-3 mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Reg Number YYY/FAC/DPT/NMB"
            className="border-2 border-green-700 rounded-lg px-4 py-3 mb-4"
            value={regNm}
            onChange={(e) => setRegNm(e.target.value)}
          />

          <select
            className="border-2 border-green-700 rounded-lg px-4 py-3 mb-4"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          >
            <option>COMPUTER_ENGINEERING</option>
            <option>GEOLOGY</option>
            <option>MECHANICAL_ENGINEERING</option>
            <option>ELECTRICAL_ENGINEERING</option>
          </select>

          <button
            type="submit"
            className="bg-green-700 text-white py-3 rounded-lg text-lg font-bold"
          >
            Create Account
          </button>

          <p
            onClick={() => navigate("/login")}
            className="mt-4 text-center text-yellow-600 font-bold cursor-pointer"
          >
            Already have an account? Log in
          </p>
        </form>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Logging in Spinner */}
      {loggingIn && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
          <div className="flex gap-3 items-center bg-white p-6 rounded-xl shadow-lg">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Logging in user…</span>
          </div>
        </div>
      )}

      {/* Status Message */}
      {message.text && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl ${
            message.state ? "bg-green-700 text-white" : "bg-red-700 text-white"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
