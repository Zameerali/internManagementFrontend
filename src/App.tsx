import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from "./app/store";
import type { RootState } from "./app/store";
import DashboardLayout from "./components/Dashboard";
import InternDashboardLayout from "./components/InternDashboard"; 
import InternListPage from "./features/interns/InternsListPage";
import TasksPage from "./features/tasks/TaskPage";
import ProjectsPage from "./features/projects/ProjectsPage";
import TasksListPage from "./features/tasks/TasksListPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import LoginPage from "./features/auth/Login";
import RegisterPage from "./features/auth/RegisterPage";
import CustomSnackbar from "./components/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import { hideSnackbar } from "./features/auth/authSlice";
import Profile from "./features/auth/UserProfile";
import InternTaskPage from "./features/tasks/InternTaskPage";
import { useCheckAuthQuery } from "./features/auth/authApi";
import { CircularProgress } from "@mui/material";

const GlobalSnackbar: React.FC = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(
    (state: RootState) => state.auth.snackbar
  );

  const handleClose = () => {
    dispatch(hideSnackbar());
  };

  return (
    <CustomSnackbar
      open={open}
      onClose={handleClose}
      message={message}
      severity={severity}
      autoHideDuration={6000}
    />
  );
};

function RoleRedirect() {
  const { data, isLoading } = useCheckAuthQuery();

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <CircularProgress />
      </div>
    );
  }

  if (data?.role === "admin") return <Navigate to="/" replace />;
  if (data?.role === "intern") return <Navigate to="/intern/tasks" replace />;
  return <Navigate to="/login" replace />;
}

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<InternListPage />} />
            <Route path="interns/:id/tasks" element={<TasksPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="tasks" element={<TasksListPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route
            path="/intern/*"
            element={
              <PrivateRoute allowedRoles={["intern"]}>
                <InternDashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/intern/tasks" replace />} />
            <Route path="tasks" element={<InternTaskPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route
            path="/"
            element={
              <PrivateRoute>
                <RoleRedirect />
              </PrivateRoute>
            }
          />
        </Routes>
        <GlobalSnackbar />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
