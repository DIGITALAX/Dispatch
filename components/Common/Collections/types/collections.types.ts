import { Profile } from "@/components/Home/types/lens.types";
import { CollectionDetailsState } from "@/redux/reducers/collectionDetailsSlice";
import { FormEvent, Ref } from "react";
import { AnyAction, Dispatch } from "redux";

export type AllCollectionsProps = {
  dispatch: Dispatch<AnyAction>;
  allCollectionsRedux: any[];
  collectionsLoading: boolean;
  marketProfile: Profile | undefined;
};

export type AddCollectionProps = {
  collectionType: string;
  setAudioLoading: (e: boolean) => void;
  audioLoading: boolean;
  videoRef: Ref<HTMLVideoElement>;
  uploadAudio: (
    e: FormEvent<Element>,
    setAudioLoading: (e: boolean) => void,
    type: string
  ) => Promise<void>;
  videoAudio: boolean;
  handleCollectionTitle: (e: FormEvent) => void;
  handleCollectionDescription: (e: FormEvent) => void;
  setImageLoading: (e: boolean) => void;
  handleCollectionAmount: (e: FormEvent) => void;
  collectionDetails: CollectionDetailsState;
  handleCollectionPrices: (e: FormEvent, address: string) => void;
  setPrice: (e: { value: number; currency: string }) => void;
  price: { value: number; currency: string } | undefined;
  deleteCollection: () => Promise<void>;
  deleteCollectionLoading: boolean;
  canEditCollection: boolean;
  imageLoading: boolean;
  uploadImage: (
    e: FormEvent<Element>,
    setImageLoading: (e: boolean) => void,
    type: string,
    audio?: boolean
  ) => Promise<void>;
  addCollection: () => Promise<void>;
  addCollectionLoading: boolean;
  dispatch: Dispatch<AnyAction>;
};

export type CollectionPreviewProps = {
  collectionDetails: CollectionDetailsState;
  setPrice: (e: { value: number; currency: string }) => void;
  price: { value: number; currency: string } | undefined;
  collectionType: string;
  videoRef: Ref<HTMLVideoElement>;
  videoAudio?: boolean;
};

export type CollectionPricesProps = {
  collectionDetails: CollectionDetailsState;
  handleCollectionPrices: (e: FormEvent, address: string) => void;
  loader: boolean;
  canEditCollection: boolean;
};

export interface Collection {
  amount: string;
  collectionId: string;
  name: string;
  owner: string;
  audioFileName: string;
  drop: {
    name: string;
    image: string;
  };
  uri: {
    description: string;
    external_url: string;
    image: string;
    name: string;
    type: string;
    audio?: string;
  };
  basePrices: string[];
  acceptedTokens: string[];
  tokenIds: string[];
  soldTokens: string[] | null;
  fileType: string;
  contractType: string;
  collectionIPFS: string;
  dropIPFS: string;
  blockNumber: string;
}

export type ImageProps = {
  audioLoading?: boolean;
  setAudioLoading?: (e: boolean) => void;
  audioFileName?: string;
  uploadAudio?: (
    e: FormEvent<Element>,
    setAudioLoading: (e: boolean) => void,
    type: string
  ) => Promise<void>;
  handleCollectionTitle: (e: FormEvent) => void;
  handleCollectionDescription: (e: FormEvent) => void;
  setImageLoading: (e: boolean) => void;
  handleCollectionAmount: (e: FormEvent) => void;
  collectionType: string;
  collectionDetails: CollectionDetailsState;
  handleCollectionPrices: (e: FormEvent, address: string) => void;
  setPrice: (e: { value: number; currency: string }) => void;
  price: { value: number; currency: string } | undefined;
  deleteCollection: () => Promise<void>;
  deleteCollectionLoading: boolean;
  canEditCollection: boolean;
  imageLoading: boolean;
  uploadImage: (
    e: FormEvent<Element>,
    setImageLoading: (e: boolean) => void,
    type: string
  ) => Promise<void>;
  addCollection: () => Promise<void>;
  addCollectionLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  videoRef: Ref<HTMLVideoElement>;
  videoAudio?: boolean;
};
