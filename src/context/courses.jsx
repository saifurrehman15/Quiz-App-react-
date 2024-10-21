import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { createContext, useEffect, useState } from "react";

export const quizCourses = createContext();

function CoursesProvider({ children }) {
  const [courses, setCourses] = useState([]); // Initialize as an empty array

  useEffect(() => {
    getCoursesDetails();
  }, []);

  const getCoursesDetails = async () => {
    try {
      const q = collection(db, "courses");
      const querySnapshot = await getDocs(q);
      const docsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        courseData: doc.data(),
      }));
      setCourses(docsArray); // Set courses array
      console.log(docsArray); // Log the fetched courses data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <quizCourses.Provider value={{ courses, setCourses }}>
      {/* Provide the courses array */}
      {children}
    </quizCourses.Provider>
  );
}

export default CoursesProvider;
