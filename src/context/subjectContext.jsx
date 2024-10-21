import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const quizSubjects = createContext();

function SubjectProvider({ children }) {
  const [subjectData, setSubjects] = useState([]); // Initialize as an empty array
  const [category, setCategory] = useState("Web And App Development");
  console.log(category);
  const location = useLocation();
  // useEffect(() => {
  //   setCategory("");
  // }, [location]);
  
  useEffect(() => {
    getSubjectsDetails();
  }, [category]);

  const getSubjectsDetails = async () => {
    try {
      const q = collection(db, category);
      const querySnapshot = await getDocs(q);
      const docsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        subjectDetails: doc.data(),
      }));
      setSubjects(docsArray); // Set courses array
      console.log(docsArray); // Log the fetched courses data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <quizSubjects.Provider
      value={{ subjectData, setSubjects, setCategory, category }}
    >
      {/* Provide the courses array */}
      {children}
    </quizSubjects.Provider>
  );
}

export default SubjectProvider;
