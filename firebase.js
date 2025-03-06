// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOPKrHlaoKa8GZlWwQ6J48gUIuz5kZdqY",
  authDomain: "education-master-c9fd0.firebaseapp.com",
  databaseURL: "https://education-master-c9fd0-default-rtdb.firebaseio.com",
  projectId: "education-master-c9fd0",
  storageBucket: "education-master-c9fd0.firebasestorage.app",
  messagingSenderId: "55536465930",
  appId: "1:55536465930:web:e8f34d0fe2b1d1b408c7f3",
  measurementId: "G-MGXZPFXBVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

// Export the Firebase app instance and Firestore
export default app;
export { db };