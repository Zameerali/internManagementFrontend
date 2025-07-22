import { Navigate } from "react-router-dom";
import { useCheckAuthQuery } from "../features/auth/authApi";

export default function PublicRoute({ children } : { children: React.ReactNode }) {
  const { data, isLoading, isError, error } = useCheckAuthQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  console.log("PublicRoute state:", { isLoading, isError, data, error });

  if (isLoading) {
    return <div>Loading authentication state...</div>; // Customize (e.g., <CircularProgress />)
  }

  if (isError || (data && !data.isAuthenticated)) {
    return children; // Render LoginPage or RegisterPage
  }

  console.log("PublicRoute: User is authenticated, redirecting to /");
  return <Navigate to="/" replace />;
}
