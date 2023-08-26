import useAddCollection from "@/components/Common/Collections/hooks/useAddCollection";
import useAllCollections from "@/components/Common/Collections/hooks/useAllCollections";
import useEditCollection from "@/components/Common/Collections/hooks/useEditCollection";
import AddCollection from "@/components/Common/Collections/modules/AddCollection";
import AllCollections from "@/components/Common/Collections/modules/AllCollections";
import useImageUpload from "@/components/Common/Inputs/hooks/useImageUpload";
import { RootState } from "@/redux/store";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";

const CollectionsSwitcher: FunctionComponent = (): JSX.Element => {
  const collectionSwitcher = useSelector(
    (state: RootState) => state.app.collectionSwitcherReducer.value
  );
  const allCollectionsRedux = useSelector(
    (state: RootState) => state.app.allCollectionsReducer.value
  );
  const marketProfile = useSelector(
    (state: RootState) => state.app.marketProfileReducer.profile
  );
  const collectionDetails = useSelector(
    (state: RootState) => state.app.collectionDetailsReducer
  );
  const canEditCollection = useSelector(
    (state: RootState) => state.app.canEditCollectionReducer.value
  );
  const collectionType = useSelector(
    (state: RootState) => state.app.collectionTypeReducer.value
  );

  const dispatch = useDispatch();
  const { collectionsLoading } = useAllCollections();
  const { uploadImage, uploadAudio, videoRef, videoAudio } = useImageUpload();
  const {
    imageLoading,
    setImageLoading,
    handleCollectionDescription,
    handleCollectionTitle,
    addCollectionLoading,
    handleCollectionPrices,
    handleCollectionAmount,
    addCollection,
    price,
    setPrice,
    audioLoading,
    setAudioLoading,
  } = useAddCollection();

  const { deleteCollection, deleteCollectionLoading } = useEditCollection();

  switch (collectionSwitcher) {
    case "add":
      return (
        <AddCollection
          videoRef={videoRef}
          collectionType={collectionType}
          imageLoading={imageLoading}
          uploadImage={uploadImage}
          addCollection={addCollection}
          addCollectionLoading={addCollectionLoading}
          dispatch={dispatch}
          handleCollectionTitle={handleCollectionTitle}
          handleCollectionDescription={handleCollectionDescription}
          handleCollectionAmount={handleCollectionAmount}
          handleCollectionPrices={handleCollectionPrices}
          setImageLoading={setImageLoading}
          collectionDetails={collectionDetails}
          setPrice={setPrice}
          price={price}
          deleteCollection={deleteCollection}
          deleteCollectionLoading={deleteCollectionLoading}
          canEditCollection={canEditCollection}
          audioLoading={audioLoading}
          setAudioLoading={setAudioLoading}
          uploadAudio={uploadAudio}
          videoAudio={videoAudio}
        />
      );

    default:
      return (
        <AllCollections
          dispatch={dispatch}
          allCollectionsRedux={allCollectionsRedux}
          collectionsLoading={collectionsLoading}
          marketProfile={marketProfile}
        />
      );
  }
};

export default CollectionsSwitcher;
