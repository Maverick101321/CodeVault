import { useEffect } from "react";
import { auth } from "./firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import type { UserCredential } from "firebase/auth";

const App = () => {
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
    <div>
      <h1>Welcome to the Auth Portal</h1>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default App;
