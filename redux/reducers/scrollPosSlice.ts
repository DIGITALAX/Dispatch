import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ScrollPosState {
  feed: number;
  timeline: number;
}

const initialScrollPosState: ScrollPosState = {
  feed: 0,
  timeline: 0,
};

export const scrollPosSlice = createSlice({
  name: "scrollPos",
  initialState: initialScrollPosState,
  reducers: {
    setScrollPosRedux: (
      state: ScrollPosState,
      { payload: { actionFeed, actionTimeline } }
    ) => {
      state.feed = actionFeed;
      state.timeline = actionTimeline;
    },
  },
});

export const { setScrollPosRedux } = scrollPosSlice.actions;

export default scrollPosSlice.reducer;
