import { Publication } from "@/components/Home/types/lens.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FeedSwitchState {
  value: boolean;
}

const initialFeedSwitchState: FeedSwitchState = {
  value: true,
};

export const feedSwitchSlice = createSlice({
  name: "feedSwitch",
  initialState: initialFeedSwitchState,
  reducers: {
    setFeedSwitchRedux: (
      state: FeedSwitchState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setFeedSwitchRedux } = feedSwitchSlice.actions;

export default feedSwitchSlice.reducer;
