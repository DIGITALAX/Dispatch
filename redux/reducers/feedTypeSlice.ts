import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FeedTypeState {
  value: string;
  index: number;
}

const initialFeedTypeState: FeedTypeState = {
  value: "",
  index: 0,
};

export const feedTypeSlice = createSlice({
  name: "feedType",
  initialState: initialFeedTypeState,
  reducers: {
    setFeedType: (
      state: FeedTypeState,
      { payload: { actionValue, actionIndex } }
    ) => {
      state.value = actionValue;
      state.index = actionIndex;
    },
  },
});

export const { setFeedType } = feedTypeSlice.actions;

export default feedTypeSlice.reducer;
