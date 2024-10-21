import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { message } from "antd";
function KeyEnterPage() {
  const { nameQuiz, courseName, key, time, id, active } = useParams();
  const [keyCheck, setCheck] = useState("");
  const activeVal = active === "true";
  console.log(activeVal);

  return (
    <div>
      <h3 className="text-white text-sm font-bold  sm:text-2xl">
        {nameQuiz} ({courseName})
      </h3>
      <div className="divider mt-2"></div>
      <div className="mt-10">
        <input
          type="text"
          name=""
          id=""
          placeholder="Enter test key"
          className="border-1 h-12 rounded-md outline-none focus:outline-blue-400 border-gray-400 w-full p-2"
          onChange={(e) => {
            setCheck(e.target.value);
          }}
        />
      </div>
      <div className="mt-4">
        {keyCheck !== "" ? (
          <Link
            to={
              keyCheck === key && activeVal
                ? `/test/quizpage/${nameQuiz}/${courseName}/${time}/${id}`
                : "#"
            }
            className="bg-blue-600 text-white p-2 px-5 float-end no-underline"
            onClick={() => {
              if (activeVal) {
                if (keyCheck !== key) {
                  message.error("Invalid key,Please enter correct key!");
                }
              } else {
                message.error("This quiz is not added!");
              }
            }}
          >
            Start Exam
          </Link>
        ) : (
          <span className="bg-blue-600 cursor-pointer text-white p-2 px-5 float-end  opacity-50">
            Start Exam
          </span>
        )}
      </div>
    </div>
  );
}
export default KeyEnterPage;
