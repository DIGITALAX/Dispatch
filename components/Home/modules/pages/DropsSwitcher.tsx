import useAddDrop from "@/components/Common/Drops/hooks/useAddDrop";
import useAllDrops from "@/components/Common/Drops/hooks/useAllDrops";
import AddDrop from "@/components/Common/Drops/modules/AddDrop";
import AllDrops from "@/components/Common/Drops/modules/AllDrops";
import useImageUpload from "@/components/Common/Inputs/hooks/useImageUpload";
import { RootState } from "@/redux/store";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";

const DropsSwitcher: FunctionComponent = (): JSX.Element => {
  const dropSwitcher = useSelector(
    (state: RootState) => state.app.dropSwitcherReducer.value
  );
  const dropDetails = useSelector(
    (state: RootState) => state.app.dropDetailsReducer
  );
  const allCollections = useSelector(
    (state: RootState) => state.app.allCollectionsReducer.value
  );
  const marketProfile = useSelector(
    (state: RootState) => state.app.marketProfileReducer.profile
  );
  const allDropsRedux = useSelector(
    (state: RootState) => state.app.allDropsReducer.value
  );
  const dispatch = useDispatch();
  const { uploadImage } = useImageUpload();
  const {
    addDropLoading,
    addDrop,
    handleDropTitle,
    availableCollectionIds,
    open,
    setOpen,
    setChosenCollections,
    chosenCollections,
    imageLoading,
    setImageLoading,
    alreadyInDrop,
    addMore,
    deleteDropLoading,
    deleteDrop,
    removeCollectionFromDrop,
    removeCollectionLoading,
    alreadyInDropIds
  } = useAddDrop();
  const { dropsLoading } = useAllDrops();

  switch (dropSwitcher) {
    case "add":
      return (
        <AddDrop
          imageLoading={imageLoading}
          uploadImage={uploadImage}
          addDrop={addDrop}
          addDropLoading={addDropLoading}
          handleDropTitle={handleDropTitle}
          dispatch={dispatch}
          availableCollectionIds={availableCollectionIds}
          chosenCollections={chosenCollections}
          setChosenCollections={setChosenCollections}
          open={open}
          setOpen={setOpen}
          setImageLoading={setImageLoading}
          dropDetails={dropDetails}
          alreadyInDrop={alreadyInDrop}
          allCollections={allCollections}
          addMore={addMore}
          deleteDrop={deleteDrop}
          deleteDropLoading={deleteDropLoading}
          marketProfile={marketProfile}
          removeCollectionFromDrop={removeCollectionFromDrop}
          removeCollectionLoading={removeCollectionLoading}
          alreadyInDropIds={alreadyInDropIds}
        />
      );

    default:
      return (
        <AllDrops
          dispatch={dispatch}
          allDropsRedux={allDropsRedux}
          dropsLoading={dropsLoading}
          marketProfile={marketProfile}
        />
      );
  }
};

export default DropsSwitcher;
