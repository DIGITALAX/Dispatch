import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface LookAroundState {
  value: boolean;
}

const initialLookAroundState: LookAroundState = {
  value: false,
};

export const lookAroundSlice = createSlice({
  name: "lookAround",
  initialState: initialLookAroundState,
  reducers: {
    setLookAround: (state: LookAroundState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});
export const { setLookAround } = lookAroundSlice.actions;

export default lookAroundSlice.reducer;
