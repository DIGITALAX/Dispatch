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
  deleteDrop,
  deleteDropLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col justify-start items-start text-white gap-4">
      <div
        className="relative w-fit h-fit items-center justify-start font-earl text-sm flex flex-row gap-2 opacity-70 cursor-pointer active:scale-95"
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
      <div className="relative w-full h-fit items-start justify-start font-earl text-xl">
        ADD DROP
      </div>
      <div className="relative w-full h-full flex flex-col gap-10 md:flex-row">
        <div className="relative w-full h-full flex flex-col gap-5">
          <div className="relative flex flex-col gap-2 w-1/2 h-fit">
            <div className="relative w-fit h-fit font-earl text-lg">
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
            <div className="relative w-fit h-fit font-earl text-lg">
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
              fileType={dropDetails.fileType}
            />
          </div>
          <div className="relative flex flex-col gap-2 w-full h-fit">
            <div className="relative w-fit h-fit font-earl text-lg">
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
          <div className="relative flex flex-row gap-2 w-fit h-fit items-center justify-start">
            <div className="relative flex flex-col gap-2 w-fit h-fit justify-start items-center">
              <ButtonAdd
                text={dropDetails.disabled ? "Add More" : "Add Drop"}
                functionAdd={dropDetails.disabled ? addMore : addDrop}
                loader={addDropLoading}
                width={"28"}
              />
            </div>
            <div className="relative flex flex-col gap-2 w-fit h-fit justify-start items-center">
              {dropDetails.type === "delete" && (
                <ButtonAdd
                  text={"Delete Drop"}
                  functionAdd={deleteDrop as any}
                  loader={deleteDropLoading}
                  width={"36"}
                />
              )}
            </div>
          </div>
          {dropDetails.disabled === true && (
            <div className="relative w-fit h-fit flex flex-col text-xs font-earl text-marip">
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
                        actionId: value.collectionId,
                        actionContractType: value.contractType,
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
                            {value?.drop?.name
                              ? "VIEW IN MARKET"
                              : "ADD TO DROP"}
                          </div>
                          <div
                            className="absolute w-fit h-fit items-center justify-center flex top-2 opacity-70"
                            id="pageBack"
                          >
                            {value?.drop?.name
                              ? "VIEW IN MARKET"
                              : "ADD TO DROP"}
                          </div>
                          <div className="relative w-fit h-fit items-center justify-center flex top-1">
                            {value?.drop?.name
                              ? "VIEW IN MARKET"
                              : "ADD TO DROP"}
                          </div>
                        </div>
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
