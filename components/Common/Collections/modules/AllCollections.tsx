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
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-row mid:justify-start mid:items-start items-center justify-center flex-wrap gap-8 overflow-y-scroll">
      <div className="relative w-40 h-40 sm:w-60 sm:h-60 flex items-center justify-center">
        <div
          className="relative w-fit h-fit bg-azul px-3 py-1.5 font-economica text-offBlack text-sm cursor-pointer active:scale-95"
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
              })
            );
            dispatch(setCollectionSwitcher("add"));
          }}
        >
          new collection type
        </div>
      </div>
      {(allCollections.length < 1 ? allCollectionsRedux : allCollections).map(
        (value: Collection, index: number) => {
          return (
            <div
              className="relative w-40 h-40 sm:w-60 sm:h-60 flex items-center justify-center border border-white cursor-pointer rounded-tr-lg rounded-bl-lg"
              id="staticLoad"
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
                      (val) => Number(val) / 10 ** 18
                    ),
                    actionDisabled: true,
                  })
                );
                dispatch(setCollectionSwitcher("add"));
              }}
            >
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
              <div className="relative w-full h-full bg-black/60 flex flex-col gap-2 p-3 rounded-tr-lg rounded-bl-lg">
                <div className="relative w-fit h-fit justify-end items-start flex flex-row gap-1 ml-auto">
                  <div
                    className={`relative w-full h-fit font-earl text-xs justify-center items-center flex ${
                      value.drop.name ? "text-verde" : "text-ama"
                    }`}
                  >
                    {value.drop.name ? "live" : "pending"}
                  </div>
                  <div className="relative w-full h-fit justify-center items-center flex animate-pulse">
                    <div
                      className={`relative h-2 w-2 rounded-full flex items-center justify-center ${
                        value.drop.name ? "bg-verde/50" : "bg-ama/50"
                      }`}
                    ></div>
                  </div>
                </div>
                <div className="relative w-full h-full items-center justify-center flex flex-col gap-2">
                  <div className="text-white text-sm sm:text-base font-earl flex items-center justify-center break-words text-center">
                    {value.name}
                  </div>
                  <div className="text-ama text-sm md:text-base font-earl flex items-center justify-center">
                    {Number(value?.tokenIds?.length) -
                      (value?.soldTokens?.length
                        ? value?.soldTokens?.length
                        : 0)}{" "}
                    / {Number(value?.tokenIds?.length)}
                  </div>
                  <div
                    className="relative w-fit h-8 py-2 px-3 bg-offBlack rounded-md border border-white text-white font-economica text-xs flex items-center justify-center"
                    onClick={
                      value.drop.name
                        ? (event) => {
                            event.stopPropagation();
                            window.open(
                              `http://www.chromadin.xyz/#collect?option=history?search=${value.name}`,
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
                    {value.drop.name ? "view on market" : "add to drop"}
                  </div>
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default AllCollections;
