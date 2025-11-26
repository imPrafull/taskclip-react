import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SignIn } from "./screens/SignIn";
import { SignUp } from "./screens/SignUp";
import { TaskDashboard } from "./screens/TaskDashboard";
import { TaskDetailWrapper } from "./components/tasks/TaskDetailWrapper";
import { TaskFormWrapper } from "./components/tasks/TaskFormWrapper";

export const App = () => {
    return (
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
                path="/tasks"
                element={
                    <ProtectedRoute>
                        <TaskDashboard />
                    </ProtectedRoute>
                }
            >
                <Route path="new" element={<TaskFormWrapper mode="create" />} />
                <Route path=":id" element={<TaskDetailWrapper />} />
                <Route path="edit/:id" element={<TaskFormWrapper mode="edit" />} />
            </Route>
        </Routes>
    );
};
