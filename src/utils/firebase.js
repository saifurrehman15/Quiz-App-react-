import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh3AkTF-zbHFeuWEtvYcp1Mzz8igva-S0",
  authDomain: "ffaa-1a5f9.firebaseapp.com",
  projectId: "ffaa-1a5f9",
  storageBucket: "ffaa-1a5f9.firebasestorage.app",
  messagingSenderId: "813877709420",
  appId: "1:813877709420:web:94a2abe8058b865b93a649",
  measurementId: "G-TE2XV3LQHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Analytics in the browser only
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, provider, onAuthStateChanged, db, storage };
