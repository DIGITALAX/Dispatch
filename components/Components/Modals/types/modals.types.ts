import { Publication } from "@/components/Home/types/lens.types";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { Ref, RefObject } from "react";
import ReactPlayer from "react-player";
import { AnyAction, Dispatch } from "redux";

export type ErrorProps = {
  dispatch: Dispatch<AnyAction>;
  message: string;
};

export type FullScreenVideoProps = {
  dispatch: Dispatch<AnyAction>;
  mainVideo: MainVideoState;
  videoRef: RefObject<HTMLElement> | undefined;
};

export type SuccessProps = {
  media: string;
  dispatch: Dispatch<AnyAction>;
  link: string;
  message: string;
};

export type IndexingProps = {
  message: string;
}
