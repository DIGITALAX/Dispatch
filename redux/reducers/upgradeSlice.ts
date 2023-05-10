import { createSlice } from "@reduxjs/toolkit";

export interface UpgradeState {
  upgradedColl: boolean[];
  upgradeDrop: boolean[];
}

const initialUpgradeState: UpgradeState = {
  upgradedColl: [],
  upgradeDrop: [],
};

export const upgradeSlice = createSlice({
  name: "upgrade",
  initialState: initialUpgradeState,
  reducers: {
    setUpgrade: (
      state: UpgradeState,
      { payload: { actionColl, actionDrop } }
    ) => {
      state.upgradedColl = actionColl;
      state.upgradeDrop = actionDrop;
    },
  },
});

export const { setUpgrade } = upgradeSlice.actions;

export default upgradeSlice.reducer;
