import { Navigate } from "react-router-dom";
import { useCheckAuthQuery } from "../features/auth/authApi";
import { CircularProgress, Box } from "@mui/material";
import { memo } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute = memo(function PrivateRoute({
  children,
  allowedRoles,
}: PrivateRouteProps) {
  const { data, isLoading, isError } = useCheckAuthQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!data?.role || !allowedRoles.includes(data.role))) {
    if (data?.role === "admin") return <Navigate to="/" replace />;
    if (data?.role === "intern") return <Navigate to="/intern/tasks" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
});

export default PrivateRoute;
