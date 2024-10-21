import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, auth, db } from "../utils/firebase";
import { createContext, useEffect, useState } from "react";

export const userContext = createContext();

function UserContextProvider({ children }) {
  const [users, setUser] = useState({}); // Initially set to null
  const [cheatData, setData] = useState([]);
  console.log(cheatData);

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
  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const q = collection(db, "cheatDetector");
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs);
      
      const docsArray = querySnapshot.docs.map((doc) => ({
         ...doc.data(),
      }));
      console.log(docsArray);
      
      setData(docsArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <userContext.Provider value={{ users, cheatData }}>
      {children}
    </userContext.Provider>
  );
}

export default UserContextProvider;
