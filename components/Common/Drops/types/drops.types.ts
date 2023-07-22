import { DropDetailsState } from "@/redux/reducers/dropDetailsSlice";
import { FormEvent } from "react";
import { AnyAction, Dispatch } from "redux";
import { Collection } from "../../Collections/types/collections.types";
import { Profile } from "@/components/Home/types/lens.types";

export type AllDropsProps = {
  dispatch: Dispatch<AnyAction>;
  allDropsRedux: any[];
  dropsLoading: boolean;
  marketProfile: Profile | undefined;
};

export type AddDropProps = {
  imageLoading: boolean;
  alreadyInDropIds: string[];
  uploadImage: (
    e: FormEvent<Element>,
    setImageLoading: (e: boolean) => void,
    type: string
  ) => Promise<void>;
  addDrop: () => Promise<void>;
  addDropLoading: boolean;
  handleDropTitle: (e: FormEvent) => void;
  dispatch: Dispatch<AnyAction>;
  availableCollectionIds: string[];
  chosenCollections: string[];
  setChosenCollections: (e: string[]) => void;
  open: boolean;
  setOpen: (e: boolean) => void;
  setImageLoading: (e: boolean) => void;
  dropDetails: DropDetailsState;
  allCollections: Collection[];
  alreadyInDrop: string[];
  addMore: () => Promise<void>;
  deleteDrop: () => void;
  deleteDropLoading: boolean;
  marketProfile: Profile | undefined;
  removeCollectionFromDrop: (collectionId: number) => Promise<void>;
  removeCollectionLoading: boolean[];
};

export interface Drop {
  dropId: string;
  creator: string;
  collectionIds: string;
  uri: {
    name: string;
    image: string;
  };
  fileType: string;
  contractType: string;
  dropIPFS: string;
  blockNumber: string;
}
