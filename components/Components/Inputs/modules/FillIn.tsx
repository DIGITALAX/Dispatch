import { FormEvent, FunctionComponent } from "react";
import { FillInProps } from "../types/inputs.types";

const FillIn: FunctionComponent<FillInProps> = ({ textArea, changeFunction }): JSX.Element => {
  return (
    <>
      {textArea ? (
        <textarea
          className="relative w-full h-24 rounded-lg border border-white bg-offBlack font-economica text-white px-1 focus:ring-verde focus:ring-2"
          style={{ resize: "none" }}
          onChange={(e: FormEvent) => changeFunction(e)}
        ></textarea>
      ) : (
        <input className="relative w-full h-10 rounded-lg border border-white bg-offBlack font-economica text-white px-1 focus:ring-verde focus:ring-2" onChange={(e: FormEvent) => changeFunction(e)} />
      )}
    </>
  );
};

export default FillIn;
