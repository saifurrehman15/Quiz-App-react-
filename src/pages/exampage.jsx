import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  arrayUnion,
  collection,
  updateDoc,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { message, Modal, Spin } from "antd";
import sound from "../assets/clock-ticking-sound-effect-240503.mp3";
import { set } from "react-hook-form";
import { userContext } from "../context/userContext";
function QuizPage() {
  const { quizSelected, id, courseName, time } = useParams();
  const { users } = useContext(userContext);
  const { displayName } = users;
  const quizTime = Number(time.split(" ")[0]);
  console.log(displayName);

  const [timer, setTimer] = useState(20);
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
  const cheated = JSON.parse(localStorage.getItem("ifCheat")) || {};
  const [isOffline, setIsOffline] = useState(false);
  const [answerChecking, setChecking] = useState(false);
  useEffect(() => {
    getData();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [quizSelected]);

  const reason = async (reasonDetect) => {
    if (submitRes) return;

    const currentCheatData = JSON.parse(localStorage.getItem("ifCheat")) || {};
    const reasons = currentCheatData.reasons || [];

    if (!isLastQuestion && !isOffline) {
      reasons.push(reasonDetect);
      const userDocRef = doc(db, "cheatDetector", id);
      message.error("Cheating detected! You are not allowed to take the test.");

      await setDoc(userDocRef, {
        cheat: true,
        timeSuspend: new Date(),
        reasons: reasons,
        id,
        displayName,
      });
      window.location.replace("/");
    }
  };

  useEffect(() => {
    if (count === data.length - 1) {
      setBtnText("Submit");
      setIsLastQuestion(true);
    }
  }, [count, data.length]);

  useEffect(() => {
    enterFullScreen();

    const onFullScreenChange = () => {
      if (!document.fullscreenElement && !isLastQuestion) {
        reason("Press Escape");
      }
    };

    const onCopy = (e) => {
      e.preventDefault();
      reason("Copy text");
    };

    const onKeyPress = () => {
      reason("Press Key");
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        reason("Change Tab");
      }
    };

    document.addEventListener("copy", onCopy);
    window.addEventListener("keypress", onKeyPress);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", onFullScreenChange);

    return () => {
      document.removeEventListener("copy", onCopy);
      window.removeEventListener("keypress", onKeyPress);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", onFullScreenChange);
    };
  }, [data, count, isOffline]);

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  const handleOffline = () => {
    setIsOffline(true);
    message.error("You are offline. Please reconnect to continue the quiz.");
  };

  const handleOnline = () => {
    setIsOffline(false);
    message.success("You are back online.");
  };

  useEffect(() => {
    let interval;
    if (timer > 0 && !answerChecking) {
      interval = setInterval(() => {
        setTimer((prev) => {
          return prev - 1;
        });
      }, 1000);
    } else if (!answerChecking) {
      handleTimeOut();
    }

    return () => clearInterval(interval);
  }, [timer, answerChecking]);

  const handleTimeOut = () => {
    message.error("Time's up! Moving to the next question.");
    answerCheck();
  };

  const answerCheck = async () => {
    if (isOffline) {
      message.error("You cannot submit answers while offline.");
      return;
    }

    let updatedScore = score;

    if (data[count]?.quiz.answer === checked && timer > 0) {
      updatedScore += 1;
      setScore(updatedScore);
    }

    setOptionsSelected(false);

    if (count < data.length - 1) {
      setCount(count + 1);
      setChecked("");
      setTimer(20);
      setDisOpt(false);
      setColor("");
    } else {
      const resultObj = {
        date: new Date(),
        course: courseName,
        subject: quizSelected,
        scores: (updatedScore * 100) / totalQuestions,
      };

      setIsLastQuestion(true);
      setRes(true);

      try {
        const userDocRef = doc(db, "users", id);
        await updateDoc(userDocRef, {
          result: arrayUnion(resultObj),
        });

        setTimeout(() => {
          window.location.replace(
            `/quickresult/${quizSelected}/${courseName}/${data.length}/${updatedScore}/${id}`
          );
        }, 1000);
      } catch (error) {
        message.error("Failed to submit your result. Please try again.");
        console.error("Error updating document: ", error);
      } finally {
        setRes(false);
      }
    }
  };

  const answerDetect = (e) => {
    let isCorrect = data[count]?.quiz.answer === e;
    setColor(isCorrect ? "bg-green-400" : "bg-red-400");
  };

  const showModal = () => {
    setChecking(true);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setChecking(false);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setChecking(false);
    setIsModalOpen(false);
  };

  const getData = async () => {
    setLoading(true);
    try {
      if (cheated.cheat && !isLastQuestion) {
        message.error(
          "Cheating detected! You are not allowed to take the test."
        );
        window.location.replace("/");
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
      message.error("Error fetching quiz data. Please try again later.");
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
          centered
        >
          <p>{data[count]?.quiz?.description || "No Explanation Available"}</p>
        </Modal>
      )}

      {loading ? (
        <Spin tip="Loading..." className="mt-10" />
      ) : isOffline ? (
        <p className="text-xl text-red-500">
          You are offline. Please reconnect to continue.
        </p>
      ) : (
        <div className="w-[90%] max-w-lg mt-10  mx-10 bg-gray-900 text-white py-8 px-4 rounded-lg shadow-sm shadow-gray-300">
          <h2 className="text-3xl  font-semibold mb-5 font-mono text-center">{`Question ${
            count + 1
          }/${totalQuestions}`}</h2>
          <div className="flex justify-between">
            <p className="mb-6 text-lg font-bold">
              {count + 1 + ") " + data[count]?.quiz.question}
            </p>

            <div className="flex gap-2">
              {optColor === "bg-red-400" && (
                <button
                  className="bg-blue-500 px-4 h-8 text-white rounded-md"
                  onClick={showModal}
                  aria-label="Show answer explanation"
                >
                  Answer
                </button>
              )}
              <span
                className={`text-xl ${timer < 10 && "text-red-500"}`}
              >{`Timer: ${timer}s`}</span>
            </div>
          </div>
          <div className="space-y-3">
            {data[count]?.quiz.options.map((elem, ind) => (
              <label
                htmlFor={`option${ind}`}
                className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-800 ${
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
                  aria-label={`Option ${ind + 1}: ${elem}`}
                />
                <span>{elem}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button
              className={`bg-blue-500 px-4 h-10 text-white rounded-md float-end ${
                !optionsSelected ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={answerCheck}
              disabled={!optionsSelected}
              aria-label="Submit answer"
            >
              {btnText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
