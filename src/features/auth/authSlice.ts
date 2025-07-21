import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  // token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  // token: localStorage.getItem("token"),
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // setToken(state, action: PayloadAction<string>) {
    //   state.token = action.payload;
    //   localStorage.setItem("token", action.payload);
    // },
    // logout(state) {
    //   state.token = null;
    //   localStorage.removeItem("token");
    // },
    setAuthenticated(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;
