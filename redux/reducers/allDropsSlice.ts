import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AllDropsState {
  value: any[];
}

const initialAllDropsState: AllDropsState = {
  value: [],
};

export const allDropsSlice = createSlice({
  name: "allDrops",
  initialState: initialAllDropsState,
  reducers: {
    setAllDropsRedux: (
      state: AllDropsState,
      action: PayloadAction<any[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setAllDropsRedux } = allDropsSlice.actions;

export default allDropsSlice.reducer;
