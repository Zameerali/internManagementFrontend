import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/Dashboard";
import InternListPage from "./pages/InternsListPage";
import TasksPage from "./pages/TaskPage";
import ProjectsPage from "./pages/ProjectsPage";
import TasksListPage from "./pages/TasksListPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
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
