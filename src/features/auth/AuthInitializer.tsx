// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useCheckAuthQuery } from "./authApi";
// import { setAuthenticated, logout } from "./authSlice";

// function AuthInitializer({ children }) {
//   const dispatch = useDispatch();
//   const { data, isLoading, isError, error } = useCheckAuthQuery(undefined, {
//     refetchOnMountOrArgChange: true, // Force refetch on mount
//   });

//   useEffect(() => {
//     console.log("AuthInitializer state:", { isLoading, isError, data, error });
//     if (!isLoading && !isError && data) {
//       console.log("CheckAuth result:", data);
//       if (data.isAuthenticated) {
//         dispatch(setAuthenticated());
//       } else {
//         dispatch(logout());
//       }
//     } else if (isError) {
//       console.error("CheckAuth error:", error);
//       dispatch(logout());
//     }
//   }, [data, isLoading, isError, error, dispatch]);

//   if (isLoading) {
//     return <div>Loading authentication state...</div>; // Customize (e.g., Material-UI CircularProgress)
//   }

//   return children;
// }

// export default AuthInitializer;
