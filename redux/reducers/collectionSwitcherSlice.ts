import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CollectionSwitcherState {
  value: string;
}

const initialCollectionSwitcherState: CollectionSwitcherState = {
  value: "drops",
};

export const collectionSwitcherSlice = createSlice({
  name: "collectionSwitcher",
  initialState: initialCollectionSwitcherState,
  reducers: {
    setCollectionSwitcher: (state: CollectionSwitcherState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setCollectionSwitcher } = collectionSwitcherSlice.actions;

export default collectionSwitcherSlice.reducer;
