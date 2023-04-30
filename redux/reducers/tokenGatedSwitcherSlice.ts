import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TokenGatedSwitcherState {
  value: string;
}

const initialTokenGatedSwitcherState: TokenGatedSwitcherState = {
  value: "drops",
};

export const tokenGatedSwitcherSlice = createSlice({
  name: "tokenGatedSwitcher",
  initialState: initialTokenGatedSwitcherState,
  reducers: {
    setTokenGatedSwitcher: (state: TokenGatedSwitcherState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setTokenGatedSwitcher } = tokenGatedSwitcherSlice.actions;

export default tokenGatedSwitcherSlice.reducer;
