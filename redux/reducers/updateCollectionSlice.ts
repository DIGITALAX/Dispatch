import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UpdateCollectionState {
  open: boolean;
}

const initialUpdateCollectionState: UpdateCollectionState = {
  open: false,
};

export const updateCollectionSlice = createSlice({
  name: "updateCollection",
  initialState: initialUpdateCollectionState,
  reducers: {
    setUpdateCollection: (
      state: UpdateCollectionState,
      action: PayloadAction<boolean>
    ) => {
      state.open = action.payload;
    },
  },
});

export const { setUpdateCollection } = updateCollectionSlice.actions;

export default updateCollectionSlice.reducer;
