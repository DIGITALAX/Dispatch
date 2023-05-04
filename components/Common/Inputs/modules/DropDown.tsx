import { FunctionComponent } from "react";
import { FaSortDown } from "react-icons/fa";
import { DropDownProps } from "../types/inputs.types";

const DropDown: FunctionComponent<DropDownProps> = ({
  values,
  setChosen,
  chosen,
  open,
  setOpen,
  alreadyInDrop,
  disabled,
}): JSX.Element => {
  return (
    <div className="relative w-40 min-w-fit h-fit flex flex-col items-start justify-center text-white font-earl text-center">
      <div
        className={`relative min-w-fit w-full h-8 border border-white rounded-lg py-1.5 px-3 flex items-center justify-center flex-row cursor-pointer
        `}
        onClick={() =>
          setOpen(
            values.filter((value) => !chosen.includes(value))?.length > 0
              ? !open
              : false
          )
        }
      >
        <div className="relative w-full h-full flex items-center justify-center text-center whitespace-nowrap text-xs">
          Avail. Collections
        </div>
        <div className="relative w-full h-fit flex items-center justify-end -top-1">
          <FaSortDown />
        </div>
      </div>
      {values.filter((value) => !chosen.includes(value)).length > 0 && open && (
        <div
          className={`absolute flex flex-col items-start w-full z-1 overflow-y-scroll max-h-32 h-fit top-8 text-xs`}
        >
          {values
            ?.filter((value) => !chosen.includes(value))
            .map((label: string, index: number) => {
              return (
                <div
                  key={index}
                  className="relative w-full h-8 border border-white rounded-lg py-1.5 px-3 flex items-center justify-center flex-row cursor-pointer bg-offBlack hover:opacity-70"
                  onClick={() => {
                    if (disabled && chosen?.length !== alreadyInDrop?.length) {
                      const newChosen = [...chosen];
                      newChosen.pop();
                      setChosen([...newChosen, label]);
                    } else {
                      setChosen([...chosen, label]);
                    }
                  }}
                >
                  <div className="relative w-full h-full flex items-center justify-center text-center">
                    {label.length > 20 ? label.slice(0, 18) + "..." : label}
                  </div>
                </div>
              );
            })}
        </div>
      )}
      <div className="relative w-40 h-14 flex flex-row flex-wrap text-xs gap-1 py-3 overflow-y-scroll">
        {chosen?.length > 0 &&
          chosen.map((label: string, index: number) => {
            const shouldFilter = alreadyInDrop.includes(label) && disabled;

            return (
              <div
                className={`relative w-fit h-fit py-px px-1 border border-white rounded-md hover:opacity-70 ${
                  !alreadyInDrop.includes(label) && "cursor-pointer"
                }`}
                key={index}
                onClick={() => {
                  if (!shouldFilter) {
                    setChosen(
                      chosen.filter((chosenLabel) => chosenLabel !== label)
                    );
                  }
                  setOpen(false);
                }}
              >
                {label.length > 20 ? label.slice(0, 18) + "..." : label}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DropDown;
