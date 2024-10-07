import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../context/userContext"; // Import userContext
import LayoutFunc from "../component/layout";
import SignInForm from "../pages/signinpage";
import App from "../../src/App";
import SubjectSelect from "../pages/subjects";
import KeyEnterPage from "../pages/quizKey";
import QuizPage from "../pages/exampage";
import ResultPage from "../pages/result";
import QuickResult from "../pages/quickresultpage";

function RoutesProviderFunc() {
  const user = useContext(userContext); // Fetching user state from context
  const { isLogin } = user;
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  console.log(logged);

  return (
    <Routes>
      {/* Auth Route */}
      <Route
        path="auth"
        element={isLogin || logged ? <Navigate to={"/"} /> : <Outlet />}
      >
        <Route path="signup" element={<SignInForm />} />
      </Route>

      {/* Main Route - Protected */}
      <Route
        path="/"
        element={
          isLogin || logged ? <LayoutFunc /> : <Navigate to="/auth/signup" />
        }
      >
        {/* This nested route will render inside LayoutFunc */}
        <Route index element={<App />} />
        <Route path="/subject/:course/:id" element={<SubjectSelect />} />
        <Route
          path="/quiz/:nameQuiz/:key/:courseName/:time/:id"
          element={<KeyEnterPage />}
        />
        <Route
          path="/quizpage/:quizSelected/:courseName/:time/:id"
          element={<QuizPage />}
        />
        <Route path="/result/:id" element={<ResultPage />} />
        <Route
          path="/quickresult/:nameQuiz/:courseName/:totalQuestions/:correctAns/:score/:id"
          element={<QuickResult />}
        />
      </Route>
      {/* /result/:nameQuiz/:courseName/:totalQuestions/:correctAns/:id */}
    </Routes>
  );
}

export default RoutesProviderFunc;
