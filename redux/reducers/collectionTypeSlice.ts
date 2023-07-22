import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CollectionTypeSwitcherState {
  value: string;
}

const initialCollectionTypeSwitcherState: CollectionTypeSwitcherState = {
  value: "choice",
};

export const collectionTypeSwitcherSlice = createSlice({
  name: "collectionTypeSwitcher",
  initialState: initialCollectionTypeSwitcherState,
  reducers: {
    setCollectionTypeSwitcher: (state: CollectionTypeSwitcherState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setCollectionTypeSwitcher } = collectionTypeSwitcherSlice.actions;

export default collectionTypeSwitcherSlice.reducer;
