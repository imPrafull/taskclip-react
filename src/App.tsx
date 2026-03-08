import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Welcome } from "./screens/Welcome";
import { SignIn } from "./screens/SignIn";
import { SignUp } from "./screens/SignUp";
import { TaskDashboard } from "./screens/TaskDashboard";
import { ListManagement } from "./screens/ListManagement";
import { TaskDetailWrapper } from "./components/tasks/TaskDetailWrapper";
import { TaskFormWrapper } from "./components/tasks/TaskFormWrapper";

export const App = () => {
    return (
        <>
            <Toaster position="bottom-right" richColors />
            <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/sign-in" element={<SignIn />} />
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
            <Route
                path="/lists/manage"
                element={
                    <ProtectedRoute>
                        <ListManagement />
                    </ProtectedRoute>
                }
            />
            </Routes>
        </>
    );
};
