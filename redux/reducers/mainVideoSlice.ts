import { createSlice } from "@reduxjs/toolkit";
import json from "../../public/videos/local.json";

export interface MainVideoState {
  id: string;
  video: string;
  collected: boolean;
  liked: boolean;
  mirrored: boolean;
  local: string;
}

const initialMainVideoState: MainVideoState = {
  id: "0x01c6a9-0x34",
  video: "https://chromadin.infura-ipfs.io/ipfs/bafybeigxyjb663ucalwenvn2zwxyy7juvfrkexq2iaif2ge47nnk7x6moy",
  collected: false,
  liked: false,
  mirrored: false,
  local: `${json[0].link}`,
};

export const mainVideoSlice = createSlice({
  name: "mainVideo",
  initialState: initialMainVideoState,
  reducers: {
    setMainVideo: (
      state: MainVideoState,
      {
        payload: {
          actionVideo,
          actionCollected,
          actionLiked,
          actionMirrored,
          actionId,
          actionLocal,
        },
      }
    ) => {
      state.video = actionVideo;
      state.collected = actionCollected;
      state.liked = actionLiked;
      state.mirrored = actionMirrored;
      state.id = actionId;
      state.local = actionLocal;
    },
  },
});

export const { setMainVideo } = mainVideoSlice.actions;

export default mainVideoSlice.reducer;
