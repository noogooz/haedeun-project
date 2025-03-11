import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Firebase Auth 추가

const firebaseConfig = {
  apiKey: "AIzaSyDMKfPvKvEflTHc3PEU3WZ957fiJAnQ5xo",
  authDomain: "haedeun-project.firebaseapp.com",
  projectId: "haedeun-project",
  storageBucket: "haedeun-project.firebasestorage.app",
  messagingSenderId: "458181741580",
  appId: "1:458181741580:web:ac79bfdc2e50bf5a53f229",
appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // ✅ Firebase Auth 추가

export { db, auth }; // ✅ `auth`를 올바르게 export
