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
    <div className="relative w-full h-full flex flex-row items-start justify-end gap-4">
      {salesLoading ? (
        <div className="relative w-full h-full flex flex-col overflow-y-scroll gap-8 preG:gap-4 lg:gap-8 p-3 lg:flex-nowrap flex-nowrap preG:flex-wrap opacity-30 animate-pulse">
          {Array.from({ length: 7 }).map((_: any, index: number) => {
            return (
              <div
                key={index}
                className="relative w-full preG:w-fit lg:w-full h-full preG:h-fit lg:h-full flex flex-row gap-3 cursor-pointer items-center justify-center"
              >
                <div
                  className="flex relative w-36 h-24 rounded-lg"
                  id="staticLoad"
                ></div>
                <div className="relative flex flex-col w-full preG:w-fit lg:w-full h-full gap-2 items-start justify-center">
                  <div className="relative w-fit h-fit flex flex-row gap-2">
                    <div
                      className="relative w-6 h-6 border border-white flex justify-start items-center rounded-full"
                      id="crt"
                    ></div>
                    <div className="relative w-fit h-fit text-ama font-arcade text-sm">
                      @TboPcMv^&fN
                    </div>
                  </div>
                  <div className="relative text-moda font-arcade flex items-center justify-start text-sm w-fit h-fit">
                    boPH!lPnPcMv^&fN...
                  </div>
                  <div className="relative text-white font-arcade flex items-center justify-start text-sm w-fit h-fit">
                    $H!lPn&bQ@f
                  </div>
                  <div className="relative text-verde font-arcade flex items-center justify-start text-xs w-fit h-fit">
                    v^&fNboPH!lPnN
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : sales?.length !== 0 && salesReducer?.length !== 0 ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center font-earl text-moda text-center p-3 text-white">
          looking good. what did you see on the streams today?
        </div>
      ) : (
        <div className="relative w-full h-fit flex flex-row mid:justify-start mid:items-start items-center justify-center flex-wrap gap-8 overflow-y-scroll">
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
                              value?.uri?.json?.image?.split("ipfs://")[1]
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
                                  $
                                  {Number(value.totalPrice) /
                                    (value.type ===
                                    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
                                      ? 10 ** 6
                                      : 10 ** 18)}
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
        <div className="relative w-80 h-full flex p-2 border-2 border-white">
          <div className="relative w-full h-full">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmSgc4gyyrYdy2kyZxnMa2CexXXwVmUjE5aZzrQr8mygVB`}
              layout="fill"
              objectFit="cover"
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
