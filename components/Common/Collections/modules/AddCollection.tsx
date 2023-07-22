import { FunctionComponent } from "react";
import { AddCollectionProps } from "../types/collections.types";
import { setCollectionTypeSwitcher } from "@/redux/reducers/collectionTypeSlice";
import { setCollectionDetails } from "@/redux/reducers/collectionDetailsSlice";
import Media from "./Media";
import { BsRewindFill } from "react-icons/bs";
import { setCollectionSwitcher } from "@/redux/reducers/collectionSwitcherSlice";

const AddCollection: FunctionComponent<AddCollectionProps> = ({
  dispatch,
  imageLoading,
  uploadImage,
  addCollection,
  addCollectionLoading,
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
  setAudioLoading,
  audioLoading,
  uploadAudio,
}): JSX.Element => {
  switch (collectionType) {
    case "audio/mpeg":
      return (
        <Media
          imageLoading={imageLoading}
          uploadImage={uploadImage}
          addCollection={addCollection}
          addCollectionLoading={addCollectionLoading}
          dispatch={dispatch}
          handleCollectionTitle={handleCollectionTitle}
          handleCollectionDescription={handleCollectionDescription}
          setImageLoading={setImageLoading}
          handleCollectionPrices={handleCollectionPrices}
          handleCollectionAmount={handleCollectionAmount}
          collectionDetails={collectionDetails}
          setPrice={setPrice}
          price={price}
          deleteCollection={deleteCollection}
          deleteCollectionLoading={deleteCollectionLoading}
          canEditCollection={canEditCollection}
          collectionType={collectionType}
          audioLoading={audioLoading}
          setAudioLoading={setAudioLoading}
          uploadAudio={uploadAudio}
        />
      );

    case "video/mp4":
      return (
        <Media
          imageLoading={imageLoading}
          uploadImage={uploadImage}
          addCollection={addCollection}
          addCollectionLoading={addCollectionLoading}
          dispatch={dispatch}
          handleCollectionTitle={handleCollectionTitle}
          handleCollectionDescription={handleCollectionDescription}
          setImageLoading={setImageLoading}
          handleCollectionPrices={handleCollectionPrices}
          handleCollectionAmount={handleCollectionAmount}
          collectionDetails={collectionDetails}
          setPrice={setPrice}
          price={price}
          deleteCollection={deleteCollection}
          deleteCollectionLoading={deleteCollectionLoading}
          canEditCollection={canEditCollection}
          collectionType={collectionType}
        />
      );

    case "image/gif":
      return (
        <Media
          collectionType={collectionType}
          imageLoading={imageLoading}
          uploadImage={uploadImage}
          addCollection={addCollection}
          addCollectionLoading={addCollectionLoading}
          dispatch={dispatch}
          handleCollectionTitle={handleCollectionTitle}
          handleCollectionDescription={handleCollectionDescription}
          setImageLoading={setImageLoading}
          handleCollectionPrices={handleCollectionPrices}
          handleCollectionAmount={handleCollectionAmount}
          collectionDetails={collectionDetails}
          setPrice={setPrice}
          price={price}
          deleteCollection={deleteCollection}
          deleteCollectionLoading={deleteCollectionLoading}
          canEditCollection={canEditCollection}
        />
      );

    case "image/png":
      return (
        <Media
          collectionType={collectionType}
          imageLoading={imageLoading}
          uploadImage={uploadImage}
          addCollection={addCollection}
          addCollectionLoading={addCollectionLoading}
          dispatch={dispatch}
          handleCollectionTitle={handleCollectionTitle}
          handleCollectionDescription={handleCollectionDescription}
          setImageLoading={setImageLoading}
          handleCollectionPrices={handleCollectionPrices}
          handleCollectionAmount={handleCollectionAmount}
          collectionDetails={collectionDetails}
          setPrice={setPrice}
          price={price}
          deleteCollection={deleteCollection}
          deleteCollectionLoading={deleteCollectionLoading}
          canEditCollection={canEditCollection}
        />
      );

    default:
      return (
        <div className="relative flex flex-col w-full h-full justify-start items-start text-white">
          <div
            className="relative w-fit h-fit items-center justify-start font-earl text-sm flex flex-row gap-2 opacity-70 cursor-pointer active:scale-95"
            onClick={() => dispatch(setCollectionSwitcher("collections"))}
          >
            <div className="relative w-fit h-fit ">
              <BsRewindFill color="white" size={15} />
            </div>
            <div className="relative w-fit h-fit justify-start items-center flex">
              return
            </div>
          </div>
          <div className="relative w-full h-full flex flex-row justify-center items-center text-white gap-4">
            <div
              className="relative w-24 h-8 bg-marip px-3 py-1.5 font-earl text-black rounded-tr-lg rounded-bl-lg text-sm cursor-pointer active:scale-95 text-center"
              onClick={() => {
                dispatch(
                  setCollectionDetails({
                    actionTitle: "Collection Title",
                    actionDescription: "Collection Description :)",
                    actionImage: "",
                    actionAmount: 1,
                    actionAudio: "",
                    actionAudioFileName: "",
                    actionAcceptedTokens: [],
                    actionTokenPrices: [],
                    actionDisabled: false,
                    actionFileType: "",
                    actionType: "add",
                    actionId: 0,
                    actionSoldTokens: [],
                    actionTokenIds: [],
                    actionLive: false,
                    actionOld: false,
                  })
                );
                dispatch(setCollectionTypeSwitcher("image/png"));
              }}
            >
              image
            </div>
            <div
              className="relative w-24 h-8 bg-marip px-3 py-1.5 font-earl text-black rounded-tr-lg rounded-bl-lg text-sm cursor-pointer active:scale-95 text-center"
              onClick={() => {
                dispatch(
                  setCollectionDetails({
                    actionTitle: "Collection Title",
                    actionDescription: "Collection Description :)",
                    actionImage: "",
                    actionAmount: 1,
                    actionAudio: "",
                    actionAudioFileName: "",
                    actionAcceptedTokens: [],
                    actionTokenPrices: [],
                    actionDisabled: false,
                    actionFileType: "",
                    actionType: "add",
                    actionId: 0,
                    actionSoldTokens: [],
                    actionTokenIds: [],
                    actionLive: false,
                    actionOld: false,
                  })
                );
                dispatch(setCollectionTypeSwitcher("audio/mpeg"));
              }}
            >
              music
            </div>
            <div
              className="relative w-24 h-8 bg-marip px-3 py-1.5 font-earl text-black rounded-tr-lg rounded-bl-lg text-sm cursor-pointer active:scale-95 text-center"
              onClick={() => {
                dispatch(
                  setCollectionDetails({
                    actionTitle: "Collection Title",
                    actionDescription: "Collection Description :)",
                    actionImage: "",
                    actionAmount: 1,
                    actionAudio: "",
                    actionAudioFileName: "",
                    actionAcceptedTokens: [],
                    actionTokenPrices: [],
                    actionDisabled: false,
                    actionFileType: "",
                    actionType: "add",
                    actionId: 0,
                    actionSoldTokens: [],
                    actionTokenIds: [],
                    actionLive: false,
                    actionOld: false,
                  })
                );
                dispatch(setCollectionTypeSwitcher("video/mp4"));
              }}
            >
              video
            </div>
          </div>
        </div>
      );
  }
};

export default AddCollection;
