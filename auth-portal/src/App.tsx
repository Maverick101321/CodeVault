import { useEffect, useState } from "react";
import { auth } from "./firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import type { UserCredential } from "firebase/auth";

const App = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    const uiConfig = {
      signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID,
      ],
      signInSuccessUrl: "/",
      callbacks: {
        signInSuccessWithAuthResult: (authResult: UserCredential) => {
          console.log("Successfully signed in with auth result:", authResult);
          authResult.user.getIdToken().then((idToken) => {
            const extensionId = "hlbngceeiifhipcmdfdhcnbljdbppkcb";
            chrome.runtime.sendMessage(extensionId, { token: idToken });
          });
          // Return false to prevent redirect
          return false;
        },
      },
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  }, []);

  return (
    <div className="app-container">
      <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
        {theme === "light" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        )}
      </button>

      <h1>CodeVault</h1>
      <div className="auth-container">
        <div id="firebaseui-auth-container"></div>
      </div>
    </div>
  );
};

export default App;
