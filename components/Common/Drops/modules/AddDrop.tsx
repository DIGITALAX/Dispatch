/* eslint-disable react/jsx-no-comment-textnodes */
import { FunctionComponent } from "react";
import FillIn from "../../Inputs/modules/FillIn";
import ImageUpload from "../../Inputs/modules/ImageUpload";
import ButtonAdd from "../../Inputs/modules/ButtonAdd";
import { AddDropProps } from "../types/drops.types";
import { setDropSwitcher } from "@/redux/reducers/dropSwitcherSlice";
import { BsRewindFill } from "react-icons/bs";
import DropDown from "../../Inputs/modules/DropDown";

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
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col justify-start items-start text-white gap-4">
      <div
        className="relative w-fit h-fit items-center justify-start font-economicaB text-sm flex flex-row gap-2 opacity-70 cursor-pointer active:scale-95"
        onClick={() => dispatch(setDropSwitcher("drops"))}
      >
        <div className="relative w-fit h-fit ">
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
            />
          </div>
          <div className="relative flex flex-col gap-2 w-1/2 h-fit">
            <div className="relative w-fit h-fit font-economica text-lg">
              Choose Collections
            </div>
            <DropDown
              values={availableCollectionIds}
              chosen={chosenCollections}
              setChosen={setChosenCollections}
              open={open}
              setOpen={setOpen}
            />
          </div>
          <div className="relative flex flex-col gap-2 w-fit h-fit justify-start items-center">
            <ButtonAdd
              text={"Add Drop"}
              functionAdd={addDrop}
              loader={addDropLoading}
              width={"20"}
            />
          </div>
        </div>
        <div className="relative w-full h-full flex flex-row md:flex-wrap flex-nowrap overflow-x-scroll md:overflow-x-auto">
          // all colections in drop
        </div>
      </div>
    </div>
  );
};

export default AddDrop;
