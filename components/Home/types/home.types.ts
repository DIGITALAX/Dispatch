import { AnyAction, Dispatch } from "redux";

export type OptionsProps = {
  dispatch: Dispatch<AnyAction>;
  handle: string | undefined
};
