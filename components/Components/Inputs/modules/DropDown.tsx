import { FunctionComponent } from "react";
import { FaSortDown } from "react-icons/fa";
import { DropDownProps } from "../types/inputs.types";

const DropDown: FunctionComponent<DropDownProps> = ({
  values,
  setChosen,
  chosen,
  open,
  setOpen,
}): JSX.Element => {
  return (
    <div className="relative w-40 h-fit flex flex-col items-start justify-center text-white font-economica text-center">
      <div
        className="relative w-full h-8 border border-white rounded-lg py-1.5 px-3 flex items-center justify-center flex-row cursor-pointer"
        onClick={() =>
          setOpen(
            values.filter((value) => !chosen.includes(value)).length > 0
              ? !open
              : false
          )
        }
      >
        <div className="relative w-full h-full flex items-center justify-center text-center">
          {values.filter((value) => !chosen.includes(value))[0]}
        </div>
        <div className="relative w-full h-fit flex items-center justify-end -top-px">
          <FaSortDown />
        </div>
      </div>
      {values.filter((value) => !chosen.includes(value)).length > 0 && open && (
        <div
          className={`absolute flex flex-col items-start w-full z-1 overflow-y-scroll h-32 top-8`}
        >
          {values
            .filter((value) => !chosen.includes(value))
            .map((label: string, index: number) => {
              return (
                <div
                  key={index}
                  className="relative w-full h-8 border border-white rounded-lg py-1.5 px-3 flex items-center justify-center flex-row cursor-pointer bg-offBlack hover:opacity-70"
                  onClick={() => setChosen([...chosen, label])}
                >
                  <div className="relative w-full h-full flex items-center justify-center text-center">
                    {label}
                  </div>
                </div>
              );
            })}
        </div>
      )}
      <div className="relative w-40 h-14 flex flex-row flex-wrap text-xs gap-1 py-3 overflow-y-scroll">
        {chosen.length > 0 &&
          chosen.map((label: string, index: number) => {
            return (
              <div
                className="relative w-fit h-fit py-px px-1 border border-white rounded-md cursor-pointer"
                key={index}
                onClick={() => {
                  setChosen(
                    chosen.filter((chosenLabel) => chosenLabel !== label)
                  );
                }}
              >
                {label}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DropDown;
