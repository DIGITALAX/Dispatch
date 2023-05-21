import { Collection } from "@/components/Common/Collections/types/collections.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DecryptCollectionsAllState {
  value: Collection[];
}

const initialDecryptCollectionsAllState: DecryptCollectionsAllState = {
  value: [],
};

export const decryptCollectionsAllSlice = createSlice({
  name: "decryptCollectionsAll",
  initialState: initialDecryptCollectionsAllState,
  reducers: {
    setDecryptCollectionsAllRedux: (
      state: DecryptCollectionsAllState,
      action: PayloadAction<any[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setDecryptCollectionsAllRedux } =
  decryptCollectionsAllSlice.actions;

export default decryptCollectionsAllSlice.reducer;
