import { Sales } from "@/components/Common/Sales/types/sales.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SalesState {
  value: Sales[];
}

const initialSalesState: SalesState = {
  value: [],
};

export const salesSlice = createSlice({
  name: "sales",
  initialState: initialSalesState,
  reducers: {
    setSalesRedux: (state: SalesState, action: PayloadAction<Sales[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setSalesRedux } = salesSlice.actions;

export default salesSlice.reducer;
