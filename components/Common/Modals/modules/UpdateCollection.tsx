import { FunctionComponent } from "react";
import { UpdateCollectionProps } from "../types/modals.types";
import { ImCross } from "react-icons/im";
import { setUpdateCollection } from "@/redux/reducers/updateCollectionSlice";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import ButtonAdd from "../../Inputs/modules/ButtonAdd";

const UpdateCollection: FunctionComponent<UpdateCollectionProps> = ({
  updateCollectionLoading,
  updateCollection,
  collectionValues,
  dispatch,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full md:w-[50vw] h-fit col-start-1 place-self-center bg-black rounded-lg border border-white">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() => dispatch(setUpdateCollection(false))}
                />
              </div>
              <div className="relative w-full h-fit flex flex-col items-center justify-center px-4 gap-6">
                <div className="relative w-3/4 h-fit justify-center items-center text-ama font-earl text-sm text-center">
                  Updating Collection:{" "}
                  <span className="text-white">{collectionValues.title}</span>
                </div>
                <div className="relative w-3/4 h-fit justify-center items-center text-white font-earl text-base text-center">
                  Everything good to go?
                </div>
                <div
                  className="relative w-36 preG:w-52 md:w-40 xl:w-52 h-36 preG:h-52 md:h-40 xl:h-52 justify-center items-center rounded-lg border border-white"
                  id="staticLoad"
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      collectionValues.image?.includes("ipfs://")
                        ? collectionValues.image?.split("ipfs://")[1]
                        : collectionValues.image
                    }`}
                    layout="fill"
                    objectFit="cover"
                    objectPosition={"top"}
                    className="rounded-lg"
                    draggable={false}
                  />
                </div>
                <ButtonAdd
                  text={"Update Collection"}
                  functionAdd={() => updateCollection()}
                  loader={updateCollectionLoading}
                  width={"40"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCollection;
