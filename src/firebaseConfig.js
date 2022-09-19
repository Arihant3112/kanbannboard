import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCk26m3Xsg_SwyQcDnlmUzLpThgB-V1Cno",
  authDomain: "kanbannboard.firebaseapp.com",
  projectId: "kanbannboard",
  storageBucket: "kanbannboard.appspot.com",
  messagingSenderId: "756967588954",
  appId: "1:756967588954:web:2f809759ebb1ec64bec463",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
