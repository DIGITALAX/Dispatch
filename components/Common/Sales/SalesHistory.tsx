import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import moment from "moment";
import Image from "next/legacy/image";
import Link from "next/link";
import { FunctionComponent } from "react";
import { Sales, SalesHistoryProps } from "./types/sales.types";

const SalesHistory: FunctionComponent<SalesHistoryProps> = ({
  salesLoading,
  salesReducer,
  sales,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col sm:flex-row items-start justify-end gap-4">
      {salesLoading ? (
        <div className="relative w-full h-fit flex flex-row mid:justify-start mid:items-start items-center justify-center flex-wrap gap-8 overflow-y-scroll sm:order-1 order-2">
          {Array.from({ length: 7 }).map((_: any, index: number) => {
            return (
              <div
                className="relative w-52 h-60 sm:w-60 sm:h-72 flex items-center justify-center border border-white cursor-pointer rounded-tr-lg rounded-bl-lg"
                id="staticLoad"
                key={index}
              >
                <div className="relative w-full h-full bg-black/60 flex flex-col gap-2 p-3 rounded-tr-lg rounded-bl-lg"></div>
              </div>
            );
          })}
        </div>
      ) : sales?.length === 0 && salesReducer?.length === 0 ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center font-earl text-moda text-center p-3 text-white sm:order-1 order-2">
          looking good. what did you see on the streams today?
        </div>
      ) : (
        <div className="relative w-full h-fit flex flex-row mid:justify-start mid:items-start items-center justify-center flex-wrap gap-8 overflow-y-scroll sm:order-1 order-2">
          {(sales.length < 1 ? salesReducer : sales)?.map(
            (value: Sales, index: number) => {
              const pfp = createProfilePicture(value.profile);
              return (
                <Link
                  className="relative w-52 h-60 sm:w-60 sm:h-72 flex items-center justify-center bg-black p-3 border border-white cursor-pointer rounded-tr-lg rounded-bl-lg"
                  key={index}
                  target={"_blank"}
                  rel={"noreferrer"}
                  href={`https://polygonscan.com/tx/${value.transactionHash}`}
                >
                  <div className="relative w-full h-full flex rounded-tr-lg flex-col rounded-bl-lg items-center justify-center">
                    <div className="relative w-full h-full flex flex-col gap-2 items-center justify-center">
                      <div className="relative w-full h-full gap-2 flex flex-col items-center justify-center">
                        <div className="absolute w-full h-full bg-cover">
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/${
                              value?.uri?.json?.image?.includes("ipfs://")
                                ? value?.uri?.json?.image?.split("ipfs://")[1]
                                : value?.uri?.json?.image
                            }`}
                            layout="fill"
                            objectFit="cover"
                            objectPosition={"top"}
                            className="rounded-tr-lg rounded-bl-lg flex w-full h-full"
                          />
                        </div>
                        <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/60 border-2 border-lily">
                          <div className="relative w-full h-full items-center justify-center flex flex-col gap-2">
                            <div className="text-white text-xs font-chill flex items-center justify-center h-fit bg-black border border-lily p-2 break-words text-center uppercase">
                              <div id="itemBack">{value?.uri?.json?.name}</div>
                            </div>
                            <div className="text-marip text-sm uppercase font-chill flex items-center justify-center bg-black border border-lily p-2">
                              <div className="relative flex flex-col w-full preG:w-fit lg:w-full h-full gap-2 items-start justify-center">
                                <div className="relative text-moda font-arcade flex items-center justify-start text-sm w-fit h-fit">
                                  {value.transactionHash.slice(0, 14) + "..."}
                                </div>
                                <div className="relative text-white font-arcade flex items-center justify-start text-sm w-fit h-fit">
                                  {Number(value.totalPrice) /
                                    (value.type ===
                                    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
                                      ? 10 ** 6
                                      : 10 ** 18)}{" "}
                                  {value.type ===
                                  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
                                    ? "USDT"
                                    : value.type ===
                                      "0x6968105460f67c3bf751be7c15f92f5286fd0ce5"
                                    ? "MONA"
                                    : value.type ===
                                      "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
                                    ? "WMATIC"
                                    : "WETH"}
                                </div>
                                <div className="relative text-verde font-arcade flex items-center justify-start text-xs w-fit h-fit">
                                  {moment(
                                    Number(value.blockTimestamp),
                                    "X"
                                  ).format("lll")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      )}
      {sales.length < 1 && salesReducer.length < 1 && (
        <div className="relative w-full sm:w-80 h-80 sm:h-184 lg:h-full flex p-2 border-2 border-white sm:order-2 order-1">
          <div className="relative w-full h-full">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmSgc4gyyrYdy2kyZxnMa2CexXXwVmUjE5aZzrQr8mygVB`}
              layout="fill"
              objectFit="cover"
              objectPosition={"center"}
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
