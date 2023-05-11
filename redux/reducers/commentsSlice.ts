import { Publication } from "@/components/Home/types/lens.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CommentsState {
  value: Publication[];
}

const initialCommentsState: CommentsState = {
  value: [],
};

export const commentsSlice = createSlice({
  name: "comments",
  initialState: initialCommentsState,
  reducers: {
    setCommentsRedux: (
      state: CommentsState,
      action: PayloadAction<Publication[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCommentsRedux } = commentsSlice.actions;

export default commentsSlice.reducer;
