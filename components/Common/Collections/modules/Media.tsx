import { FunctionComponent } from "react";
import CollectionPreview from "./CollectionPreview";
import CollectionPrices from "./CollectionPrices";
import { setUpdateCollection } from "@/redux/reducers/updateCollectionSlice";
import FillIn from "../../Inputs/modules/FillIn";
import ImageUpload from "../../Inputs/modules/ImageUpload";
import ButtonAdd from "../../Inputs/modules/ButtonAdd";
import { BsRewindFill } from "react-icons/bs";
import { ImageProps } from "../types/collections.types";
import { setCollectionTypeSwitcher } from "@/redux/reducers/collectionTypeSlice";
import AudioUpload from "../../Inputs/modules/AudioUpload";
import { setCollectionSwitcher } from "@/redux/reducers/collectionSwitcherSlice";

const Media: FunctionComponent<ImageProps> = ({
  imageLoading,
  uploadImage,
  addCollection,
  addCollectionLoading,
  dispatch,
  handleCollectionTitle,
  handleCollectionDescription,
  setImageLoading,
  handleCollectionPrices,
  handleCollectionAmount,
  collectionDetails,
  setPrice,
  price,
  deleteCollection,
  deleteCollectionLoading,
  canEditCollection,
  collectionType,
  audioLoading,
  setAudioLoading,
  uploadAudio,
  videoRef,
  videoAudio,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col justify-start items-start text-white gap-4">
      <div
        className="relative w-fit h-fit items-center justify-start font-earl text-sm flex flex-row gap-2 opacity-70 cursor-pointer active:scale-95"
        onClick={() => {
          dispatch(setCollectionSwitcher("all"));
          dispatch(setCollectionTypeSwitcher("choice"));
        }}
      >
        <div className="relative w-fit h-fit ">
          <BsRewindFill color="white" size={15} />
        </div>
        <div className="relative w-fit h-fit justify-start items-center flex">
          return
        </div>
      </div>
      <div className="relative w-fit h-fit items-start justify-start font-earl text-xl">
        ADD COLLECTION
      </div>
      <div className="relative w-full h-full flex flex-col mode:flex-row gap-4 mid:gap-10">
        <div className="relative w-full mid:w-1/2 h-fit flex gap-5 flex-col mode:order-1 order-2">
          <div className="relative flex flex-col gap-2 w-full h-fit">
            <div className="relative w-fit h-fit font-earl text-lg">
              Collection Name
            </div>
            <FillIn
              textArea={false}
              changeFunction={(e) => handleCollectionTitle(e)}
              type={"string"}
              width="full"
              defaultValue={collectionDetails?.title}
              loader={addCollectionLoading}
              disabled={!canEditCollection && collectionDetails?.disabled}
            />
          </div>
          <div className="relative flex flex-col gap-2 w-full h-fit">
            <div className="relative w-fit h-fit font-earl text-lg">
              Collection Description
            </div>
            <FillIn
              textArea={true}
              changeFunction={(e) => handleCollectionDescription(e)}
              width="full"
              defaultValue={collectionDetails?.description}
              loader={addCollectionLoading}
              disabled={!canEditCollection && collectionDetails?.disabled}
            />
          </div>
          <div className="relative flex flex-col new:flex-row w-full h-full items-start justify-start gap-5 new:gap-10 new:pb-0 pb-5">
            <div className="relative w-full mode:w-fit mid:w-full h-full flex flex-col gap-5">
              <div className="relative flex flex-col gap-2 w-fit mid:w-full h-fit">
                <div className="relative w-fit h-fit font-earl text-lg">
                  {collectionType === "audio/mpeg" ||
                  collectionDetails?.fileType === "audio/mpeg"
                    ? "Collection Track"
                    : "Collection Art"}
                </div>
                {collectionType === "audio/mpeg" ||
                collectionDetails?.fileType === "audio/mpeg" ||
                collectionDetails?.audio ? (
                  <AudioUpload
                    image={collectionDetails.image}
                    imageLoading={imageLoading}
                    uploadImage={uploadImage}
                    loaderGeneral={addCollectionLoading}
                    setImageLoading={setImageLoading}
                    type="collection"
                    disabled={!canEditCollection && collectionDetails.disabled}
                    fileType={collectionDetails?.fileType}
                    audio={collectionDetails.audio}
                    audioFileName={collectionDetails?.audioFileName}
                    audioLoading={audioLoading!}
                    setAudioLoading={setAudioLoading!}
                    uploadAudio={uploadAudio!}
                  />
                ) : (
                  <ImageUpload
                    image={collectionDetails.image}
                    imageLoading={imageLoading}
                    uploadImage={uploadImage}
                    loaderGeneral={addCollectionLoading}
                    setImageLoading={setImageLoading}
                    type="collection"
                    disabled={!canEditCollection && collectionDetails.disabled}
                    fileType={collectionDetails?.fileType}
                    collectionType={collectionType}
                  />
                )}
              </div>
              <div className="relative w-full h-fit flex flex-col gap-2">
                <div className="relative w-fit h-fit font-earl text-lg">
                  Collection Amount
                </div>
                <FillIn
                  textArea={false}
                  changeFunction={(e) => handleCollectionAmount(e)}
                  type={"number"}
                  width={"full"}
                  defaultValue={String(collectionDetails?.amount)}
                  loader={addCollectionLoading}
                  disabled={collectionDetails?.disabled}
                />
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-col gap-2 font-earl justify-start">
              <div className="relative w-fit h-fit text-lg">
                Collection Prices
              </div>
              <div className="opacity-70 w-fit word-break text-xxs">
                (Set Prices for the Tokens You want to Accept On Payment)
              </div>
              <CollectionPrices
                collectionDetails={collectionDetails}
                handleCollectionPrices={handleCollectionPrices}
                loader={addCollectionLoading}
                canEditCollection={canEditCollection}
              />
            </div>
          </div>
          <div
            className={`relative flex flex-row gap-2 w-fit h-fit justify-start items-center flex-wrap preG:flex-nowrap`}
          >
            {!collectionDetails?.old && (
              <div
                className={`relative w-fit h-fit ${
                  collectionDetails.disabled && !canEditCollection
                    ? "hidden"
                    : "flex"
                }
          `}
              >
                <ButtonAdd
                  text={
                    collectionDetails.disabled && canEditCollection
                      ? "Update Collection"
                      : "Mint Collection"
                  }
                  width={"40"}
                  functionAdd={
                    collectionDetails.disabled && canEditCollection
                      ? () => dispatch(setUpdateCollection(true))
                      : () => addCollection()
                  }
                  loader={addCollectionLoading}
                />
              </div>
            )}
            <div
              className={`relative w-fit h-fit ${
                (collectionDetails.disabled && collectionDetails.live) ||
                (!collectionDetails?.old &&
                  !collectionDetails.live &&
                  collectionDetails.disabled)
                  ? "flex"
                  : "hidden"
              }`}
            >
              <ButtonAdd
                text={"Delete Collection"}
                width={"40"}
                functionAdd={() => deleteCollection()}
                loader={deleteCollectionLoading}
              />
            </div>
          </div>
        </div>
        <div className="relative w-full h-full flex mode:order-2 order-1">
          <CollectionPreview
            collectionDetails={collectionDetails}
            setPrice={setPrice}
            price={price}
            collectionType={collectionType}
            videoRef={videoRef}
            videoAudio={videoAudio}
          />
        </div>
      </div>
    </div>
  );
};

export default Media;
