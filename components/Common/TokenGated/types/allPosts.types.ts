import { Publication } from "@/components/Home/types/lens.types";
import { CommentFeedCountState } from "@/redux/reducers/commentCountSlice";
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
  hasReacted?: boolean | undefined;
  hasMirrored?: boolean | undefined;
  hasCollected?: boolean | undefined;
  followerOnly: boolean;
  height?: string;
  address: `0x${string}`;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  commentPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  index: number;
  mirrorLoading: boolean;
  reactLoading: boolean;
  collectLoading: boolean;
  reactAmount: number;
  collectAmount: number;
  mirrorAmount: number;
  commentAmount: number;
  feedType: string;
  setCollectLoader?: (e: boolean[]) => void;
  setReactLoader?: (e: boolean[]) => void;
  setMirrorLoader?: (e: boolean[]) => void;
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
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  commentPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  mirrorLoading: boolean;
  reactLoading: boolean;
  collectLoading: boolean;
  reactAmount: number;
  collectAmount: number;
  mirrorAmount: number;
  hasCollected: boolean | undefined;
  commentAmount: number;
  setCollectLoader?: (e: boolean[]) => void;
  setReactLoader?: (e: boolean[]) => void;
  setMirrorLoader?: (e: boolean[]) => void;
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
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  commentPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  index: number;
  mirrorLoading: boolean;
  reactLoading: boolean;
  collectLoading: boolean;
  reactAmount: number;
  collectAmount: number;
  mirrorAmount: number;
  commentAmount: number;
  setCollectLoader?: (e: boolean[]) => void;
  setReactLoader?: (e: boolean[]) => void;
  setMirrorLoader?: (e: boolean[]) => void;
};

export type AllPostsProps = {
  dispatch: Dispatch<AnyAction>;
  followerOnly: boolean[];
  feedDispatch: Publication[];
  postsLoading: boolean;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  address: `0x${string}`;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  commentPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  reactionAmounts: ReactionFeedCountState;
  feedSwitch: boolean;
  setFeedSwitch: ActionCreatorWithPayload<
    boolean,
    "feedSwitch/setFeedSwitchRedux"
  >;
  timelineFollowerOnly: boolean[];
  timelineDispatch: Publication[];
  mirrorTimelineLoading: boolean[];
  collectTimelineLoading: boolean[];
  reactTimelineLoading: boolean[];
  reactionTimelineAmounts: ReactionFeedCountState;
  hasMoreTimeline: boolean;
  fetchMoreTimeline: () => Promise<void>;
  feedType: {
    value: string;
    index: number;
  };
  mainPost: Publication;
  followerOnlyMain: boolean;
  mainPostLoading: boolean;
  hasMoreComments: boolean;
  getMorePostComments: () => Promise<void>;
  commentors: Publication[];
  commentsLoading: boolean;
  reactCommentLoading: boolean[];
  mirrorCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  followerOnlyComments: boolean[];
  commentAmounts: CommentFeedCountState;
  collectPostLoading: boolean[];
  mirrorPostLoading: boolean[];
  reactPostLoading: boolean[];
  setMirrorCommentLoading: (e: boolean[]) => void;
  setCollectCommentLoading: (e: boolean[]) => void;
  setReactCommentLoading: (e: boolean[]) => void;
  setCollectPostLoading: (e: boolean[]) => void;
  setMirrorPostLoading: (e: boolean[]) => void;
  setReactPostLoading: (e: boolean[]) => void;
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
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  commentPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  address: `0x${string}`;
  viewerOpen: boolean;
  router: NextRouter;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
};

export interface FollowArgs {
  follower: string;
  profileIds: [string];
  datas: [any];
  sig: {
    v: any;
    r: any;
    s: any;
    deadline: any;
  };
}

export type IndividualProps = {
  dispatch: Dispatch<AnyAction>;
  mainPost: Publication;
  feedType: {
    value: string;
    index: number;
  };
  address: `0x${string}` | undefined;
  followerOnlyMain: boolean;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  commentPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  mainPostLoading: boolean;
  commentAmounts: CommentFeedCountState;
  commentors: Publication[];
  mirrorCommentLoading: boolean[];
  reactCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  followerOnlyComments: boolean[];
  hasMoreComments: boolean;
  fetchMoreComments: () => Promise<void>;
  commentsLoading: boolean;
  collectPostLoading: boolean[];
  mirrorPostLoading: boolean[];
  reactPostLoading: boolean[];
  setMirrorCommentLoading: (e: boolean[]) => void;
  setCollectCommentLoading: (e: boolean[]) => void;
  setReactCommentLoading: (e: boolean[]) => void;
  setCollectPostLoading: (e: boolean[]) => void;
  setMirrorPostLoading: (e: boolean[]) => void;
  setReactPostLoading: (e: boolean[]) => void;
  postAmounts: ReactionFeedCountState;
};

export type CommentsProps = {
  commentAmounts: CommentFeedCountState;
  commentors: Publication[];
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  feedType: string;
  dispatch: Dispatch<AnyAction>;
  address: `0x${string}`;
  followerOnly: boolean[];
  commentPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number
  ) => Promise<void>;
  fetchMoreComments: () => Promise<void>;
  hasMoreComments: boolean;
  commentsLoading: boolean;
  setReactLoader: (e: boolean[]) => void;
  setMirrorLoader: (e: boolean[]) => void;
  setCollectLoader: (e: boolean[]) => void;
};

export interface UploadedMedia {
  cid: string;
  type: MediaType;
}

export interface PostImage {
  item: string;
  type: string;
  altTag: string;
}

export interface CollectValueType {
  freeCollectModule?: {
    followerOnly: boolean;
  };
  revertCollectModule?: boolean;
  feeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedTimedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  timedFeeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
}