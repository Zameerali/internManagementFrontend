import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

interface AuthState {
  isAuthenticated: boolean;
  snackbar: SnackbarState;
}

const initialState: AuthState = {
  isAuthenticated: false,
  snackbar: { open: false, message: "", severity: "info" },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
    showSnackbar(
      state,
      action: PayloadAction<{
        message: string;
        severity: SnackbarState["severity"];
      }>
    ) {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
      };
    },
    hideSnackbar(state) {
      state.snackbar.open = false;
    },
  },
});

export const { setAuthenticated, logout, showSnackbar, hideSnackbar } =
  authSlice.actions;
export default authSlice.reducer;
