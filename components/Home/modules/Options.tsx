import { setPage } from "@/redux/reducers/pageSlice";
import { FunctionComponent } from "react";
import { OptionsProps } from "../types/home.types";

const Options: FunctionComponent<OptionsProps> = ({
  dispatch,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-full flex flex-col gap-8 items-center justify-center text-center">
      {Array.from([
        "drops",
        "token gated",
        "fulfillment",
        "messaging",
        "drafts",
      ]).map((label: string, index: number) => {
        return (
          <div
            key={index}
            className={`relative w-fit h-fit gap-2 flex flex-col items-center justify-center ${
              index !== 0 && index !== 1 && "opacity-60"
            }`}
            onClick={
              index === 0 || index === 1
                ? () => dispatch(setPage(label))
                : () => {}
            }
          >
            <div
              className={`relative w-14 h-12 flex rounded-xl bg-azul ${
                (index === 0 || index === 1) &&
                "cursor-pointer active:scale-95 hover:opacity-70"
              }`}
            ></div>
            <div className="relative w-fit h-fit font-earl text-white text-sm">
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Options;
