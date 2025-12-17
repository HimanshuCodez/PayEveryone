// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAL-8BPqaHuFxZldCNEXdhfJ427j2hwFTo",
  authDomain: "payeveryone-deae7.firebaseapp.com",
  projectId: "payeveryone-deae7",
  storageBucket: "payeveryone-deae7.firebasestorage.app",
  messagingSenderId: "706500042136",
  appId: "1:706500042136:web:e4b6e7c70af58df7899fed",
  measurementId: "G-6TWNNR60NJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };

