import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CanEditState {
  value: boolean;
}

const initialCanEditState: CanEditState = {
  value: true,
};

export const canEditSlice = createSlice({
  name: "canEdit",
  initialState: initialCanEditState,
  reducers: {
    setCanEdit: (state: CanEditState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setCanEdit } = canEditSlice.actions;

export default canEditSlice.reducer;
