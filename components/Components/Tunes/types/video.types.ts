import { Publication } from "@/components/Home/types/lens.types";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { FormEvent, MouseEvent, Ref } from "react";
import ReactPlayer from "react-player";
import { AnyAction, Dispatch } from "redux";

export type ControlsProps = {
  setFullScreen: (fullScreen: boolean) => void;
  fullScreen: boolean;
  formatTime: (time: number) => string;
  currentTime: number;
  duration: number;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  isPlaying: boolean;
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
  likedArray: boolean[];
  mirroredArray: boolean[];
  videos: Publication[];
  setIsPlaying: (e: boolean) => void;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  dispatchVideos: Publication[];
  collectedArray: boolean[];
  collectAmount: number[];
  mirrorAmount: number[];
  likeAmount: number[];
};

export type UseControlsResults = {
  streamRef: Ref<ReactPlayer>;
  setFullScreen: (fullScreen: boolean) => void;
  fullScreen: boolean;
  formatTime: (time: number) => string;
  currentTime: number;
  duration: number;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  isPlaying: boolean;
  handleHeart: () => void;
  heart: boolean;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  authStatus: boolean;
  profileId: string;
  mainVideo: MainVideoState;
  setIsPlaying: (e: boolean) => void;
  setCurrentTime: (e: number) => void;
  setDuration: (e: number) => void;
  wrapperRef: Ref<HTMLDivElement>;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
};

export type PlayerProps = {
  heart: boolean;
  streamRef: Ref<ReactPlayer>;
  mainVideo: MainVideoState;
  videosLoading: boolean;
  isPlaying: boolean;
  likedArray: boolean[];
  mirroredArray: boolean[];
  videos: Publication[];
  volume: number;
  setCurrentTime: (e: number) => void;
  setDuration: (e: number) => void;
  wrapperRef: Ref<HTMLDivElement>;
  dispatchVideos: Publication[];
  collectedArray: boolean[];
};

export type ComponentProps = {
  streamRef: Ref<ReactPlayer>;
  mainVideo: MainVideoState;
  isPlaying: boolean;
  likedArray: boolean[];
  mirroredArray: boolean[];
  videos: Publication[];
  volume: number;
  setCurrentTime: (e: number) => void;
  setDuration: (e: number) => void;
  dispatchVideos: Publication[];
  collectedArray: boolean[];
};

export type UseChannelsResults = {
  videos: Publication[];
  liked: boolean[];
  mirrored: boolean[];
  collected: boolean[];
  tab: number;
  setTab: (e: number) => void;
  videosLoading: boolean;
  likeAmount: number[];
  collectAmount: number[];
  mirrorAmount: number[];
  hover: boolean[];
  setHover: (e: boolean[]) => void;
};

export type ChannelsProps = {
  videos: Publication[];
  dispatch: Dispatch<AnyAction>;
  liked: boolean[];
  mirrored: boolean[];
  videosLoading: boolean;
  dispatchVideos: Publication[];
  collected: boolean[];
  hover: boolean[];
  setHover: (e: boolean[]) => void;
};
