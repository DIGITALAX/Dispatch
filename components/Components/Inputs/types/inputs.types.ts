import { FormEvent } from "react";

export type FillInProps = {
  textArea: boolean;
  changeFunction: (e: FormEvent) => void;
};

export type ButtonAddProps = {
  text: string;
  functionAdd: () => Promise<void>;
  loader: boolean;
};

export type ImageUploadProps = {
  image: string;
  imageLoading: boolean;
  uploadImage: (
    e: FormEvent,
    setImageLoading: (e: boolean) => void
  ) => Promise<void>;
  loaderGeneral: boolean;
  setImageLoading: (e: boolean) => void;
};

export type DropDownProps = {
  values: string[];
  setChosen: (e: string[]) => void;
  chosen: string[];
  open: boolean;
  setOpen: (e: boolean) => void;
};
