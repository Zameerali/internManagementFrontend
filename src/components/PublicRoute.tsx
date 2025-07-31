import { Navigate } from "react-router-dom";
import { useCheckAuthQuery } from "../features/auth/authApi";
import { CircularProgress, Box } from "@mui/material";
import { memo } from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = memo(function PublicRoute({ children }: PublicRouteProps) {
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

  if (isError || (data && !data.isAuthenticated)) {
    return <>{children}</>;
  }

  return <Navigate to="/" replace />;
});

export default PublicRoute;
