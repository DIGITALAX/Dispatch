import { setDropSwitcher } from "@/redux/reducers/dropSwitcherSlice";
import { FunctionComponent } from "react";
import { AllDropsProps, Drop } from "../types/drops.types";
import { setDropDetails } from "@/redux/reducers/dropDetailsSlice";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";

const AllDrops: FunctionComponent<AllDropsProps> = ({
  dispatch,
  allDrops,
  allDropsRedux,
  dropsLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-row mid:justify-start mid:items-start items-center justify-center flex-wrap gap-8 overflow-y-scroll">
      <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
        <div
          className="relative w-fit h-fit bg-azul px-3 py-1.5 font-economica text-offBlack text-sm cursor-pointer active:scale-95"
          onClick={() => {
            dispatch(setDropSwitcher("add"));
            dispatch(
              setDropDetails({
                actionTitle: "Drop Title",
                actionImage: "",
                actionCollectionIds: [],
                actionDisabled: false,
              })
            );
          }}
        >
          new drop type
        </div>
      </div>
      {dropsLoading
        ? Array.from({ length: 9 }).map((_, index: number) => {
            return (
              <div
                className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center border border-white cursor-pointer rounded-tr-lg rounded-bl-lg"
                id="staticLoad"
                key={index}
              >
                <div className="relative w-full h-full bg-black/60 flex flex-col gap-2 p-3 rounded-tr-lg rounded-bl-lg"></div>
              </div>
            );
          })
        : (allDrops.length < 1 ? allDropsRedux : allDrops).map(
            (value: Drop, index: number) => {
              return (
                <div
                  className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center border border-white cursor-pointer rounded-tr-lg rounded-bl-lg"
                  id="staticLoad"
                  key={index}
                  onClick={() => {
                    dispatch(
                      setDropDetails({
                        actionTitle: value.uri.name,
                        actionImage: value.uri.image,
                        actionCollectionIds: value.collectionIds,
                        actionDisabled: true,
                        actionId: value.dropId,
                      })
                    );
                    dispatch(setDropSwitcher("add"));
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
                        className={`relative w-full h-fit font-earl text-xs justify-center items-center flex text-verde`}
                      >
                        live
                      </div>
                      <div className="relative w-full h-fit justify-center items-center flex animate-pulse">
                        <div
                          className={`relative h-2 w-2 rounded-full flex items-center justify-center bg-verde/50`}
                        ></div>
                      </div>
                    </div>
                    <div className="relative w-full h-full items-center justify-center flex flex-col gap-2">
                      <div className="text-white text-sm sm:text-base font-earl flex items-center justify-center break-words text-center">
                        {value?.uri?.name}
                      </div>
                      <div className="text-ama text-sm md:text-base font-earl flex items-center justify-center">
                        {Number(value?.collectionIds.length)} Collections
                      </div>
                      <div className="relative w-full h-fit flex flex-row gap-2 items-center justify-center flex-wrap">
                        <div
                          className="relative w-fit h-8 py-2 px-3 bg-offBlack rounded-md border border-white text-white font-economica text-xs flex items-center justify-center"
                          onClick={(event) => {
                            event.stopPropagation();
                            window.open(
                              `http://www.chromadin.xyz/#collect?option=history?search=${value?.uri?.name}`,
                              "_blank"
                            );
                          }}
                        >
                          view on market
                        </div>
                        <div
                          className="relative w-fit h-8 py-2 px-3 bg-offBlack rounded-md border border-white text-white font-economica text-xs flex items-center justify-center"
                          onClick={(event) => {
                            event.stopPropagation();
                            dispatch(
                              setDropDetails({
                                actionTitle: value.uri.name,
                                actionImage: value.uri.image,
                                actionCollectionIds: value.collectionIds,
                                actionDisabled: true,
                                actionId: value.dropId,
                              })
                            );
                            dispatch(setDropSwitcher("add"));
                          }}
                        >
                          add more
                        </div>
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

export default AllDrops;
