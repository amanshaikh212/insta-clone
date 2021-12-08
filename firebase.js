// Import the functions you need from the SDKs you need
import { initializeApp,getApps,getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNXABGAmEro9kJPQ57RkJE5ZkMZtTJ5Ek",
  authDomain: "insta-clone-67a79.firebaseapp.com",
  projectId: "insta-clone-67a79",
  storageBucket: "insta-clone-67a79.appspot.com",
  messagingSenderId: "440805754459",
  appId: "1:440805754459:web:46b48dd230e1226763617e"
};

// Initialize Firebase
const app = !getApps().length ?initializeApp(firebaseConfig):getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };