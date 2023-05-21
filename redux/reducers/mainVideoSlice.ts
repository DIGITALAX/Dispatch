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
  id: "0x01c6a9-0x25",
  video:
    "https://chromadin.infura-ipfs.io/ipfs/bafybeigqr74i2pos6qvovcc444rrmuhpvfznepkbn5tqiv3aasxchph2va",
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
