import { setCollectionSwitcher } from "@/redux/reducers/collectionSwitcherSlice";
import { FunctionComponent } from "react";
import { AllCollectionsProps, Collection } from "../types/collections.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { setCollectionDetails } from "@/redux/reducers/collectionDetailsSlice";
import { setPage } from "@/redux/reducers/pageSlice";
import { setDropSwitcher } from "@/redux/reducers/dropSwitcherSlice";

const AllCollections: FunctionComponent<AllCollectionsProps> = ({
  dispatch,
  allCollections,
  allCollectionsRedux,
  collectionsLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-row mid:justify-start mid:items-start items-center justify-center flex-wrap gap-8 overflow-y-scroll">
      <div className="relative w-52 h-60 sm:w-60 sm:h-72 flex items-center justify-center">
        <div
          className="relative w-fit h-fit bg-marip px-3 py-1.5 font-earl text-black rounded-tr-lg rounded-bl-lg text-sm cursor-pointer active:scale-95"
          onClick={() => {
            dispatch(
              setCollectionDetails({
                actionTitle: "Collection Title",
                actionDescription: "Collection Description :)",
                actionImage: "",
                actionAmount: 1,
                actionAcceptedTokens: [],
                actionTokenPrices: [],
                actionDisabled: false,
                actionFileType: "",
                actionType: "add",
                actionId: 0,
              
              })
            );
            dispatch(setCollectionSwitcher("add"));
          }}
        >
          new collection type
        </div>
      </div>
      {collectionsLoading
        ? Array.from({ length: 9 })?.map((_, index: number) => {
            return (
              <div
                className="relative w-52 h-60 sm:w-60 sm:h-72 flex items-center justify-center border border-white cursor-pointer rounded-tr-lg rounded-bl-lg"
                id="staticLoad"
                key={index}
              >
                <div className="relative w-full h-full bg-black/60 flex flex-col gap-2 p-3 rounded-tr-lg rounded-bl-lg"></div>
              </div>
            );
          })
        : (allCollections?.length < 1
            ? allCollectionsRedux
            : allCollections
          )?.map((value: Collection, index: number) => {
            return (
              <div
                className="relative w-52 h-60 sm:w-60 sm:h-72 flex items-center justify-center bg-black p-3 border border-white cursor-pointer rounded-tr-lg rounded-bl-lg"
                key={index}
                onClick={() => {
                  dispatch(
                    setCollectionDetails({
                      actionTitle: value.name,
                      actionDescription: value.uri.description,
                      actionImage: value.uri.image,
                      actionAmount: value.amount,
                      actionAcceptedTokens: value.acceptedTokens,
                      actionTokenPrices: value.basePrices.map(
                        (val: any, i: number) =>
                          Number(val) /
                          (value.acceptedTokens.indexOf(
                            "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
                          ) === i
                            ? 10 ** 6
                            : 10 ** 18)
                      ),
                      actionDisabled: true,
                      actionFileType: value.fileType,
                      actionType: "delete",
                      actionId: value.collectionId,
                     
                    })
                  );
                  dispatch(setCollectionSwitcher("add"));
                  dispatch(setPage("collections"));
                }}
              >
                <div className="relative w-full h-full flex rounded-tr-lg flex-col rounded-bl-lg items-center justify-center">
                  <div className="relative w-full h-full flex flex-col gap-2 items-center justify-center">
                    <div className="relative w-full h-full gap-2 flex flex-col items-center justify-center">
                      <div className="absolute w-full h-full bg-cover">
                        <Image
                          src={
                            value?.uri?.image?.includes("ipfs://")
                              ? `${INFURA_GATEWAY}/ipfs/${
                                  value?.uri?.image?.split("ipfs://")[1]
                                }`
                              : `${INFURA_GATEWAY}/ipfs/${value?.uri?.image}`
                          }
                          layout="fill"
                          objectFit="cover"
                          objectPosition={"top"}
                          className="rounded-tr-lg rounded-bl-lg flex w-full h-full"
                        />
                      </div>
                      <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/60 border-2 border-lily">
                        <div className="relative w-fit h-fit justify-end items-start flex flex-row gap-1 ml-auto p-2">
                          <div
                            className={`relative w-full h-fit font-earl text-xs justify-center items-center flex text-greenG ${
                              value?.drop?.name ? "text-greenG" : "text-marip"
                            }`}
                          >
                            {value?.drop?.name ? "LIVE" : "PENDING"}
                          </div>
                          <div className="relative w-full h-fit justify-center items-center flex animate-pulse">
                            <div
                              className={`relative h-2 w-2 rounded-full flex items-center justify-center bg-greenG/80 ${
                                value?.drop?.name
                                  ? "bg-greenG/80"
                                  : "bg-marip/80"
                              }`}
                            ></div>
                          </div>
                        </div>
                        <div className="relative w-full h-full items-center justify-center flex flex-col gap-2">
                          <div className="text-white text-xs font-chill flex items-center justify-center h-fit bg-black border border-lily p-2 break-words text-center uppercase">
                            <div id="itemBack">{value?.name}</div>
                          </div>
                          <div className="text-marip text-sm uppercase font-chill flex items-center justify-center bg-black border border-lily p-2">
                            <div id="itemBack">
                              {Number(value?.tokenIds?.length) -
                                (value?.soldTokens?.length
                                  ? value?.soldTokens?.length
                                  : 0)}{" "}
                              / {Number(value?.tokenIds?.length)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative w-full h-fit flex flex-row gap-2 items-center justify-center flex-wrap">
                      <div
                        className="relative w-full h-10 py-2 px-3 border-2 border-lily text-white font-earl text-base flex items-center justify-center bg-pos flex-col"
                        onClick={
                          value?.drop?.name
                            ? (event) => {
                                event.stopPropagation();
                                window.open(
                                  `http://www.chromadin.xyz/#collect?option=history?search=${value?.name}`,
                                  "_blank"
                                );
                              }
                            : (event) => {
                                event.stopPropagation();
                                dispatch(setDropSwitcher("drops"));
                                dispatch(setPage("drops"));
                              }
                        }
                      >
                        <div
                          className="absolute w-fit h-fit items-center justify-center flex top-1 opacity-50"
                          id="pageBack"
                        >
                          {value?.drop?.name ? "VIEW IN MARKET" : "ADD TO DROP"}
                        </div>
                        <div
                          className="absolute w-fit h-fit items-center justify-center flex top-2 opacity-70"
                          id="pageBack"
                        >
                          {value?.drop?.name ? "VIEW IN MARKET" : "ADD TO DROP"}
                        </div>
                        <div className="relative w-fit h-fit items-center justify-center flex top-1">
                          {value?.drop?.name ? "VIEW IN MARKET" : "ADD TO DROP"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default AllCollections;
