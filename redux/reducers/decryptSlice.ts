import { Collection } from "@/components/Common/Collections/types/collections.types";
import { createSlice } from "@reduxjs/toolkit";

export interface DecryptState {
  open: boolean;
  collections: Collection[];
}

const initialDecryptState: DecryptState = {
  open: false,
  collections: [],
};

export const decryptSlice = createSlice({
  name: "decrypt",
  initialState: initialDecryptState,
  reducers: {
    setDecrypt: (
      state: DecryptState,
      { payload: { actionOpen, actionCollections } }
    ) => {
      state.open = actionOpen;
      state.collections = actionCollections;
    },
  },
});

export const { setDecrypt } = decryptSlice.actions;

export default decryptSlice.reducer;
