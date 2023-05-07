import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LastFeedIndexState {
  value: boolean[];
}

const initialLastFeedIndexState: LastFeedIndexState = {
  value: [],
};

export const lastFeedIndexSlice = createSlice({
  name: "lastFeedIndex",
  initialState: initialLastFeedIndexState,
  reducers: {
    setLastFeedIndex: (state: LastFeedIndexState, action: PayloadAction<boolean[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setLastFeedIndex } = lastFeedIndexSlice.actions;

export default lastFeedIndexSlice.reducer;
