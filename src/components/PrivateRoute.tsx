import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useCheckAuthQuery } from "../features/auth/authApi";
import type { RootState } from "../app/store";
import type React from "react";
import { CircularProgress } from "@mui/material";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const { data, isLoading, isError, error } = useCheckAuthQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  console.log("PrivateRoute state:", {
    isLoading,
    isError,
    data,
    error,
    isAuthenticated,
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError || (data && !data?.isAuthenticated)) {
    console.error("PrivateRoute auth error:", error);
    return <Navigate to="/login" replace />;
  }

  return data?.isAuthenticated ? children : <Navigate to="/login" replace />;
}
