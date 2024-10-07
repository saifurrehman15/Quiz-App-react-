import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase"; // Import your Firestore instance

function QuizPage() {
  const { quizSelected, id, courseName, time } = useParams();
  const quizTime = Number(time.split(" ")[0]); // This variable seems unused

  const [timer, setTimer] = useState(quizTime);
  const [optionsSelected, setOptionsSelected] = useState(false);
  const [btnText, setBtnText] = useState("Next");
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [checked, setChecked] = useState("");
  const [submitRes, setRes] = useState(false);
  const [optColor, setColor] = useState("");
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [optTrigger, setTrigger] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabledOpt, setDisOpt] = useState(false);
  const totalQuestions = data.length;

  useEffect(() => {
    getData();
  }, [quizSelected]);

  const answerCheck = async () => {
    let updatedScore = score;
    // Check if the selected answer is correct
    if (data[count].quiz.answer === checked) {
      updatedScore += 1;
      setScore(updatedScore); // Update state asynchronously
    }
    setOptionsSelected(false);
  
    // Move to the next question or show results
    if (count < data.length - 1) {
      setCount(count + 1);
      setChecked("");
      setDisOpt(false);
      setColor("");
    } else {
      // Prepare the result object
      const resultObj = {
        date: new Date(),
        course: courseName,
        subject: quizSelected,
        scores: (updatedScore * 100) / totalQuestions,
      };
  
      // Retrieve existing results from sessionStorage
      const existingResults = JSON.parse(sessionStorage.getItem("resultsData")) || [];
  
      // Append the new result to the array
      const updatedResults = [...existingResults, resultObj];
  
      // Store the updated array in sessionStorage
      sessionStorage.setItem("resultsData", JSON.stringify(updatedResults));
  
      // Push the final score to Firestore
      setRes(true);
      const userDocRef = doc(db, "users", id);
      await updateDoc(userDocRef, {
        result: arrayUnion(resultObj),
      });
      setRes(false);
  
      // Redirect to the result page
      window.location.replace(
        `/quickresult/${quizSelected}/${courseName}/${data.length}/2/${updatedScore}/${id}`
      );
    }
  };
  
  useEffect(() => {
    if (count === data.length - 1) {
      setBtnText("Submit");
      setIsLastQuestion(true);
    }
  }, [count]);

  const answerDetect = (e) => {
    let detect = data[count].quiz.answer === e;
    if (detect) {
      setColor("bg-green-400");
    } else {
      setColor("bg-red-400");
    }
    console.log(detect);
  };
  const getData = async () => {
    setLoading(true);
    try {
      const q = collection(db, quizSelected);
      const querySnapshot = await getDocs(q);
      const docsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        quiz: doc.data(),
      }));
      setData(docsArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-20 text-gray-800">
      {loading ? (
        <p className="text-xl">Loading...</p>
      ) : (
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">{`Question ${
            count + 1
          }/${totalQuestions}`}</h2>
          <p className="mb-4 text-lg">{data[count]?.quiz.question}</p>
          <div className="space-y-2">
            {data[count]?.quiz.options.map((elem, ind) => (
              <label
                htmlFor={`option${ind}`}
                className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg ${
                  `option${ind}` === optTrigger ? optColor : ""
                }`}
                key={ind}
              >
                <input
                  type="radio"
                  name="options"
                  id={`option${ind}`}
                  disabled={disabledOpt}
                  checked={checked === elem}
                  value={elem}
                  onChange={(e) => {
                    setChecked(e.target.value);
                    setOptionsSelected(true);
                    setDisOpt(true);
                    setTrigger(e.target.id);
                    answerDetect(e.target.value);
                  }}
                />
                {elem}
              </label>
            ))}
          </div>
          <button
            className={`mt-4 p-2 px-4 rounded-md ${
              optionsSelected
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300"
            } text-white`}
            disabled={!optionsSelected}
            onClick={answerCheck}
          >
            {submitRes ? "Submitting..." : btnText}
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
