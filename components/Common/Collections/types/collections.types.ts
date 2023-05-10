import { CollectionDetailsState } from "@/redux/reducers/collectionDetailsSlice";
import { FormEvent } from "react";
import { AnyAction, Dispatch } from "redux";

export type AllCollectionsProps = {
  dispatch: Dispatch<AnyAction>;
  allCollections: any[];
  allCollectionsRedux: any[];
  collectionsLoading: boolean;
};

export type AddCollectionProps = {
  imageLoading: boolean;
  uploadImage: (
    e: FormEvent<Element>,
    setImageLoading: (e: boolean) => void,
    type: string
  ) => Promise<void>;
  addCollection: () => Promise<void>;
  addCollectionLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  handleCollectionTitle: (e: FormEvent) => void;
  handleCollectionDescription: (e: FormEvent) => void;
  setImageLoading: (e: boolean) => void;
  handleCollectionAmount: (e: FormEvent) => void;
  collectionDetails: CollectionDetailsState;
  handleCollectionPrices: (e: FormEvent, address: string) => void;
  setPrice: (e: { value: number; currency: string }) => void;
  price: { value: number; currency: string } | undefined;
  deleteCollection: () => Promise<void>;
};

export type CollectionPreviewProps = {
  collectionDetails: CollectionDetailsState;
  setPrice: (e: { value: number; currency: string }) => void;
  price: { value: number; currency: string } | undefined;
};

export type CollectionPricesProps = {
  collectionDetails: CollectionDetailsState;
  handleCollectionPrices: (e: FormEvent, address: string) => void;
  loader: boolean;
};

export interface Collection {
  amount: string;
  collectionId: string;
  name: string;
  owner: string;
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
  };
  basePrices: string[];
  acceptedTokens: string[];
  tokenIds: string[];
  soldTokens: string[] | null;
  fileType: string;
  contractType: string;
  collectionIPFS: string;
  dropIPFS: string;
}
