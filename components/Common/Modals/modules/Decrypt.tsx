import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { DecryptProps } from "../types/modals.types";
import { setDecrypt } from "@/redux/reducers/decryptSlice";
import Link from "next/link";
import { Collection } from "../../Collections/types/collections.types";

const Decrypt: FunctionComponent<DecryptProps> = ({
  collections,
  dispatch,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full lg:w-[30vw] h-fit col-start-1 place-self-center from-gray-400 via-gray-600 to-gray-800 border-white bg-gradient-to-r rounded-lg border">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() =>
                    dispatch(
                      setDecrypt({
                        actionOpen: false,
                        actionCollections: [],
                      })
                    )
                  }
                />
              </div>
              <div className="relative w-full h-fit justify-center items-center text-white font-earl text-sm text-center px-4">
                Collect Your Keys 2 Decrypt.
              </div>
              <div className="relative w-full h-fit overflow-x-scroll">
                <div className="flex flex-row w-fit gap-3 h-fit px-4">
                  {collections?.map((coll: Collection, index: number) => {
                    return (
                      <Link
                        className="relative w-36 h-36 preG:w-52 preG:h-52 justify-center items-center rounded-lg border border-white cursor-pointer"
                        id="staticLoad"
                        key={index}
                        href={`https://chromadin.xyz/#collect?option=history&search=${coll.name}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/${
                            coll?.uri?.image?.split("ipfs://")[1]
                          }`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Decrypt;
