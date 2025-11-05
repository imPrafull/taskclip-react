import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignIn } from "./screens/SignIn";
import { SignUp } from "./screens/SignUp";
import { TaskDashboard } from "./screens/TaskDashboard";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/tasks" element={<TaskDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
