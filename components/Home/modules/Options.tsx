import { setPage } from "@/redux/reducers/pageSlice";
import { FunctionComponent } from "react";
import { OptionsProps } from "../types/home.types";

const Options: FunctionComponent<OptionsProps> = ({
  dispatch,
  handle,
}): JSX.Element => {
  return (
    <div className="relative w-full mid:w-fit h-full flex flex-row mid:flex-col gap-5 items-start mid:items-center justify-center text-center sm:flex-nowrap flex-wrap">
      {Array.from([
        "collections",
        "drops",
        "token gated",
        "sales",
        "autograph",
        "fulfillment",
      ]).map((label: string, index: number) => {
        return (
          <div
            key={index}
            className={`relative w-16 h-fit gap-2 flex flex-col items-center justify-center ${
              (index === 5 || (index === 4 && !handle)) && "opacity-60"
            }`}
            onClick={
              index === 4 && handle
                ? () =>
                    window.open(
                      `https://www.chromadin.xyz/autograph/${
                        handle?.split(".lens")[0]
                      }`
                    )
                : index !== 5 && index !== 4
                ? () => dispatch(setPage(label))
                : () => {}
            }
          >
            <div
              id="option"
              className={`relative w-12 h-12 flex border border-white rounded-br-xl rounded-bl-xl bg-midi rounded-tl-lg ${
                ((index !== 5 && index !== 4) || (index === 4 && handle)) &&
                "cursor-pointer active:scale-95 hover:opacity-70"
              }`}
            ></div>
            <div className="relative w-fit h-fit font-earl text-white text-sm break-words">
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Options;
