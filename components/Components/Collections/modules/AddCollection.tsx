import { FunctionComponent } from "react";
import FillIn from "../../Inputs/modules/FillIn";
import ImageUpload from "../../Inputs/modules/ImageUpload";
import ButtonAdd from "../../Inputs/modules/ButtonAdd";
import { setDropSwitcher } from "@/redux/reducers/dropSwitcherSlice";
import { BsRewindFill } from "react-icons/bs";
import { AddCollectionProps } from "../types/collections.types";

const AddCollection: FunctionComponent<AddCollectionProps> = ({
  collectionImage,
  imageLoading,
  uploadImage,
  addCollection,
  addCollectionLoading,
  dispatch,
  handleCollectionTitle,
  handleCollectionDescription,
  setImageLoading
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
      <div className="relative w-full h-full flex flex-row">
        <div className="relative w-full h-full flex flex-col gap-5">
          <div className="relative flex flex-col gap-2 w-1/2 h-fit">
            <div className="relative w-fit h-fit font-economica text-lg">
              Drop Name
            </div>
            <FillIn textArea={false} changeFunction={handleCollectionTitle} />
          </div>
          <div className="relative flex flex-col gap-2 w-1/2 h-fit">
            <div className="relative w-fit h-fit font-economica text-lg">
              Drop Poster
            </div>
            <ImageUpload
              image={collectionImage}
              imageLoading={imageLoading}
              uploadImage={uploadImage}
              loaderGeneral={addCollectionLoading}
              setImageLoading={setImageLoading}
            />
          </div>
          <div className="relative flex flex-col gap-2 w-1/2 h-fit">
            <div className="relative w-fit h-fit font-economica text-lg">
              Choose Collections
            </div>
          </div>
          <div className="relative flex flex-col gap-2 w-fit h-fit justify-start items-center">
            <ButtonAdd
              text={"Add Drop"}
              functionAdd={addCollection}
              loader={addCollectionLoading}
            />
          </div>
        </div>
        <div className="relative w-full h-full flex flex-col">
          // all colections in drop
        </div>
      </div>
    </div>
  );
};

export default AddCollection;
