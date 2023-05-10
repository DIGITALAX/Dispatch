import useAddCollection from "@/components/Common/Collections/hooks/useAddCollection";
import useAllCollections from "@/components/Common/Collections/hooks/useAllCollections";
import AddCollection from "@/components/Common/Collections/modules/AddCollection";
import AllCollections from "@/components/Common/Collections/modules/AllCollections";
import useImageUpload from "@/components/Common/Inputs/hooks/useImageUpload";
import useUpgrade from "@/components/Common/Modals/hooks/useUpgrade";
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
  const collectionDetails = useSelector(
    (state: RootState) => state.app.collectionDetailsReducer
  );
  const upgraded = useSelector(
    (state: RootState) => state.app.upgradeReducer.upgradedColl
  );

  const dispatch = useDispatch();
  const { allCollections, collectionsLoading } = useAllCollections();
  const { uploadImage } = useImageUpload();
  const { upgradeTokens, tokensLoading } = useUpgrade();
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
    deleteCollection,
  } = useAddCollection();

  switch (collectionSwitcher) {
    case "add":
      return (
        <AddCollection
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
        />
      );

    default:
      return (
        <AllCollections
          dispatch={dispatch}
          allCollections={allCollections}
          allCollectionsRedux={allCollectionsRedux}
          collectionsLoading={collectionsLoading}
          upgradeTokens={upgradeTokens}
          upgraded={upgraded}
          tokensLoading={tokensLoading}
        />
      );
  }
};

export default CollectionsSwitcher;
