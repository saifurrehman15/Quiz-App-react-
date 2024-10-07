import { Link, useParams } from "react-router-dom";
import React from "react";
import { CaretRightOutlined, StarFilled } from "@ant-design/icons";
import { Collapse, theme } from "antd";

function SubjectSelect() {
  const { course, id } = useParams();
  const splitted = course.split(" ").join("");

  const subjects = {
    WebandAppDevelopment: [
      {
        subject: "Html 5",
        key: "html12@",
        quizes: [
          {
            quizName: "Html Quiz",
            totalTime: "30 mins",
            passingMarks: 70,
          },
        ],
      },
      {
        subject: "Css 3",
        key: "css12@",
        quizes: [
          {
            quizName: "Css Quiz",
            totalTime: "30 mins",
            passingMarks: 70,
          },
        ],
      },
      {
        subject: "Javascript",
        key: "js12@",
        quizes: [
          {
            quizName: "Javascript Quiz 1",
            totalTime: "40 mins",
            passingMarks: 70,
          },
          {
            quizName: "Javascript Quiz 2",
            totalTime: "40 mins",
            passingMarks: 70,
          },
          {
            quizName: "Javascript Quiz 3",
            totalTime: "60 mins",
            passingMarks: 70,
          },
          {
            quizName: "Javascript Quiz 4",
            totalTime: "60 mins",
            passingMarks: 70,
          },
          {
            quizName: "Javascript (Advanced)",
            totalTime: "60 mins",
            passingMarks: 70,
          },
        ],
      },
      {
        subject: "React Js",
        key: "react12@",
        quizes: [
          {
            quizName: "React Quiz",
            totalTime: "30 mins",
            passingMarks: 70,
          },
        ],
      },
    ],
    Typescript: [
      {
        subject: "Enums",
        key: "html12@",
        quizes: [
          {
            quizName: "Html Quiz",
            totalTime: "30 mins",
            passingMarks: 70,
          },
        ],
      },
      {
        subject: "Data Types",
        key: "css12@",
        quizes: [
          {
            quizName: "Css Quiz",
            totalTime: "30 mins",
            passingMarks: 70,
          },
        ],
      },
      {
        subject: "Objects",
        key: "js12@",
        quizes: [
          {
            quizName: "Javascript Quiz 1",
            totalTime: "40 mins",
            passingMarks: 70,
          },
        ],
      },
      {
        subject: "Functions",
        key: "react12@",
        quizes: [
          {
            quizName: "React Quiz",
            totalTime: "30 mins",
            passingMarks: 70,
          },
        ],
      },
    ],
  };

  const { token } = theme.useToken();

  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: "10px",
    border: "1px solid #e0e0e0",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "16px",
  };

  const quizPanelStyle = {
    marginBottom: 12,
    background: "#f0f5ff",
    borderRadius: "8px",
    border: "1px solid #d9e1ff",
    padding: "12px",
  };

  const buttonStyle = {
    backgroundColor: "#FF7F50", // Secondary color
    padding: "8px 25px",
    color: "white",
    borderRadius: "6px",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    margin: "10px 25px",
    transition: "background-color 0.3s",
    position:"relative",
    top:"10px"
  };

  // Create a nested Collapse for each subject's quizzes
  let getItems = subjects[splitted].map((subject) => {
    return {
      key: subject.key,
      label: (
        <strong style={{ fontSize: "18px", color: "#4A90E2" }}>
          {subject.subject}
        </strong>
      ), // Primary color
      children: (
        <>
          <Collapse
            bordered={false}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined
                rotate={isActive ? 90 : 0}
                style={{ color: "#4A90E2" }}
              /> // Primary color
            )}
            style={{
              background: token.colorBgContainer,
              marginTop: "10px",
            }}
          >
            {subject.quizes.map((quiz, index) => (
              <Collapse.Panel
                header={
                  <strong style={{ fontSize: "16px", color: "#4A90E2" }}>
                    {quiz.quizName}
                  </strong>
                }
                key={`${subject.key}-${index}`} // unique key for each quiz
                style={quizPanelStyle}
              >
                <h6 style={{ color: "#4A90E2", fontWeight: "bold" }}>
                  <StarFilled
                    style={{ color: "#FFD700", marginRight: "8px" }}
                  />{" "}
                  {/* Gold color for the icon */}
                  Quiz Name: {quiz.quizName}
                </h6>
                <p style={{ margin: "10px 25px", color: "#333" }}>
                  <strong>Passing Marks:</strong> {quiz.passingMarks}
                </p>
                <p style={{ margin: "10px 25px", color: "#333" }}>
                  <strong>Total Time:</strong> {quiz.totalTime}
                </p>
                <Link
                  to={`/quiz/${quiz.quizName}/${subject.key}/${course}/${quiz.totalTime}/${id}`}
                  className="quiz-btn no-underline"
                  
                  style={buttonStyle}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#FF6347")
                  } // Darker shade on hover
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#FF7F50")
                  }
                >
                  Continue
                </Link>
              </Collapse.Panel>
            ))}
          </Collapse>
        </>
      ),
      style: panelStyle,
    };
  });

  return (
    <div className="h-screen ">

      <h1 className="text-yellow-300">Select Quiz</h1>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            rotate={isActive ? 90 : 0}
            style={{ color: "#4A90E2" }}
          /> // Primary color
        )}
        style={{
          background: token.colorBgContainer,
          marginTop: "20px",
        }}
        items={getItems}
      />
    </div>
  );
}

export default SubjectSelect;
