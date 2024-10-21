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
import AdminLayoutFunc from "../component/adminLayout";
import ManageQuizApp from "../pages/manageQuiz";
import CourseManage from "../pages/courses";
import AddSubject from "../pages/subjectsAdd";
import CheatingReport from "../pages/report";
// import AdminPage from "../pages/adminPage";

function RoutesProviderFunc() {
  const user = useContext(userContext); // Fetching user state from context
  const { isLogin } = user;
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  console.log(logged);
  const cheated = JSON.parse(localStorage.getItem("ifCheat")) || [];

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
          path="/quiz/:nameQuiz/:key/:courseName/:time/:id/:active"
          element={<KeyEnterPage />}
        />

        <Route path="/result/:id" element={<ResultPage />} />
        <Route
          path="/quickresult/:nameQuiz/:courseName/:totalQuestions/:score/:id"
          element={<QuickResult />}
        />
        <Route path="*" element={"saif"} />
      </Route>
      {/* /result/:nameQuiz/:courseName/:totalQuestions/:correctAns/:id */}
      <Route path="test" element={<Outlet />}>
        <Route
          path="quizpage/:quizSelected/:courseName/:time/:id"
          element={<QuizPage />}
        />
      </Route>
      <Route path="admin" element={<AdminLayoutFunc />}>
        <Route path="managequiz" element={<ManageQuizApp />} />
        <Route path="courses" element={<CourseManage />} />
        <Route path="addsubject" element={<AddSubject />} />
        <Route path="report" element={<CheatingReport />} />
      </Route>
    </Routes>
  );
}

export default RoutesProviderFunc;
