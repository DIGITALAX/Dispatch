import { CollectionDetailsState } from "@/redux/reducers/collectionDetailsSlice";
import { FormEvent } from "react";
import { AnyAction, Dispatch } from "redux";

export type AllCollectionsProps = {
  dispatch: Dispatch<AnyAction>;
  allCollections: any[];
  allCollectionsRedux: any[];
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
};

export type CollectionPreviewProps = {
  collectionDetails: CollectionDetailsState;
  setPrice: (e: { value: number; currency: string }) => void;
  price: { value: number; currency: string }  | undefined;
};

export type CollectionPricesProps = {
  collectionDetails: CollectionDetailsState;
  handleCollectionPrices: (e: FormEvent, address: string) => void;
}