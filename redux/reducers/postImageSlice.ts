import { UploadedMedia } from "@/components/Common/TokenGated/types/allPosts.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PostImagesState {
  value: UploadedMedia[];
}

const initialPostImagesState: PostImagesState = {
  value: [],
};

export const postImagesSlice = createSlice({
  name: "postImages",
  initialState: initialPostImagesState,
  reducers: {
    setPostImages: (state: PostImagesState, action: PayloadAction<UploadedMedia[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setPostImages } = postImagesSlice.actions;

export default postImagesSlice.reducer;
