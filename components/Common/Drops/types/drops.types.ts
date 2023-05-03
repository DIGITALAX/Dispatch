import { DropDetailsState } from "@/redux/reducers/dropDetailsSlice";
import { FormEvent } from "react";
import { AnyAction, Dispatch } from "redux";

export type AllDropsProps = {
  dispatch: Dispatch<AnyAction>;
  allDrops: any[];
  allDropsRedux: any[];
};

export type AddDropProps = {
  imageLoading: boolean;
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
};
