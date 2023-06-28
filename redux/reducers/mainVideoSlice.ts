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
  id: "0x01c6a9-0x36",
  video: "https://chromadin.infura-ipfs.io/ipfs/bafybeifx53ipoqwfuwynay3bsw6dm2qlcuqadrhhu73hkpm6s7vmaavlbq",
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
