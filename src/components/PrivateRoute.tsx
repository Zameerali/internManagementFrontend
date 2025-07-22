import { Navigate } from "react-router-dom";
import { useCheckAuthQuery } from "../features/auth/authApi";
import { CircularProgress } from "@mui/material";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
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

  if (isError || (data && !data.isAuthenticated)) {
    console.error("PrivateRoute auth error:", error);
    return <Navigate to="/login" replace />;
  }

  return children;
}
