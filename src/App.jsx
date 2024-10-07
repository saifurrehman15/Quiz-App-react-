import { useContext, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { userContext } from "./context/userContext";
import { Link } from "react-router-dom";
import { message } from "antd";
import "aos/dist/aos.css";
function App() {
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
      <div className="text-white sm:ms-10">
        <h1 className="text-2xl sm:text-3xl mb-2 font-bold">Hi, {displayName}</h1>
        <p>
          Welcome to the quiz portal. Select your course below to take a quiz.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-[50px] justify-center">
        {arr.map((elem, ind) => (
          <div
            className=" h-[280px] w-[300px] mb-2 p-5 bg-white shadow-lg border border-gray-200 rounded-2xl transition-all transform hover:scale-105 hover:rotate-1  hover:shadow-lg flex flex-col justify-between items-center text-center"
            key={ind}
          >
            <h3 className="text-2xl flex flex-col items-center gap-2 font-bold text-gray-700 ">
              <img
                src={elem.image}
                alt=""
                height={"50px"}
                width={"50px"}
                className="bg-gray-900 p-2 rounded-full"
              />
              {elem.course}
            </h3>
            <h6>{elem.totalSubjects} subjects</h6>
            <Link
              to={elem.active ? `/subject/${elem.course}/${id}` : ""}
              onClick={() => {
                elem.active
                  ? `/subject/${elem.course}/${id}`
                  : message.warning(
                      "This quiz is not available at the moment."
                    );
              }}
              className={`w-full p-1 rounded mt-4 flex no-underline items-center justify-center gap-2 font-medium text-lg tracking-wider transition-all ${
                elem.active
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
