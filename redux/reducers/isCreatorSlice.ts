import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IsCreatorState {
  value: boolean;
}

const initialIsCreatorState: IsCreatorState = {
  value: false,
};

export const isCreatorSlice = createSlice({
  name: "isCreator",
  initialState: initialIsCreatorState,
  reducers: {
    setIsCreator: (
      state: IsCreatorState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setIsCreator } = isCreatorSlice.actions;

export default isCreatorSlice.reducer;
