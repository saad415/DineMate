// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMz46--H0mrcDepAvwy7BttfpMiBcnLYg",
  authDomain: "dinemate-947e9.firebaseapp.com",
  projectId: "dinemate-947e9",
  storageBucket: "dinemate-947e9.firebasestorage.app",
  messagingSenderId: "416216128713",
  appId: "1:416216128713:web:ca65898d6435c342d78118",
  measurementId: "G-GSQKEDBSG8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);