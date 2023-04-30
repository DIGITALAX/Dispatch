import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DropSwitcherState {
  value: string;
}

const initialDropSwitcherState: DropSwitcherState = {
  value: "drops",
};

export const dropSwitcherSlice = createSlice({
  name: "dropSwitcher",
  initialState: initialDropSwitcherState,
  reducers: {
    setDropSwitcher: (state: DropSwitcherState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setDropSwitcher } = dropSwitcherSlice.actions;

export default dropSwitcherSlice.reducer;
