import { createSlice } from "@reduxjs/toolkit";

export interface IndividualFeedCountState {
  like: number;
  mirror: number;
  collect: number;
  comment: number;
  hasLiked: boolean;
  hasMirrored: boolean;
  hasCollected: boolean;
}

const initialIndividualFeedCountState: IndividualFeedCountState = {
  like: 0,
  mirror: 0,
  collect: 0,
  comment: 0,
  hasLiked: false,
  hasMirrored: false,
  hasCollected: false,
};

export const individualFeedCountSlice = createSlice({
  name: "individualFeedCount",
  initialState: initialIndividualFeedCountState,
  reducers: {
    setIndividualFeedCount: (
      state: IndividualFeedCountState,
      {
        payload: {
          actionLike,
          actionMirror,
          actionCollect,
          actionComment,
          actionHasLiked,
          actionHasCollected,
          actionHasMirrored,
        },
      }
    ) => {
      state.like = actionLike;
      state.mirror = actionMirror;
      state.collect = actionCollect;
      state.comment = actionComment;
      state.hasLiked = actionHasLiked;
      state.hasMirrored = actionHasMirrored;
      state.hasCollected = actionHasCollected;
    },
  },
});

export const { setIndividualFeedCount } = individualFeedCountSlice.actions;

export default individualFeedCountSlice.reducer;
