import { createSlice } from "@reduxjs/toolkit";

export interface UpgradeState {
  open: boolean;
}

const initialUpgradeState: UpgradeState = {
  open: false,
};

export const upgradeSlice = createSlice({
  name: "upgrade",
  initialState: initialUpgradeState,
  reducers: {
    setUpgrade: (state: UpgradeState, { payload: { actionOpen } }) => {
      state.open = actionOpen;
    },
  },
});

export const { setUpgrade } = upgradeSlice.actions;

export default upgradeSlice.reducer;
