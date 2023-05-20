import { Profile, Publication } from "@/components/Home/types/lens.types";
import { CollectionDetailsState } from "@/redux/reducers/collectionDetailsSlice";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { PostCollectValuesState } from "@/redux/reducers/postCollectSlice";
import { VideoSyncState } from "@/redux/reducers/videoSyncSlice";
import { Ref } from "react";
import ReactPlayer from "react-player";
import { DispatchProp } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { Collection } from "../../Collections/types/collections.types";

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

export type ImageViewerProps = {
  dispatch: Dispatch<AnyAction>;
  image: string;
  type: string;
};

export type FollowerOnlyProps = {
  profile: Profile | undefined;
  followProfile: () => Promise<void>;
  followLoading: boolean;
  approved: boolean;
  approveCurrency: () => Promise<void>;
};

export type CollectInfoProps = {
  buttonText: string;
  symbol?: string;
  value?: string;
  limit?: string;
  time?: string;
  totalCollected?: number;
  canClick?: boolean;
  isApproved?: boolean;
  approveCurrency?: () => Promise<void>;
  handleCollect?: (id: string) => Promise<void>;
  collectLoading: boolean;
  approvalLoading?: boolean;
  handleLensSignIn: () => Promise<void>;
  commentId: string;
};

export type CollectModalProps = {
  message: string;
};

export type PurchaseProps = {
  collectInfoLoading: boolean;
  approvalLoading: boolean;
  address: `0x${string}` | undefined;
  collectModuleValues: PostCollectValuesState;
  lensProfile: string;
  collectComment: (id: string) => Promise<void>;
  collectLoading: boolean;
  approveCurrency: () => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  commentId: string;
  dispatch: Dispatch<AnyAction>;
};

export type WhoProps = {
  accounts: any[];
  fetchMore: () => Promise<void>;
  loading: boolean;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  type: number;
};

export type UpdateCollectionProps = {
  updateCollection: () => Promise<void>;
  updateCollectionLoading: boolean;
  collectionValues: CollectionDetailsState
  dispatch: Dispatch<AnyAction>;
};

export type DecryptProps = {
  dispatch: Dispatch<AnyAction>;
  collections: Collection[];
};
