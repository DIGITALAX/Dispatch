import { setModal } from "@/redux/reducers/modalSlice";
import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { ErrorProps } from "../types/modals.types";

const Error: FunctionComponent<ErrorProps> = ({
  message,
  dispatch,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-40 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-full md:w-[30vw] h-52 col-start-1 place-self-center rounded-lg bg-cover"
        id="videoplayer"
      >
        <div className="relative w-full row-start-2 h-full grid grid-flow-col auto-cols-auto bg-offBlack/90 rounded-lg">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-10 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() =>
                    dispatch(
                      setModal({
                        actionType: "",
                        actionMessage: "",
                      })
                    )
                  }
                />
              </div>
              <div className="relative w-full h-fit row-start-2 grid grid-flow-col auto-cols-auto px-4">
                <div className="relative w-fit h-fit font-earl text-white text-xl place-self-center text-center">
                  {message}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
