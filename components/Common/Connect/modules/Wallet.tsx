import { FunctionComponent } from "react";
import { WalletProps } from "../types/connect.types";

const Wallet: FunctionComponent<WalletProps> = ({
  handleTransaction,
  buttonText,
}): JSX.Element => {
  return (
    <div
      className={`relative w-40 h-10 font-earl text-white border-greenG border rounded-tl-lg rounded-br-lg flex flex-row items-center px-2 cursor-pointer text-sm bg-black`}
      onClick={() => handleTransaction()}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {buttonText}
      </div>
    </div>
  );
};

export default Wallet;
