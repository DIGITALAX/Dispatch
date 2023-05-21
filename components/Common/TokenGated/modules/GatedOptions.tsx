import { FunctionComponent } from "react";
import { GatedOptionsProps } from "../types/allPosts.types";
import { Collection } from "../../Collections/types/collections.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";

const GatedOptions: FunctionComponent<GatedOptionsProps> = ({
  collections,
  setTokenIds,
  tokenIds,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-wrap gap-4 justify-center">
      {collections?.map((coll: Collection, index: number) => {
        return (
          <div
            key={index}
            className={`relative w-48 h-60 flex flex-col items-center justify-center bg-offBlack p-3 border border-marip cursor-pointer rounded-tr-lg rounded-bl-lg cursor-pointer active:scale-95 gap-3 ${
              tokenIds.includes(coll.collectionId)
                ? "opacity-100"
                : "opacity-60"
            } `}
            onClick={() => {
              const tokenValue = coll.collectionId;
              if (tokenIds.includes(tokenValue)) {
                setTokenIds(
                  tokenIds.filter((tokenId) => tokenId !== tokenValue)
                );
              } else {
                setTokenIds([...tokenIds, tokenValue]);
              }
            }}
          >
            <div className="relative w-full h-full flex flex-col">
              <div className="absolute object-cover w-full h-full flex">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    coll.uri.image?.split("ipfs://")[1]
                  }`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md flex w-full h-full"
                />
              </div>
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div className="relative w-3/4 h-fit items-center justify-center border border-orr flex flex-row gap-1 p-2 bg-offBlack/80">
                  <div
                    className={`relative w-fit h-fit font-earl text-xs justify-center items-center flex text-greenG text-white text-center`}
                  >
                    {coll.name}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-col gap-1.5">
              <div className="relative h-1.5 w-full bg-vv"></div>
              <div className="relative h-3 w-full bg-tt"></div>
              <div className="relative h-5 w-full bg-bb"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GatedOptions;
