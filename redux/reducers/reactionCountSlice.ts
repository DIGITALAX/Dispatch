import { createSlice } from "@reduxjs/toolkit";

export interface ReactionCountState {
  like: number[];
  mirror: number[];
  collect: number[];
}

const initialReactionCountState: ReactionCountState = {
  like: [],
  mirror: [],
  collect: [],
};

export const reactionCountSlice = createSlice({
  name: "reactionCount",
  initialState: initialReactionCountState,
  reducers: {
    setReactionCount: (
      state: ReactionCountState,
      { payload: { actionLike, actionMirror, actionCollect } }
    ) => {
      state.like = actionLike;
      state.mirror = actionMirror;
      state.collect = actionCollect;
    },
  },
});

export const { setReactionCount } = reactionCountSlice.actions;

export default reactionCountSlice.reducer;
