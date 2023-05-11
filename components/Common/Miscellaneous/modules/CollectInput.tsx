import { FormEvent, FunctionComponent } from "react";
import { CollectInputProps } from "./types/buttons.types";

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
}): JSX.Element => {
  return (
    <div
      className={`relative w-fit h-fit grid grid-flow-row auto-rows-auto row-start-${row} col-start-${col} text-black font-arcade text-xs justify-self-start gap-2 pr-2 self-start`}
    >
      <div className="relative w-fit h-fit row-start-1 font-arcade text-white text-xs whitespace-pre-wrap break-words sm:whitespace-nowrap justify-self-start self-center text-left">
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
        className={`relative w-20 bg-white text-offBlack h-10 row-start-2 rounded-md p-1.5 font-arcade justify-self-start self-center caret-transparent`}
        onChange={(e: FormEvent) =>
          handleValueChange((e?.target as HTMLFormElement)?.value)
        }
      />
    </div>
  );
};

export default CollectInput;
