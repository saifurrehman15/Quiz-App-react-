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
import { message, Modal } from "antd";

function QuizPage() {
  const { quizSelected, id, courseName, time } = useParams();
  const quizTime = Number(time.split(" ")[0]);

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cheated = JSON.parse(localStorage.getItem("ifCheat")) || [];
  const [isOffline, setIsOffline] = useState(false); // State for tracking offline status

  useEffect(() => {
    getData();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Event listeners for online/offline detection
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [quizSelected]);

  useEffect(() => {
    if (count === data.length - 1) {
      setBtnText("Submit");
      setIsLastQuestion(true);
    }
  }, [count, data.length]);

  useEffect(() => {
    enterFullScreen();

    const onFullScreenChange = () => {
      if (!document.fullscreenElement) {
        localStorage.setItem(
          "ifCheat",
          JSON.stringify({ cheat: true, timeSuspend: new Date() })
        );
        window.location.replace("/");
      }
    };

    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange);
    };
  }, []);

  const handleVisibilityChange = () => {
    if (document.hidden) {
      localStorage.setItem(
        "ifCheat",
        JSON.stringify({ cheat: true, timeSuspend: new Date() })
      );
      window.location.replace("/");
    }
  };

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  // Handle user going offline
  const handleOffline = () => {
    setIsOffline(true);
    message.error("You are offline. Please reconnect to continue the quiz.");
  };

  // Handle user coming back online
  const handleOnline = () => {
    setIsOffline(false);
    message.success("You are back online.");
  };

  // Prevent cheating by reloading or navigating away
  window.onload = () => {
    localStorage.setItem(
      "ifCheat",
      JSON.stringify({ cheat: true, timeSuspend: new Date() })
    );
  };

  const answerCheck = async () => {
    if (isOffline) {
      message.error("You cannot submit answers while offline.");
      return;
    }

    let updatedScore = score;

    if (data[count]?.quiz.answer === checked) {
      updatedScore += 1;
      setScore(updatedScore);
    }

    setOptionsSelected(false);

    if (count < data.length - 1) {
      setCount(count + 1);
      setChecked("");
      setDisOpt(false);
      setColor("");
    } else {
      const resultObj = {
        date: new Date(),
        course: courseName,
        subject: quizSelected,
        scores: (updatedScore * 100) / totalQuestions,
      };

      setRes(true);
      const userDocRef = doc(db, "users", id);
      await updateDoc(userDocRef, {
        result: arrayUnion(resultObj),
      });
      setRes(false);

      window.location.replace(
        `/quickresult/${quizSelected}/${courseName}/${data.length}/2/${updatedScore}/${id}`
      );
    }
  };

  const answerDetect = (e) => {
    let isCorrect = data[count]?.quiz.answer === e;
    setColor(isCorrect ? "bg-green-400" : "bg-red-400");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getData = async () => {
    setLoading(true);
    try {
      if (cheated.cheat) {
        message.error(
          "Cheating detected! You are not allowed to take the test."
        );
        setTimeout(() => {
          window.location.replace("/");
        }, 1500);
      }

     if (!cheated.cheat) {
      const q = collection(db, quizSelected);
      const querySnapshot = await getDocs(q);
      const docsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        quiz: doc.data(),
      }));
      setData(docsArray);
     }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-gray-800">
      {isModalOpen && (
        <Modal
          title="Answer Explanation"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>{data[count]?.quiz?.description}</p>
        </Modal>
      )}

      {loading ? (
        <p className="text-xl">Loading...</p>
      ) : isOffline ? (
        <p className="text-xl text-red-500">
          You are offline. Please reconnect to continue.
        </p>
      ) : (
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">{`Question ${
            count + 1
          }/${totalQuestions}`}</h2>
          <div className="flex justify-between">
            <p className="mb-4 text-lg">{data[count]?.quiz.question}</p>
            {optColor === "bg-red-400" && (
              <button
                className="bg-blue-500 px-4 h-8 text-white"
                onClick={showModal}
              >
                Answer
              </button>
            )}
          </div>
          <div className="space-y-2">
            {data[count]?.quiz.options.map((elem, ind) => (
              <label
                htmlFor={`option${ind}`}
                className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-800 ${
                  `option${ind}` === optTrigger ? optColor : ""
                }`}
                key={ind}
              >
                <input
                  type="radio"
                  hidden
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
            className={`mt-4 p-2 px-8 float-end rounded-md ${
              optionsSelected
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300"
            } text-white`}
            disabled={!optionsSelected}
            onClick={answerCheck}
          >
            {btnText}
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
