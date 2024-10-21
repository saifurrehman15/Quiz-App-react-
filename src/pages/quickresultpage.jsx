import { deleteDoc, doc } from "firebase/firestore";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../utils/firebase";
import { useEffect } from "react";
import { useState } from "react";
import { Spin } from "antd";

function QuickResult() {
  const { nameQuiz, courseName, id, totalQuestions, score } = useParams();
  const correctAns = score;
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    let timeout;
    timeout = setTimeout(() => {
      setLoader(false);
    }, 2500);

    return () => clearTimeout(timeout);
  });
  useEffect(() => {
    DeleteCheat();
  }, []);

  async function DeleteCheat() {
    if (score || totalQuestions) {
      const q = doc(db, "cheatDetector", id);
      await deleteDoc(q);
    }
  }
  console.log(nameQuiz, courseName, id, totalQuestions, score);
  const percentage = (score * 100) / totalQuestions;
  const remarks =
    percentage >= 70 ? "Congratulations, you passed" : "Better Luck next time!";
  const borderColor = percentage >= 70 ? "text-green-500" : "text-red-500";
  return (
    <>
      {loader ? (
       <div className="w-full text-center"><Spin/></div>
      ) : (
        <div className="text-white">
          <h1 className="font-bold text-2xl">{nameQuiz}</h1>
          <div className="bg-white text-gray-900  sm:w-1/2 p-3 px-5 rounded text-center mx-auto sm:mt-10">
            <div className="mb-2">
              <h3 className={`${borderColor} text-2xl font-bold`}>{remarks}</h3>
            </div>
            <div className="relative mx-auto mt-3 mb-3  w-20 h-20 circle">
              {/* Circle to show percentage in border */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(${
                    borderColor == "text-red-500" ? "red" : "green"
                  } ${percentage * 3.6}deg, transparent 0deg)`,
                  clipPath: "circle(50% at 50% 50%)",
                }}
              ></div>

              {/* Cover the inner part of the circle to create the border effect */}
              <div className="absolute inset-1 rounded-full bg-white"></div>

              {/* Inner circle with percentage text */}
              <div className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-transparent">
                <span className={`text-lg font-bold ${borderColor}`}>
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="flex justify-between font-bold border-b p-2">
              <p>Total Questions</p>
              <p>{totalQuestions}</p>
            </div>
            <div className="flex justify-between font-bold border-b p-2">
              <p>Correct Questions</p>
              <p>{correctAns}</p>
            </div>
            <div className="mt-4 mb-2">
              <button
                onClick={() => window.location.replace("/")}
                className="bg-blue-400 text-white py-2 px-4 font-bold rounded no-underline"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuickResult;
