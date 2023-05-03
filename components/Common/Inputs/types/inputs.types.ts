import { FormEvent } from "react";

export type FillInProps = {
  textArea: boolean;
  changeFunction: (e?: any) => void;
  type?: string;
  width: string;
  defaultValue: string;
};

export type ButtonAddProps = {
  text: string;
  functionAdd: () => Promise<void>;
  loader: boolean;
  width: string;
};

export type ImageUploadProps = {
  image: string;
  imageLoading: boolean;
  uploadImage: (
    e: FormEvent<Element>,
    setImageLoading: (e: boolean) => void,
    type: string
  ) => Promise<void>;
  loaderGeneral: boolean;
  setImageLoading: (e: boolean) => void;
  type: string;
};

export type DropDownProps = {
  values: string[];
  setChosen: (e: string[]) => void;
  chosen: string[];
  open: boolean;
  setOpen: (e: boolean) => void;
};