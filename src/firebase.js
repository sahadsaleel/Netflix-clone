import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD3OI33N7JgnTJBS-eHBMx6j_DhSEtor6s",
  authDomain: "netflix-clone-90c62.firebaseapp.com",
  projectId: "netflix-clone-90c62",
  storageBucket: "netflix-clone-90c62.firebasestorage.app",
  messagingSenderId: "267066082664",
  appId: "1:267066082664:web:cae7253b067d66e0c5c2dd",
  measurementId: "G-83HFJN4CYR"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)