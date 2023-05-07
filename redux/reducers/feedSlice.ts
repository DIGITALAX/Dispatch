import { Publication } from "@/components/Home/types/lens.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FeedsState {
  value: Publication[];
}

const initialFeedsState: FeedsState = {
  value: [],
};

export const feedsSlice = createSlice({
  name: "feeds",
  initialState: initialFeedsState,
  reducers: {
    setFeedsRedux: (
      state: FeedsState,
      action: PayloadAction<Publication[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setFeedsRedux } = feedsSlice.actions;

export default feedsSlice.reducer;
