import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/Dashboard";
import InternListPage from "./features/interns/InternsListPage";
import TasksPage from "./features/tasks/TaskPage";
import ProjectsPage from "./features/projects/ProjectsPage";
import TasksListPage from "./features/tasks/TasksListPage";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./features/auth/login";
import RegisterPage from "./features/auth/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<InternListPage />} />
          <Route path="interns/:id/tasks" element={<TasksPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="tasks" element={<TasksListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
