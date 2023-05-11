import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface OpenCommentState {
  value: string;
}

const initialOpenCommentState: OpenCommentState = {
  value: "",
};

export const openCommentSlice = createSlice({
  name: "openComment",
  initialState: initialOpenCommentState,
  reducers: {
    setOpenComment: (state: OpenCommentState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});
export const { setOpenComment } = openCommentSlice.actions;

export default openCommentSlice.reducer;
