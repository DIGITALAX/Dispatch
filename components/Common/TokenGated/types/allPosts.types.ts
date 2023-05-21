import {
  Erc20,
  Profile,
  Publication,
} from "@/components/Home/types/lens.types";
import { CommentFeedCountState } from "@/redux/reducers/commentCountSlice";
import { IndividualFeedCountState } from "@/redux/reducers/individualFeedCountSlice";
import { ReactionFeedCountState } from "@/redux/reducers/reactionFeedCountSlice";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { NextRouter } from "next/router";
import { FormEvent, KeyboardEvent, Ref, RefObject } from "react";
import { AnyAction, Dispatch } from "redux";
import { Collection } from "../../Collections/types/collections.types";

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
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
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
  openComment: string;
  allCollections: Collection[];
};

export type ProfileSideBarProps = {
  publication: Publication;
  followerOnly: boolean | undefined;
  dispatch: Dispatch<AnyAction>;
  hasMirrored: boolean | undefined;
  hasReacted: boolean | undefined;
  index: number;
  address: `0x${string}`;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
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
  openComment: string;
  feedType: string;
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
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
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
  openComment: string;
  feedType: string;
};

export type AllPostsProps = {
  setTokenIds: (e: string[]) => void;
  tokenIds: string[];
  collections: Collection[];
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
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
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
  commentOpen: string;
  commentPost: (id: string) => Promise<void>;
  commentDescription: string;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  commentLoading: boolean;
  gifOpen: boolean;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (
    e: FormEvent | File,
    setImageLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadedImages: UploadedMedia[]
  ) => Promise<void>;
  uploadVideo: (
    e: FormEvent,
    setVideoLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ) => Promise<void>;
  handleRemoveImage: (
    image: UploadedMedia,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ) => void;
  postImagesDispatched: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  collectOpen: boolean;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  individualAmounts: IndividualFeedCountState;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  collectNotif: string;
  canComment: boolean;
  authStatus: boolean;
  profileId: string;
  handleLensSignIn: () => Promise<void>;
  handleConnect: () => void;
  setScrollPos: (e: MouseEvent) => void;
  scrollPos: {
    feed: number;
    timeline: number;
  };
  tokenGatePost: () => Promise<void>;
  postDescription: string;
  handlePostDescription: (e: FormEvent<Element>) => Promise<void>;
  handleGifPost: (e: FormEvent) => void;
  textPostElement: RefObject<HTMLTextAreaElement>;
  preElementPost: RefObject<HTMLPreElement>;
  postLoading: boolean;
  caretCoordPost: {
    x: number;
    y: number;
  };
  mentionProfilesPost: Profile[];
  handleGifSubmitPost: () => Promise<void>;
  profilesOpenPost: boolean;
  handleMentionClickPost: (user: any) => void;
  handleSetGifPost: (e: UploadedMedia) => void;
  handleKeyDownDeletePost: (e: KeyboardEvent<Element>) => void;
  videoLoadingPost: boolean;
  imageLoadingPost: boolean;
  setAudienceTypePost: (e: string) => void;
  mappedFeaturedFilesPost: UploadedMedia[];
  valuePost: number;
  audienceTypePost: string;
  resultsPost: any[];
  audienceDropDownPost: boolean;
  setAudienceDropDownPost: (e: boolean) => void;
  setChargeCollectPost: (e: string) => void;
  setChargeCollectDropDownPost: (e: boolean) => void;
  setCollectiblePost: (e: string) => void;
  setCollectibleDropDownPost: (e: boolean) => void;
  setEnabledCurrencyPost: (e: string) => void;
  setCurrencyDropDownPost: (e: boolean) => void;
  setLimitPost: (e: number) => void;
  postImagesDispatchedPost: UploadedMedia[];
  setLimitedDropDownPost: (e: boolean) => void;
  setLimitedEditionPost: (e: string) => void;
  limitedDropDownPost: boolean;
  limitedEditionPost: string;
  setTimeLimitDropDownPost: (e: boolean) => void;
  setReferralPost: (e: number) => void;
  setTimeLimitPost: (e: string) => void;
  currencyDropDownPost: boolean;
  collectibleDropDownPost: boolean;
  setValuePost: (e: number) => void;
  enabledCurrencyPost: string | undefined;
  chargeCollectPost: string;
  chargeCollectDropDownPost: boolean;
  limitPost: number;
  timeLimitPost: string;
  timeLimitDropDownPost: boolean;
  referralPost: number;
  collectiblePost: string;
  uploadImagesPost: UploadedMedia[];
  setMappedFeatureFilesPost: (e: UploadedMedia[]) => void;
  uploadImagesComment: UploadedMedia[];
  setMappedFeatureFilesComment: (e: UploadedMedia[]) => void;
  setVideoLoadingComment: (e: boolean) => void;
  setVideoLoadingPost: (e: boolean) => void;
  setImageLoadingComment: (e: boolean) => void;
  setImageLoadingPost: (e: boolean) => void;
  decryptAllCollections: Collection[]
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
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
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
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
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
  commentOpen: string;
  commentPost: (id: string) => Promise<void>;
  commentDescription: string;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  commentLoading: boolean;
  gifOpen: boolean;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (
    e: FormEvent | File,
    setImageLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadedImages: UploadedMedia[]
  ) => Promise<void>;
  uploadVideo: (
    e: FormEvent,
    setVideoLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ) => Promise<void>;
  handleRemoveImage: (
    image: UploadedMedia,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ) => void;
  postImagesDispatched: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  collectOpen: boolean;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  collectNotif: string;
  canComment: boolean;
  authStatus: boolean;
  profileId: string;
  handleLensSignIn: () => Promise<void>;
  handleConnect: () => void;
  individualAmounts: IndividualFeedCountState;
  setMappedFeatureFilesComment: (e: UploadedMedia[]) => void;
  uploadImagesComment: UploadedMedia[];
  setVideoLoadingComment: (e: boolean) => void;
  setImageLoadingComment: (e: boolean) => void;
  allCollections: Collection[];
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
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  fetchMoreComments: () => Promise<void>;
  hasMoreComments: boolean;
  commentsLoading: boolean;
  setReactLoader: (e: boolean[]) => void;
  setMirrorLoader: (e: boolean[]) => void;
  setCollectLoader: (e: boolean[]) => void;
  authStatus: boolean;
  profileId: string;
  commentPost: (id: string) => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  handleConnect: () => void;
  commentDescription: string;
  commentLoading: boolean;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (
    e: FormEvent | File,
    setImageLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadedImages: UploadedMedia[]
  ) => Promise<void>;
  uploadVideo: (
    e: FormEvent,
    setVideoLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ) => Promise<void>;
  handleRemoveImage: (
    image: UploadedMedia,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ) => void;
  postImagesDispatched: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
  collectOpen: boolean;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  collectNotif: string;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  commentId: string;
  canComment: boolean;
  openComment: string;
  setMappedFeatureFilesComment: (e: UploadedMedia[]) => void;
  uploadImagesComment: UploadedMedia[];
  setVideoLoadingComment: (e: boolean) => void;
  setImageLoadingComment: (e: boolean) => void;
  allCollections: Collection[];
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

export type ImageUploadsProps = {
  handleRemoveImage: (
    image: UploadedMedia,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ) => void;
  commentLoading: boolean;
  postImagesDispatched: UploadedMedia[];
  setMappedFeatureFiles: (e: UploadedMedia[]) => void;
  uploadImages: UploadedMedia[];
};

export type MakePostProps = {
  collections: Collection[];
  setTokenIds: (e: string[]) => void;
  tokenIds: string[];
  tokenGatePost: () => Promise<void>;
  postDescription: string;
  postLoading: boolean;
  handlePostDescription: (e: FormEvent) => Promise<void>;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (
    e: FormEvent | File,
    setImageLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadedImages: UploadedMedia[]
  ) => Promise<void>;
  uploadVideo: (
    e: FormEvent,
    setVideoLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ) => Promise<void>;
  handleRemoveImage: (
    image: UploadedMedia,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ) => void;
  postImagesDispatched: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  dispatch: Dispatch<AnyAction>;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  uploadImagesPost: UploadedMedia[];
  setMappedFeatureFilesPost: (e: UploadedMedia[]) => void;
  setVideoLoadingPost: (e: boolean) => void;
  setImageLoadingPost: (e: boolean) => void;
};

export type MakeCommentProps = {
  authStatus: boolean;
  profileId: string;
  commentPost: (id: string) => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  handleConnect: () => void;
  commentDescription: string;
  commentLoading: boolean;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (
    e: FormEvent | File,
    setImageLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadedImages: UploadedMedia[]
  ) => Promise<void>;
  uploadVideo: (
    e: FormEvent,
    setVideoLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ) => Promise<void>;
  handleRemoveImage: (
    image: UploadedMedia,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ) => void;
  postImagesDispatched: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
  collectOpen: boolean;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  collectNotif: string;
  dispatch: Dispatch<AnyAction>;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  commentId: string;
  canComment: boolean;
  setMappedFeatureFilesComment: (e: UploadedMedia[]) => void;
  uploadImagesComment: UploadedMedia[];
  setVideoLoadingComment: (e: boolean) => void;
  setImageLoadingComment: (e: boolean) => void;
};

export type OptionsCommentProps = {
  videoLoading: boolean;
  imageLoading: boolean;
  commentLoading: boolean;
  uploadImages: (
    e: FormEvent | File,
    setImageLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadedImages: UploadedMedia[]
  ) => Promise<void>;
  uploadVideo: (
    e: FormEvent,
    setVideoLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ) => Promise<void>;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
  collectOpen: boolean;
  dispatch: Dispatch<AnyAction>;
  setVideoLoading: (e: boolean) => void;
  setMappedFeatureFiles: (e: UploadedMedia[]) => void;
  uploadedImages: UploadedMedia[];
  setImageLoading: (e: boolean) => void;
  imagesRedux: UploadedMedia[];
  setCollectOpen: ActionCreatorWithPayload<boolean>;
};

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

export type GatedOptionsProps = {
  collections: Collection[];
  setTokenIds: (e: string[]) => void;
  tokenIds: string[];
};
