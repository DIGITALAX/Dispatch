import { FormEvent } from "react";
import { AnyAction, Dispatch } from "redux";

export type AllCollectionsProps = {
  dispatch: Dispatch<AnyAction>;
  allCollections: any[];
  allCollectionsRedux: any[];
};

export type AddCollectionProps = {
  collectionImage: string;
  imageLoading: boolean;
  uploadImage: (
    e: FormEvent,
    setImageLoading: (e: boolean) => void
  ) => Promise<void>;
  addCollection: () => Promise<void>;
  addCollectionLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  handleCollectionTitle: (e: FormEvent) => void;
  handleCollectionDescription: (e: FormEvent) => void;
  setImageLoading: (e: boolean) => void;
};
