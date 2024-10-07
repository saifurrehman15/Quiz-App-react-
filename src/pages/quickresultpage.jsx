import { Link, useNavigate, useParams } from "react-router-dom";

function QuickResult() {
  const { nameQuiz, courseName, id, totalQuestions, correctAns, score } =
    useParams();
  console.log(nameQuiz, courseName, id, totalQuestions, correctAns, score);
  const percentage = (score * 100) / totalQuestions;
  const remarks =
    percentage >= 70 ? "Congratulations, you passed" : "Better Luck next time!";
  const borderColor = percentage >= 70 ? "text-green-500" : "text-red-500";
  return (
    <div className="pt-20 text-white">
      <h1>{nameQuiz}</h1>
      <div className="bg-white text-gray-900  sm:w-1/2 p-3 px-5 rounded text-center mx-auto sm:mt-10">
        <div className="mb-2">
          <h3 className={borderColor}>{remarks}</h3>
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
            <span className="text-lg font-bold">{percentage.toFixed(0)}%</span>
          </div>
        </div>

        <div className="flex justify-between font-bold border-b">
          <p>Total Questions</p>
          <p>{totalQuestions}</p>
        </div>
        <div className="flex justify-between font-bold border-b">
          <p>Correct Questions</p>
          <p>{correctAns}</p>
        </div>
        <div className="mt-4 mb-2">
          <Link
            to={"/"}
            className="bg-blue-400 text-white py-2 px-4 font-bold rounded no-underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default QuickResult;
