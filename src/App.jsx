import { useContext, useState, useEffect } from "react";
import "./App.css";
import { userContext } from "./context/userContext";
import { Link } from "react-router-dom";
import { message } from "antd";

function App() {
  const cheatDetector = JSON.parse(localStorage.getItem("ifCheat")) || {};
  const cheatOrNot = cheatDetector.cheat;
  const timeOfSuspension = cheatDetector.timeSuspend;

  const [suspend, setSuspend] = useState(false);
  
  // Check if the suspension has ended
  useEffect(() => {
    if (timeOfSuspension) {
      const endSuspensionTime = new Date(timeOfSuspension);
      endSuspensionTime.setHours(endSuspensionTime.getHours() + 10); // Assuming 10 hours suspension
      const currentTime = new Date();

      // Check if the current time is past the end of the suspension
      if (currentTime >= endSuspensionTime) {
        localStorage.removeItem("ifCheat"); // Clear the suspension data
        setSuspend(false); // Clear the suspend state
        message.success("Your suspension has ended. You may proceed.");
      } else {
        setSuspend(true); // Set suspend state if still suspended
      }
    }
  }, [timeOfSuspension]);

  const arr = [
    {
      course: "Entry Test",
      active: false,
      totalSubjects: 1,
      image: "src/assets/entry.png",
    },
    {
      course: "Web and App Development",
      active: true,
      totalSubjects: 4,
      image: "src/assets/web.png",
    },
    {
      course: "Typescript",
      active: true,
      totalSubjects: 1,
      image: "src/assets/typescript.svg",
    },
    {
      course: "Python",
      active: false,
      totalSubjects: 1,
      image: "src/assets/267_Python-512.webp",
    },
    {
      course: "Generative AI & Chatbot",
      active: false,
      totalSubjects: 1,
      image: "src/assets/AI.png",
    },
  ];

  const users = useContext(userContext);
  const { displayName, id } = users;

  return (
    <>
      <div className="text-white text-center">
        <h1 className="text-3xl sm:text-4xl mb-4 font-extrabold">
          Hi, {displayName}
        </h1>
        <p className="text-lg mb-8">
          Welcome to the quiz portal. Select your course below to take a quiz.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-6">
        {arr.map((elem, ind) => (
          <div
            className={`bg-gray-800 h-[250px] w-[300px] p-4 shadow-lg rounded-md transition-all transform hover:scale-105 hover:shadow-2xl flex flex-col justify-between items-center text-center`}
            key={ind}
          >
            <img
              src={elem.image}
              alt={elem.course}
              className="w-16 h-16 mb-4 object-cover rounded-full border-2 border-gray-700 transition-transform transform hover:scale-110"
            />
            <h3 className="text-lg font-bold mb-2 text-white">{elem.course}</h3>
            <h4 className="font-medium text-gray-300 mb-4">
              {elem.totalSubjects} Subjects
            </h4>
            <Link
              to={
                elem.active && !cheatOrNot && !suspend 
                  ? `/subject/${elem.course}/${id}`
                  : ""
              }
              onClick={() => {
                if (!elem.active) {
                  message.warning("This quiz is not available at the moment.");
                }
                if (cheatOrNot && elem.active) {
                  message.error(
                    "Cheating has been detected during the exam. You are temporarily suspended for a few hours."
                  );
                }
              }}
              className={`w-full p-2 rounded mt-auto flex items-center justify-center font-medium text-lg tracking-wider transition-all ${
                elem.active
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-400 text-gray-500 cursor-not-allowed"
              }`}
            >
              Join
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
