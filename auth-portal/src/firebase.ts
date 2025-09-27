import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// TODO: Replace with your actual firebaseConfig
const firebaseConfig = {
apiKey: "AIzaSyCDJwvT99ndsuhPzELWNEHuxUiHbvMIZ4c",
authDomain: "contextualcodevault.firebaseapp.com",
projectId: "contextualcodevault",
storageBucket: "contextualcodevault.firebasestorage.app", 
messagingSenderId: "191088879535" ,
appId: "1:191088879535 :web:47d4c2f4425863b05af15a", 
measurementId: "G-QSQJ02KFQ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };