import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AutographHandleState {
  value: string | undefined;
}

const initialAutographHandleState: AutographHandleState = {
  value: undefined,
};

export const autographHandleSlice = createSlice({
  name: "autographHandle",
  initialState: initialAutographHandleState,
  reducers: {
    setAutographHandle: (
      state: AutographHandleState,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setAutographHandle } = autographHandleSlice.actions;

export default autographHandleSlice.reducer;
