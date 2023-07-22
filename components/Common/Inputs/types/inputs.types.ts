import { FormEvent } from "react";

export type FillInProps = {
  textArea: boolean;
  changeFunction: (e?: any) => void;
  type?: string;
  width: string;
  defaultValue: string;
  loader?: boolean;
  disabled?: boolean;
};

export type ButtonAddProps = {
  text: string;
  functionAdd: () => any;
  loader: boolean;
  width: string;
  disabled?: boolean;
};

export type AudioUploadProps = {
  image: string;
  audio: string;
  imageLoading: boolean;
  uploadAudio: (
    e: FormEvent<Element>,
    setAudioLoading: (e: boolean) => void,
    type: string
  ) => Promise<void>;
  uploadImage: (
    e: FormEvent<Element>,
    setImageLoading: (e: boolean) => void,
    type: string
  ) => Promise<void>;
  loaderGeneral: boolean;
  setImageLoading: (e: boolean) => void;
  type: string;
  disabled: boolean;
  fileType: string;
  audioFileName: string;
  audioLoading: boolean;
  setAudioLoading: (e: boolean) => void;
};

export type ImageUploadProps = {
  image: string;
  collectionType?: string;
  imageLoading: boolean;
  uploadImage: (
    e: FormEvent<Element>,
    setImageLoading: (e: boolean) => void,
    type: string
  ) => Promise<void>;
  loaderGeneral: boolean;
  setImageLoading: (e: boolean) => void;
  type: string;
  disabled: boolean;
  fileType: string;
};

export type DropDownProps = {
  values: string[];
  alreadyInDropIds: string[];
  setChosen: (e: string[]) => void;
  chosen: string[];
  open: boolean;
  setOpen: (e: boolean) => void;
  alreadyInDrop: string[];
  disabled: boolean;
  removeCollectionFromDrop: (collectionId: number) => Promise<void>;
  removeCollectionLoading: boolean[];
};
