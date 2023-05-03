import { setCollectionSwitcher } from "@/redux/reducers/collectionSwitcherSlice";
import { FunctionComponent } from "react";
import { AllCollectionsProps } from "../types/collections.types";

const AllCollections: FunctionComponent<AllCollectionsProps> = ({
  dispatch,
  allCollections,
  allCollectionsRedux,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-fit flex flex-row justify-start items-start flex-wrap gap-3 overflow-y-scroll"
    >
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div
          className="relative w-fit h-fit bg-azul px-3 py-1.5 font-economica text-offBlack text-sm cursor-pointer active:scale-95"
          onClick={() => dispatch(setCollectionSwitcher("add"))}
        >
          new collection type
        </div>
      </div>
      {(allCollections.length < 1 ? allCollectionsRedux : allCollections).map(
        (value: any, index: number) => {
          return (
            <div
              className="relative w-40 h-40 flex items-center justify-center"
              key={index}
            >
              <div className="relative w-fit h-fit bg-azul px-3 py-1.5 font-economica text-offBlack text-sm cursor-pointer active:scale-95">
                new collection
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default AllCollections;
