import { Publication } from "@/components/Home/types/lens.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TimelinesState {
  value: Publication[];
}

const initialTimelinesState: TimelinesState = {
  value: [],
};

export const timelinesSlice = createSlice({
  name: "timelines",
  initialState: initialTimelinesState,
  reducers: {
    setTimelinesRedux: (
      state: TimelinesState,
      action: PayloadAction<Publication[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setTimelinesRedux } = timelinesSlice.actions;

export default timelinesSlice.reducer;
