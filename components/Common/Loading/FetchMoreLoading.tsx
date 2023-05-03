import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { LoadingProps } from "./types/loading.types";

const FetchMoreLoading: FunctionComponent<LoadingProps> = ({
  size,
  height,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center py-3`}
      style={{ height: height }}
    >
      <div
        className={`relative flex items-center justify-center animate-spin`}
        style={{ height: size, width: size }}
      >
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY`}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default FetchMoreLoading;
