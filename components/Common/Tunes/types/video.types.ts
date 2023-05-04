import { Publication } from "@/components/Home/types/lens.types";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { VideoSyncState } from "@/redux/reducers/videoSyncSlice";
import { FormEvent, MouseEvent, Ref } from "react";
import ReactPlayer from "react-player";
import { AnyAction, Dispatch } from "redux";

export type ControlsProps = {
  formatTime: (time: number) => string;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  collected: boolean;
  mirrored: boolean;
  liked: boolean;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  authStatus: boolean;
  profileId: string;
  mainVideo: MainVideoState;
  videos: Publication[];
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  dispatchVideos: Publication[];
  collectAmount: number[];
  mirrorAmount: number[];
  likeAmount: number[];
  videoSync: VideoSyncState;
};

export type UseControlsResults = {
  streamRef: Ref<ReactPlayer>;
  fullVideoRef: Ref<ReactPlayer>;
  formatTime: (time: number) => string;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  profileId: string;
  wrapperRef: Ref<HTMLDivElement>;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
};

export type PlayerProps = {
  streamRef: Ref<ReactPlayer>;
  mainVideo: MainVideoState;
  videos: Publication[];
  volume: number;
  wrapperRef: Ref<HTMLDivElement>;
  dispatchVideos: Publication[];
  fullScreen: boolean;
  muted: boolean;
  videoSync: VideoSyncState;
};

export type ComponentProps = {
  streamRef: Ref<ReactPlayer>;
  mainVideo: MainVideoState;
  videos: Publication[];
  volume: number;
  dispatchVideos: Publication[];
  muted: boolean;
  videoSync: VideoSyncState;
};

export type UseChannelsResults = {
  videos: Publication[];
  tab: number;
  setTab: (e: number) => void;
  likeAmount: number[];
  collectAmount: number[];
  mirrorAmount: number[];
};

export type ChannelsProps = {
  videos: Publication[];
  dispatch: Dispatch<AnyAction>;
  dispatchVideos: Publication[];
  videoSync: VideoSyncState;
};

export type TunesProps = {
  streamRef: Ref<ReactPlayer>;
  formatTime: (time: number) => string;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  profileId: string;
  wrapperRef: Ref<HTMLDivElement>;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  videos: Publication[];
  collectAmount: number[];
  mirrorAmount: number[];
  likeAmount: number[];
  videoSync: VideoSyncState;
};
