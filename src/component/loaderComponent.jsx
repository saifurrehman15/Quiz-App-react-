import React from "react";

function LoaderPage() {
  return (
    <div className="card flex flex-col gap-10">
      <div className="loader">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
      <h1 className="loader-text text-white text-3xl font-bold">QuizAce</h1>
    </div>
  );
}

export default LoaderPage;
