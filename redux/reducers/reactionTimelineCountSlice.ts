import { createSlice } from "@reduxjs/toolkit";

export interface ReactionTimelineCountState {
  like: number[];
  mirror: number[];
  collect: number[];
  comment: number[];
}

const initialReactionTimelineCountState: ReactionTimelineCountState = {
  like: [],
  mirror: [],
  collect: [],
  comment: [],
};

export const reactionTimelineCountSlice = createSlice({
  name: "reactionTimelineCount",
  initialState: initialReactionTimelineCountState,
  reducers: {
    setReactionTimelineCount: (
      state: ReactionTimelineCountState,
      { payload: { actionLike, actionMirror, actionCollect, actionComment } }
    ) => {
      state.like = actionLike;
      state.mirror = actionMirror;
      state.collect = actionCollect;
      state.comment = actionComment;
    },
  },
});

export const { setReactionTimelineCount } = reactionTimelineCountSlice.actions;

export default reactionTimelineCountSlice.reducer;
