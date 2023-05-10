import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FeedReactIdState {
  value: string;
  type: number;
}

const initialFeedReactIdState: FeedReactIdState = {
  value: "",
  type: 0,
};

export const feedReactIdSlice = createSlice({
  name: "feedReactId",
  initialState: initialFeedReactIdState,
  reducers: {
    setFeedReactId: (
      state: FeedReactIdState,
      { payload: { actionValue, actionType } }
    ) => {
      state.value = actionValue;
      state.type = actionType;
    },
  },
});

export const { setFeedReactId } = feedReactIdSlice.actions;

export default feedReactIdSlice.reducer;
