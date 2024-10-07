import { onAuthStateChanged, auth } from "../utils/firebase";
import { createContext, useEffect, useState } from "react";

export const userContext = createContext();

function UserContextProvider({ children }) {
  const [user, setUser] = useState({}); // Initially set to null

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setUser({
          displayName: user.displayName,
          email: user.email,
          id: user.uid,
          url: user.photoURL,
          isLogin: true,
        });
        sessionStorage.setItem("logged", JSON.stringify(true));
      } else {
        setUser({ isLogin: false, email: "", url: "" });
        sessionStorage.setItem("logged", JSON.stringify(false));
        //
      }
    });

    return () => unsubscribe();
  }, []);

  return <userContext.Provider value={user}>{children}</userContext.Provider>;
}

export default UserContextProvider;
