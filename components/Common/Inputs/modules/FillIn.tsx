import { FormEvent, FunctionComponent } from "react";
import { FillInProps } from "../types/inputs.types";

const FillIn: FunctionComponent<FillInProps> = ({
  textArea,
  changeFunction,
  type,
  width,
  defaultValue,
  loader,
  disabled,
}): JSX.Element => {
  return (
    <>
      {textArea ? (
        <textarea
          className={`relative w-${width} h-24 rounded-lg border border-white bg-offBlack font-economica text-white px-1 focus:ring-verde focus:ring-2`}
          style={{ resize: "none" }}
          onChange={changeFunction}
          defaultValue={defaultValue}
          disabled={loader || disabled}
        ></textarea>
      ) : (
        <input
          className={`relative w-${width} h-10 rounded-lg border border-white bg-offBlack font-economica text-white px-1 focus:ring-verde focus:ring-2`}
          onChange={changeFunction}
          type={type}
          min={0}
          defaultValue={defaultValue}
          disabled={loader || disabled}
        />
      )}
    </>
  );
};

export default FillIn;
