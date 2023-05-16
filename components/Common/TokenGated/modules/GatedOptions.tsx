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
    <div className="relative w-full h-fit flex flex-wrap gap-4">
      {collections?.map((coll: Collection, index: number) => {
        return (
          <div
            key={index}
            className={`relative w-28 h-28 rounded-md border-white cursor-pointer active:scale-95 ${
              tokenIds.includes(coll.collectionId) && "border border-white"
            }`}
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
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${
                coll.uri.image.split("ipfs://")[1]
              }`}
              layout="fill"
              objectFit="cover"
              className="rounded-md flex w-full h-full"
            />
          </div>
        );
      })}
    </div>
  );
};

export default GatedOptions;
