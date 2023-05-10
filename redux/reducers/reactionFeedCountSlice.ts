import { createSlice } from "@reduxjs/toolkit";

export interface ReactionFeedCountState {
  like: number[];
  mirror: number[];
  collect: number[];
  comment: number[];
  hasLiked: boolean[];
  hasMirrored: boolean[];
  hasCollected: boolean[];
}

const initialReactionFeedCountState: ReactionFeedCountState = {
  like: [],
  mirror: [],
  collect: [],
  comment: [],
  hasLiked: [],
  hasMirrored: [],
  hasCollected: [],
};

export const reactionFeedCountSlice = createSlice({
  name: "reactionFeedCount",
  initialState: initialReactionFeedCountState,
  reducers: {
    setReactionFeedCount: (
      state: ReactionFeedCountState,
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

export const { setReactionFeedCount } = reactionFeedCountSlice.actions;

export default reactionFeedCountSlice.reducer;
