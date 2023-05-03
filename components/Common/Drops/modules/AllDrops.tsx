import { setDropSwitcher } from "@/redux/reducers/dropSwitcherSlice";
import { FunctionComponent } from "react";
import { AllDropsProps } from "../types/drops.types";

const AllDrops: FunctionComponent<AllDropsProps> = ({
  dispatch,
  allDrops,
  allDropsRedux,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-row justify-start items-start flex-wrap gap-3 overflow-y-scroll">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div
          className="relative w-fit h-fit bg-azul px-3 py-1.5 font-economica text-offBlack text-sm cursor-pointer active:scale-95"
          onClick={() => dispatch(setDropSwitcher("add"))}
        >
          new drop type
        </div>
      </div>
      {(allDrops.length < 1 ? allDropsRedux : allDrops).map(
        (value: any, index: number) => {
          return (
            <div
              className="relative w-40 h-40 flex items-center justify-center"
              key={index}
            >
              <div className="relative w-fit h-fit bg-azul px-3 py-1.5 font-economica text-offBlack text-sm cursor-pointer active:scale-95">
                new drop type
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default AllDrops;
