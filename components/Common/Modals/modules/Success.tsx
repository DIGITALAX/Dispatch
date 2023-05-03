import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { SuccessProps } from "../types/modals.types";
import { setSuccessModal } from "@/redux/reducers/successModalSlice";
import { setPage } from "@/redux/reducers/pageSlice";

const Success: FunctionComponent<SuccessProps> = ({
  media,
  dispatch,
  message,
  link,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full md:w-[30vw] h-fit col-start-1 place-self-center bg-offBlack rounded-lg">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() =>
                    dispatch(
                      setSuccessModal({
                        actionOpen: false,
                        actionMedia: "",
                        actionLink: "",
                        actionMessage: "",
                      })
                    )
                  }
                />
              </div>
              <div className="relative w-full h-fit flex flex-col items-center justify-center px-4 gap-6">
                <div className="relative w-3/4 h-fit justify-center items-center text-white font-earl text-sm text-center">
                  {message} 
                </div>
                <div
                  className="relative px-2 py-1.5 w-fit h-fit rounded-lg bg-ama text-offBlack border border-white font-earl text-sm cursor-pointer active:scale-95"
                  onClick={
                    link
                      ? () => {
                          window.open(link, "_blank");
                          dispatch(
                            setSuccessModal({
                              actionOpen: false,
                              actionMedia: "",
                              actionLink: "",
                              actionMessage: "",
                            })
                          );
                        }
                      : () => {
                          dispatch(setPage("drops"));
                          dispatch(
                            setSuccessModal({
                              actionOpen: false,
                              actionMedia: "",
                              actionLink: "",
                              actionMessage: "",
                            })
                          );
                        }
                  }
                >
                  {link ? "Go to Drop" : "Add Drop"}
                </div>
                <div
                  className="relative w-36 preG:w-52 md:w-40 xl:w-52 h-36 preG:h-52 md:h-40 xl:h-52 justify-center items-center rounded-lg border border-white"
                  id="staticLoad"
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      media.includes("ipfs://")
                        ? media.split("ipfs://")[1]
                        : media
                    }`}
                    layout="fill"
                    objectFit="cover"
                    objectPosition={"top"}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
