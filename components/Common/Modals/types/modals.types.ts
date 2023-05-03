import { Publication } from "@/components/Home/types/lens.types";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { VideoSyncState } from "@/redux/reducers/videoSyncSlice";
import { Ref } from "react";
import ReactPlayer from "react-player";
import { AnyAction, Dispatch } from "redux";

export type ErrorProps = {
  dispatch: Dispatch<AnyAction>;
  message: string;
};

export type FullScreenVideoProps = {
  dispatch: Dispatch<AnyAction>;
  mainVideo: MainVideoState;
  videoRef: Ref<HTMLDivElement>;
  streamRef: Ref<ReactPlayer>;
  videos: Publication[];
  wrapperRef: Ref<HTMLDivElement>;
  dispatchVideos: Publication[];
  videoSync: VideoSyncState;
};

export type SuccessProps = {
  media: string;
  dispatch: Dispatch<AnyAction>;
  link: string;
  message: string;
};

export type IndexingProps = {
  message: string;
};
