import { createSlice } from "@reduxjs/toolkit";

export interface ReactionTimelineCountState {
  like: number[];
  mirror: number[];
  collect: number[];
  comment: number[];
  hasLiked: boolean[];
  hasMirrored: boolean[];
  hasCollected: boolean[];
}

const initialReactionTimelineCountState: ReactionTimelineCountState = {
  like: [],
  mirror: [],
  collect: [],
  comment: [],
  hasLiked: [],
  hasMirrored: [],
  hasCollected: [],
};

export const reactionTimelineCountSlice = createSlice({
  name: "reactionTimelineCount",
  initialState: initialReactionTimelineCountState,
  reducers: {
    setReactionTimelineCount: (
      state: ReactionTimelineCountState,
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

export const { setReactionTimelineCount } = reactionTimelineCountSlice.actions;

export default reactionTimelineCountSlice.reducer;
