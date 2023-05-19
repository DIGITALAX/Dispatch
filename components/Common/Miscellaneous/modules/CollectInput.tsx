import { FormEvent, FunctionComponent } from "react";
import { CollectInputProps } from "../types/misc.types";

const CollectInput: FunctionComponent<CollectInputProps> = ({
  id,
  name,
  step,
  min,
  placeholder,
  defaultValue,
  col,
  row,
  label,
  handleValueChange,
  gated,
}): JSX.Element => {
  return (
    <div
      className={`relative w-fit h-fit grid grid-flow-row auto-rows-auto row-start-${row} col-start-${col} text-black font-arcade text-xs ${
        !gated
          ? "justify-self-start self-start"
          : "sm:justify-self-start sm:self-start"
      }  gap-2 ${gated ? "pb-2 sm:py-0 preG:pr-3" : "pr-2"}`}
    >
      <div
        className={`relative w-fit h-fit row-start-1 font-arcade text-white text-xs whitespace-pre-wrap break-words sm:whitespace-nowrap text-left ${
          !gated
            ? "justify-self-start self-center pt-1 sm:pt-0"
            : "sm:justify-self-start sm:self-start"
        }`}
      >
        {label}
      </div>
      <input
        type="number"
        id={id}
        name={name}
        min={min}
        required
        step={step}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`relative ${
          gated
            ? "w-24 h-14 rounded-tr-lg rounded-bl-lg"
            : "w-20 h-10 rounded-md"
        } bg-white text-offBlack row-start-2 p-1.5 font-arcade justify-self-start self-center caret-transparent`}
        onChange={(e: FormEvent) =>
          handleValueChange((e?.target as HTMLFormElement)?.value)
        }
      />
    </div>
  );
};

export default CollectInput;
