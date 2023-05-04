/* eslint-disable react/jsx-no-comment-textnodes */
import { FunctionComponent } from "react";
import FillIn from "../../Inputs/modules/FillIn";
import ImageUpload from "../../Inputs/modules/ImageUpload";
import ButtonAdd from "../../Inputs/modules/ButtonAdd";
import { AddDropProps } from "../types/drops.types";
import { setDropSwitcher } from "@/redux/reducers/dropSwitcherSlice";
import { BsRewindFill } from "react-icons/bs";
import DropDown from "../../Inputs/modules/DropDown";
import { setCollectionDetails } from "@/redux/reducers/collectionDetailsSlice";
import { setCollectionSwitcher } from "@/redux/reducers/collectionSwitcherSlice";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { setPage } from "@/redux/reducers/pageSlice";

const AddDrop: FunctionComponent<AddDropProps> = ({
  imageLoading,
  uploadImage,
  addDrop,
  addDropLoading,
  handleDropTitle,
  dispatch,
  availableCollectionIds,
  chosenCollections,
  setChosenCollections,
  open,
  setOpen,
  setImageLoading,
  dropDetails,
  allCollections,
  alreadyInDrop,
  addMore,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col justify-start items-start text-white gap-4">
      <div
        className="relative w-fit h-fit items-center justify-start font-economicaB text-sm flex flex-row gap-2 opacity-70 cursor-pointer active:scale-95"
        onClick={() => {
          dispatch(setDropSwitcher("drops"));
          setOpen(false);
        }}
      >
        <div className="relative w-fit h-fit">
          <BsRewindFill color="white" size={15} />
        </div>
        <div className="relative w-fit h-fit justify-start items-center flex">
          return
        </div>
      </div>
      <div className="relative w-full h-fit items-start justify-start font-economicaB text-xl">
        ADD DROP
      </div>
      <div className="relative w-full h-full flex flex-col gap-10 md:flex-row">
        <div className="relative w-full h-full flex flex-col gap-5">
          <div className="relative flex flex-col gap-2 w-1/2 h-fit">
            <div className="relative w-fit h-fit font-economica text-lg">
              Drop Name
            </div>
            <FillIn
              textArea={false}
              changeFunction={(e) => handleDropTitle(e)}
              type="string"
              width="full"
              defaultValue={dropDetails.title}
              loader={addDropLoading}
              disabled={dropDetails.disabled}
            />
          </div>
          <div className="relative flex flex-col gap-2 w-1/2 h-fit">
            <div className="relative w-fit h-fit font-economica text-lg">
              Drop Poster
            </div>
            <ImageUpload
              image={dropDetails.image}
              imageLoading={imageLoading}
              uploadImage={uploadImage}
              loaderGeneral={addDropLoading}
              setImageLoading={setImageLoading}
              type="drop"
              disabled={dropDetails.disabled}
            />
          </div>
          <div className="relative flex flex-col gap-2 w-full h-fit">
            <div className="relative w-fit h-fit font-economica text-lg">
              Choose Collections
            </div>
            <DropDown
              values={availableCollectionIds}
              chosen={chosenCollections}
              setChosen={setChosenCollections}
              open={open}
              setOpen={setOpen}
              alreadyInDrop={alreadyInDrop}
              disabled={dropDetails.disabled}
            />
          </div>
          <div className="relative flex flex-col gap-2 w-fit h-fit justify-start items-center">
            <ButtonAdd
              text={dropDetails.disabled ? "Add More" : "Add Drop"}
              functionAdd={dropDetails.disabled ? addMore : addDrop}
              loader={addDropLoading}
              width={"28"}
              type="drop"
            />
          </div>
          {dropDetails.disabled === true && (
            <div className="relative w-fit h-fit flex flex-col text-xs font-earl text-ama">
              (Add One New Collection At A Time)
            </div>
          )}
        </div>
        <div className="relative w-full h-fit max-h-full flex flex-row overflow-x-scroll gap-8 flex-wrap overflow-y-scroll">
          {allCollections
            ?.filter((cd) =>
              (dropDetails?.collectionIds as any).includes(cd?.collectionId)
            )
            .map((value: any, index: number) => {
              return (
                <div
                  className="relative w-44 h-44 flex items-center justify-center border border-white cursor-pointer rounded-tr-lg rounded-bl-lg"
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
                          (val: any) => Number(val) / 10 ** 18
                        ),
                        actionDisabled: true,
                      })
                    );
                    dispatch(setCollectionSwitcher("add"));
                    dispatch(setPage("collections"));
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
                          value?.drop?.name ? "text-verde" : "text-ama"
                        }`}
                      >
                        {value?.drop?.name ? "live" : "pending"}
                      </div>
                      <div className="relative w-full h-fit justify-center items-center flex animate-pulse">
                        <div
                          className={`relative h-2 w-2 rounded-full flex items-center justify-center ${
                            value?.drop?.name ? "bg-verde/50" : "bg-ama/50"
                          }`}
                        ></div>
                      </div>
                    </div>
                    <div className="relative w-full h-full items-center justify-center flex flex-col gap-2">
                      <div className="text-white text-sm sm:text-base font-earl flex items-center justify-center break-words text-center">
                        {value?.name}
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
                        {value?.drop?.name ? "view on market" : "add to drop"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AddDrop;
