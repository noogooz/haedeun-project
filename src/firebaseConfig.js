import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase 콘솔에서 복사한 정보 입력!
const firebaseConfig = {
    apiKey: "AIzaSyDMKfPvKvEflTHc3PEU3WZ957fiJAnQ5xo",
    authDomain: "haedeun-project.firebaseapp.com",
    projectId: "haedeun-project",
    storageBucket: "haedeun-project.firebasestorage.app",
    messagingSenderId: "458181741580",
    appId: "1:458181741580:web:ac79bfdc2e50bf5a53f229",
  appId: "YOUR_APP_ID"
};

// ✅ Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore 연동

export { db };
