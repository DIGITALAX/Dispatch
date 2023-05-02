import useAddDrop from "@/components/Components/Drops/hooks/useAddDrop";
import useAllDrops from "@/components/Components/Drops/hooks/useAllDrops";
import AddDrop from "@/components/Components/Drops/modules/AddDrop";
import AllDrops from "@/components/Components/Drops/modules/AllDrops";
import useImageUpload from "@/components/Components/Inputs/hooks/useImageUpload";
import { RootState } from "@/redux/store";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";

const DropsSwitcher: FunctionComponent = (): JSX.Element => {
  const dropSwitcher = useSelector(
    (state: RootState) => state.app.dropSwitcherReducer.value
  );
  const dropDetails= useSelector(
    (state: RootState) => state.app.dropDetailsReducer
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
    setImageLoading
  } = useAddDrop();
  const { allDrops } = useAllDrops();

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
        />
      );

    default:
      return (
        <AllDrops
          dispatch={dispatch}
          allDrops={allDrops}
          allDropsRedux={allDropsRedux}
        />
      );
  }
};

export default DropsSwitcher;
