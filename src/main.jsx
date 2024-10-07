import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RoutesProviderFunc from "./Routes/routesFile";
import UserContextProvider from "./context/userContext";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
    <UserContextProvider>
      <RoutesProviderFunc />
    </UserContextProvider>
    </BrowserRouter>
);
