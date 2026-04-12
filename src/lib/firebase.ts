import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBpHHyQosouwVPOAJbOWn9VweKu8plz-ow",
  authDomain: "annoda-project.firebaseapp.com",
  projectId: "annoda-project",
  storageBucket: "annoda-project.firebasestorage.app",
  messagingSenderId: "413487269537",
  appId: "1:413487269537:web:cc15a12d0b31b357e412e0",
  measurementId: "G-RKG2XMKZ25"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        getAnalytics(firebaseApp);
      }
    })
    .catch(() => {
      // Ignore analytics initialization errors to avoid blocking auth flows.
    });
}