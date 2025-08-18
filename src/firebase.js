// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-GZmygGoJ5SIiJL-U-7mXEUzuArofcL8",
  authDomain: "resound-b84a4.firebaseapp.com",
  projectId: "resound-b84a4",
  storageBucket: "resound-b84a4.firebasestorage.app",
  messagingSenderId: "165000373325",
  appId: "1:165000373325:web:8e79b07141ec108f08a804"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;