import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/image";
import { FunctionComponent } from "react";
import { Page404Props } from "./types/404.types";

const Page404: FunctionComponent<Page404Props> = ({ router }): JSX.Element => {
  return (
    <div
      className="relative w-full flex flex-col items-center justify-center gap-4"
      style={{ height: "calc(100vh - 10.5rem)" }}
    >
      <div className="relative w-full h-fit flex items-center justify-center font-earl text-white text-base sm:text-lg text-center row-start-1">
        Frequency out of range. <br />
        <br /> Scan your dial to try again.
      </div>
      <div
        className="relative flex items-center justify-center w-40 h-40 hover:rotate-3 active:rotate-6 row-start-2"
        onClick={() => router.push("/")}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY`}
          className="relative w-fit h-fit relative cursor-pointer"
          width={100}
          height={100}
          alt="dial"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default Page404;
