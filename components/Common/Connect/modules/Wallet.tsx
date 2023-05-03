import { FunctionComponent } from "react";
import { WalletProps } from "../types/connect.types";

const Wallet: FunctionComponent<WalletProps> = ({
  handleTransaction,
  isConnected,
  buttonText,
  router
}): JSX.Element => {
  return (
    <div
      className={`relative w-40 h-10 font-earl text-white border-white border rounded-tl-lg rounded-br-lg flex flex-row items-center px-2 cursor-pointer text-sm ${
        isConnected && router.asPath.includes("dashboard") ? "bg-lensLight/70" : "bg-offBlack"
      }`}
      onClick={() => handleTransaction()}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {buttonText}
      </div>
    </div>
  );
};

export default Wallet;
