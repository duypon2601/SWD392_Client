// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFsACHHQUZgjRFL43Nx-5UBcBP0kdZ3-Q",
  authDomain: "moon-hotpot-340c0.firebaseapp.com",
  projectId: "moon-hotpot-340c0",
  storageBucket: "moon-hotpot-340c0.firebasestorage.app",
  messagingSenderId: "673413489211",
  appId: "1:673413489211:web:6eabfdc6184da3b9dc321e",
  measurementId: "G-YZQ64F6025"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// const analytics = getAnalytics(app);

export {storage};