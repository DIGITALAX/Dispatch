import { createSlice } from "@reduxjs/toolkit";

export interface ReactionFeedCountState {
  like: number[];
  mirror: number[];
  collect: number[];
  comment: number[];
}

const initialReactionFeedCountState: ReactionFeedCountState = {
  like: [],
  mirror: [],
  collect: [],
  comment: [],
};

export const reactionFeedCountSlice = createSlice({
  name: "reactionFeedCount",
  initialState: initialReactionFeedCountState,
  reducers: {
    setReactionFeedCount: (
      state: ReactionFeedCountState,
      { payload: { actionLike, actionMirror, actionCollect, actionComment } }
    ) => {
      state.like = actionLike;
      state.mirror = actionMirror;
      state.collect = actionCollect;
      state.comment = actionComment;
    },
  },
});

export const { setReactionFeedCount } = reactionFeedCountSlice.actions;

export default reactionFeedCountSlice.reducer;
