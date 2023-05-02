import useAddCollection from "@/components/Components/Collections/hooks/useAddCollection";
import useAllCollections from "@/components/Components/Collections/hooks/useAllCollections";
import AddCollection from "@/components/Components/Collections/modules/AddCollection";
import AllCollections from "@/components/Components/Collections/modules/AllCollections";
import useImageUpload from "@/components/Components/Inputs/hooks/useImageUpload";
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

  const dispatch = useDispatch();
  const { allCollections } = useAllCollections();
  const { uploadImage } = useImageUpload();
  const {
    imageLoading,
    setImageLoading,
    handleCollectionDescription,
    handleCollectionTitle,
    addCollectionLoading
  } = useAddCollection();

  switch (collectionSwitcher) {
    case "add":
      return (
        <AddCollection
          collectionImage={collectionImage}
          imageLoading={imageLoading}
          uploadImage={uploadImage}
          addCollection={addCollection}
          addCollectionLoading={addCollectionLoading}
          dispatch={dispatch}
          handleCollectionTitle={handleCollectionTitle}
          handleCollectionDescription={handleCollectionDescription}
          handleCollectionAmount={handleCollectionAmount}
          handleCollectionPrice={handleCollectionPrice}
          setImageLoading={setImageLoading}
        />
      );

    default:
      return (
        <AllCollections
          dispatch={dispatch}
          allCollections={allCollections}
          allCollectionsRedux={allCollectionsRedux}
        />
      );
  }
};

export default CollectionsSwitcher;
