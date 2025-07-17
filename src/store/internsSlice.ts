import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Intern } from "../types/intern";

interface InternsState {
  interns: Intern[];
}

const initialState: InternsState = {
  interns: [],
};

const internsSlice = createSlice({
  name: "interns",
  initialState,
  reducers: {
    setInterns(state: InternsState, action: PayloadAction<Intern[]>) {
      state.interns = action.payload;
    },
    addIntern(state: InternsState, action: PayloadAction<Intern>) {
      state.interns.unshift(action.payload);
    },
  },
});

export const { setInterns, addIntern } = internsSlice.actions;
export default internsSlice.reducer;
