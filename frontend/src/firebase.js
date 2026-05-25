import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBmIaJHw_OElJJQv16ArG4pTKpJyZ_r-s0",
  authDomain: "ai-career-buddy-9a999.firebaseapp.com",
  projectId: "ai-career-buddy-9a999",
  storageBucket: "ai-career-buddy-9a999.firebasestorage.app",
  messagingSenderId: "129969205749",
  appId: "1:129969205749:web:143adf9603548aaf04f0bc",
  measurementId: "G-9QK7QL9HSQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ✅ Persistence set karein
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Persistence error:", error);
  });

export default app;