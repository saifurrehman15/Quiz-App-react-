import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { setDoc, getDoc, getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYzme8nxInYI2Awc3g7-s-s5THhVq2vgU",
  authDomain: "quiz-app-d4b22.firebaseapp.com",
  projectId: "quiz-app-d4b22",
  storageBucket: "quiz-app-d4b22.appspot.com",
  messagingSenderId: "424512278638",
  appId: "1:424512278638:web:e5bbe41b97c2f12388967f",
  measurementId: "G-RC409W5J3J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Analytics in the browser only
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, provider, onAuthStateChanged, db };
