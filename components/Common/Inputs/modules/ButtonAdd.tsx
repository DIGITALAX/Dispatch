import { FunctionComponent } from "react";
import { ButtonAddProps } from "../types/inputs.types";
import { AiOutlineLoading } from "react-icons/ai";

const ButtonAdd: FunctionComponent<ButtonAddProps> = ({
  text,
  functionAdd,
  loader,
  width,
  disabled,
}): JSX.Element => {
  return (
    <div
      className={`relative w-${width} h-10 bg-marip border border-black font-earl text-center text-lunar rounded-tl-lg rounded-br-lg flex items-center justify-center px-4 py-1.5 text-sm ${
        !loader && !disabled && "cursor-pointer active:scale-95"
      }`}
      onClick={loader || disabled ? () => {} : () => functionAdd()}
    >
      <div
        className={`relative w-fit h-fit flex items-center justify-center ${
          loader && "animate-spin"
        }`}
      >
        {loader ? <AiOutlineLoading color="#131313" size={10} /> : text}
      </div>
    </div>
  );
};

export default ButtonAdd;
