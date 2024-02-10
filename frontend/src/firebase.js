import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLKbBg91MMkW8j7WIMM1EDm9wA7_Z8vOU",
  authDomain: "mediamate-411214.firebaseapp.com",
  projectId: "mediamate-411214",
  storageBucket: "mediamate-411214.appspot.com",
  messagingSenderId: "64739718401",
  appId: "1:64739718401:web:f7fd82315cfe45acd91700"
};
 
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore(app);