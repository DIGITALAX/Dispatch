import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FollowerOnlyState {
  open: boolean;
  id: string;
  followerId: string;
  index: number | undefined;
}

const initialFollowerOnlyState: FollowerOnlyState = {
  open: false,
  id: "",
  followerId: "",
  index: undefined,
};

export const followerOnlySlice = createSlice({
  name: "followeronly",
  initialState: initialFollowerOnlyState,
  reducers: {
    setFollowerOnly: (
      state: FollowerOnlyState,
      { payload: { actionOpen, actionId, actionIndex, actionFollowerId } }
    ) => {
      state.open = actionOpen;
      state.id = actionId;
      state.followerId = actionFollowerId;
      state.index = actionIndex;
    },
  },
});

export const { setFollowerOnly } = followerOnlySlice.actions;

export default followerOnlySlice.reducer;
