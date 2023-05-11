import { FunctionComponent } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import lodash, { isString } from "lodash";
import { Erc20 } from "@/components/Home/types/lens.types";
import { CollectButtonProps } from "./types/buttons.types";

const CollectButton: FunctionComponent<CollectButtonProps> = ({
  values,
  col,
  row,
  openDropdown,
  handleOpenDropdown,
  selectValue,
  selectFunction,
  label,
}): JSX.Element => {
  let newValues: string[] = [];
  if (values) {
    if (isString(values?.[0])) {
      newValues = values as string[];
    } else {
      newValues = values?.flatMap((value) => (value as Erc20)?.symbol);
    }
  } else {
    newValues = ["yes", "no"];
  }

  return (
    <div
      className={`relative w-fit h-fit ${col && `col-start-${col}`} ${
        row && `row-start-${row}`
      } grid grid-flow-row auto-rows-auto grid grid-flow-row auto-rows-auto pr-2 pb-2 gap-2 text-xs`}
    >
      <div className="relative w-fit h-fit row-start-1 font-arcade text-white text-xs whitespace-pre-wrap break-words sm:whitespace-nowrap justify-self-start self-center text-left">
        {label}
      </div>
      <div
        className={`relative w-20 px-3 rounded-t-lg bg-white h-10 py-2 ${
          !openDropdown && "rounded-b-lg"
        } row-start-2 cursor-pointer flex gap-3`}
        onClick={() => {
          handleOpenDropdown(!openDropdown);
        }}
      >
        <div
          className={`relative w-full h-fit col-start-2 text-black font-arcade lowercase self-center place-self-center flex flex-col text-xs`}
        >
          <div className="relative col-start-1 place-self-center w-fit h-fit whitespace-nowrap">
            {selectValue}
          </div>
        </div>
      </div>
      <div className="absolute row-start-3 flex flex-col w-32 h-fit cursor-pointer z-1">
        {openDropdown &&
          lodash
            .filter(newValues, (item) => item !== selectValue)
            ?.map((item: string, index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-20 h-10 px-1 ${
                    index === newValues?.length - 2 && "rounded-b-lg"
                  } ${newValues} col-start-1 bg-white grid grid-flow-col auto-cols-auto gap-3 cursor-pointer justify-self-center`}
                  onClick={() => {
                    handleOpenDropdown(!openDropdown);
                    openDropdown && selectFunction(item);
                  }}
                >
                  <div
                    className={`relative w-fit h-fit col-start-1 text-black font-arcade lowercase place-self-center grid grid-flow-col auto-cols-auto text-xs`}
                  >
                    <div className="relative col-start-1 place-self-center w-fit h-fit">
                      {openDropdown ? item : selectValue}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default CollectButton;
