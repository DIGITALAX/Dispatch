import { Publication } from "@/components/Home/types/lens.types";
import { ReactionFeedCountState } from "@/redux/reducers/reactionFeedCountSlice";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";

export enum MediaType {
  Video,
  Image,
  Gif,
}

export interface UploadedMedia {
  cid: string;
  type: MediaType;
}

export interface PostImage {
  item: string;
  type: string;
  altTag: string;
}

export type FeedPublicationProps = {
  publication: Publication;
  dispatch: Dispatch<AnyAction>;
  type?: string;
  hasReacted?: boolean | undefined;
  hasMirrored?: boolean | undefined;
  hasCollected?: boolean | undefined;
  followerOnly: boolean;
  height?: string;
  viewerOpen: boolean;
  router: NextRouter;
  address: `0x${string}`;
  collectPost: (id: string) => Promise<void>;
  commentPost: (id: string) => Promise<void>;
  mirrorPost: (id: string) => Promise<void>;
  reactPost: (id: string) => Promise<void>;
  index: number;
  mirrorLoading: boolean;
  reactLoading: boolean;
  collectLoading: boolean;
  reactAmount: number;
  collectAmount: number;
  mirrorAmount: number;
  commentAmount: number;
};

export type ProfileSideBarProps = {
  publication: Publication;
  setReactionState: ActionCreatorWithPayload<
    any,
    "reactionState/setReactionState"
  >;
  followerOnly: boolean | undefined;
  dispatch: Dispatch<AnyAction>;
  setCommentShow: ActionCreatorWithPayload<any, "commentShow/setCommentShow">;
  hasMirrored: boolean | undefined;
  hasReacted: boolean | undefined;
  index: number;
  address: `0x${string}`;
  collectPost: (id: string) => Promise<void>;
  commentPost: (id: string) => Promise<void>;
  mirrorPost: (id: string) => Promise<void>;
  reactPost: (id: string) => Promise<void>;
  mirrorLoading: boolean;
  reactLoading: boolean;
  collectLoading: boolean;
  reactAmount: number;
  collectAmount: number;
  mirrorAmount: number;
  hasCollected: boolean | undefined;
  commentAmount: number;
};

export type ReactionProps = {
  id?: string;
  textColor: string;
  commentColor: string;
  mirrorColor: string;
  collectColor: string;
  heartColor: string;
  dispatch: Dispatch<AnyAction>;
  hasReacted: boolean;
  hasMirrored: boolean;
  hasCollected: boolean;
  followerOnly: boolean;
  publication: Publication;
  address: `0x${string}`;
  collectPost: (id: string) => Promise<void>;
  commentPost: (id: string) => Promise<void>;
  mirrorPost: (id: string) => Promise<void>;
  reactPost: (id: string) => Promise<void>;
  index: number;
  mirrorLoading: boolean;
  reactLoading: boolean;
  collectLoading: boolean;
  reactAmount: number;
  collectAmount: number;
  mirrorAmount: number;
  commentAmount: number;
};

export type AllPostsProps = {
  feed: Publication[];
  hasMirrored: boolean[];
  hasReacted: boolean[];
  hasCollected: boolean[];
  dispatch: Dispatch<AnyAction>;
  followerOnly: boolean[];
  feedDispatch: Publication[];
  postsLoading: boolean;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  viewerOpen: boolean;
  router: NextRouter;
  address: `0x${string}`;
  collectPost: (id: string) => Promise<void>;
  commentPost: (id: string) => Promise<void>;
  mirrorPost: (id: string) => Promise<void>;
  reactPost: (id: string) => Promise<void>;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  reactionAmounts: ReactionFeedCountState;
  feedSwitch: boolean;
  setFeedSwitch: (e: boolean) => void;
  hasTimelineCollected: boolean[];
  hasTimelineMirrored: boolean[];
  hasTimelineReacted: boolean[];
  timelineFollowerOnly: boolean[];
  timelineDispatch: Publication[];
  timeline: Publication[];
  mirrorTimelineLoading: boolean[];
  collectTimelineLoading: boolean[];
  reactTimelineLoading: boolean[];
  reactionTimelineAmounts: ReactionFeedCountState;
  hasMoreTimeline: boolean;
  fetchMoreTimeline: () => Promise<void>;
};

export interface ApprovalArgs {
  to: string;
  from: string;
  data: string;
}

export type PersonalTimelineProps = {
  feed: Publication[];
  feedDispatch: Publication[];
  reactionAmounts: ReactionFeedCountState;
  dispatch: Dispatch<AnyAction>;
  hasMirrored: boolean[];
  hasReacted: boolean[];
  hasCollected: boolean[];
  followerOnly: boolean[];
  collectPost: (id: string) => Promise<void>;
  commentPost: (id: string) => Promise<void>;
  mirrorPost: (id: string) => Promise<void>;
  reactPost: (id: string) => Promise<void>;
  address: `0x${string}`;
  viewerOpen: boolean;
  router: NextRouter;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
};
