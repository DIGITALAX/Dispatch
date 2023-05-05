import { FunctionComponent } from "react";
import FillIn from "../../Inputs/modules/FillIn";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { CollectionPricesProps } from "../types/collections.types";

const CollectionPrices: FunctionComponent<CollectionPricesProps> = ({
  collectionDetails,
  handleCollectionPrices,
  loader,
}): JSX.Element => {
  return (
    <div className="relative flex flex-col gap-2 w-full h-fit font-earl">
      {Array.from([
        [
          "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
          "WMATIC",
          "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        ],
        [
          "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
          "WETH",
          "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        ],
        [
          "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
          "USDT",
          "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        ],
        [
          "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
          "MONA",
          "0x6968105460f67c3bf751be7c15f92f5286fd0ce5",
        ],
      ])
        .map((item: string[], index: number) => {
          if (
            collectionDetails?.acceptedTokens?.includes(item[2].toLowerCase())
          ) {
            const acceptedTokenIndex =
              collectionDetails.acceptedTokens.findIndex(
                (token) => token.toLowerCase() === item[2].toLowerCase()
              );

            return {
              ...item,
              price: String(
                collectionDetails?.tokenPrices?.[acceptedTokenIndex]
              ),
            };
          } else {
            return {
              ...item,
              price: "",
            };
          }
        })
        .map((value: string[], index: number) => {
          return (
            <div
              key={index}
              className="relative w-full h-fit flex flex-row gap-3 items-center justify-start"
            >
              <div className="relative w-7 h-10 flex rounded-full flex-col items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${value[0]}`}
                  draggable={false}
                  width={30}
                  height={35}
                  className="flex"
                />
              </div>
              <FillIn
                textArea={false}
                changeFunction={(e) => {
                  handleCollectionPrices(e, value[2]);
                }}
                type={"number"}
                width={
                  typeof window !== "undefined" && window.innerWidth > 950
                    ? "32"
                    : typeof window !== "undefined" && window.innerWidth > 768
                    ? "14"
                    : typeof window !== "undefined" && window.innerWidth > 480
                    ? "40"
                    : "14"
                }
                defaultValue={(value as any).price}
                loader={loader}
                disabled={collectionDetails?.disabled}
              />
              <div className="relative w-fit h-fit flex items-center justify-center text-xs">
                {value[1]}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CollectionPrices;
