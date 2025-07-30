import { Navigate } from "react-router-dom";
import { useCheckAuthQuery } from "../features/auth/authApi";
import { CircularProgress } from "@mui/material";

export default function PrivateRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { data, isLoading, isError, error } = useCheckAuthQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  console.log("PrivateRoute state:", { isLoading, isError, data, error });

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  if (isError || !data?.isAuthenticated) {
    console.error("PrivateRoute auth error:", error);
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!data?.role || !allowedRoles.includes(data.role))) {
    if (data?.role === "admin") return <Navigate to="/" replace />;
    if (data?.role === "intern") return <Navigate to="/intern/tasks" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}
