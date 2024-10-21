import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RoutesProviderFunc from "./Routes/routesFile";
import UserContextProvider from "./context/userContext";
import { BrowserRouter } from "react-router-dom";
import CoursesProvider from "./context/courses";
import SubjectProvider from "./context/subjectContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvider>
      <SubjectProvider>
        <CoursesProvider>
          <RoutesProviderFunc />
        </CoursesProvider>
      </SubjectProvider>
    </UserContextProvider>
  </BrowserRouter>
);
