import { setUpgrade } from "@/redux/reducers/upgradeSlice";
import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ImCross } from "react-icons/im";

const Upgrade: FunctionComponent<any> = ({
  dispatch,
  upgradeFirst,
  upgradeSecond,
  upgradeThird,
  upgradeFourth,
  upgradeDrop,
  tokensLoading,
  dropLoading,
  type,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-40 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-full md:w-[40vw] h-fit col-start-1 place-self-center rounded-lg bg-cover"
        id="videoplayer"
      >
        <div className="relative w-full row-start-2 h-full grid grid-flow-col auto-cols-auto bg-black/90 rounded-lg">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-3 pb-8">
              <div className="relative w-full h-fit items-end flex justify-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() =>
                    dispatch(
                      setUpgrade({
                        actionOpen: false,
                      })
                    )
                  }
                />
              </div>

              <div className="relative w-full h-fit row-start-2 flex flex-col items-center justify-center gap-2 px-4">
                <div className="relative w-full flex h-fit font-arcade text-white justify-center">
                  Upgrade Collections
                </div>
                <div className="relative flex flex-wrap gap-2 w-full h-fit items-center justify-center">
                  <div
                    className={`relative w-fit h-fit font-earl text-white text-xs place-self-center text-center px-3 py-2 border border-white rounded-md cursor-pointer`}
                    onClick={() => upgradeFirst()}
                  >
                    {tokensLoading[0] ? (
                      <AiOutlineLoading size={10} color="white" />
                    ) : (
                      "upgrade thalassa"
                    )}
                  </div>
                  <div
                    className="relative w-fit h-fit font-earl text-white text-xs place-self-center text-center  px-3 py-2 border border-white rounded-md cursor-pointer"
                    onClick={() => upgradeSecond()}
                  >
                    {tokensLoading[1] ? (
                      <AiOutlineLoading size={10} color="white" />
                    ) : (
                      "upgrade empathy muse"
                    )}
                  </div>
                  <div
                    className="relative w-fit h-fit font-earl text-white text-xs place-self-center text-center  px-3 py-2 border border-white rounded-md cursor-pointer"
                    onClick={() => upgradeThird()}
                  >
                    {tokensLoading[2] ? (
                      <AiOutlineLoading size={10} color="white" />
                    ) : (
                      "upgrade lea"
                    )}
                  </div>
                  <div
                    className="relative w-fit h-fit font-earl text-white text-xs place-self-center text-center  px-3 py-2 border border-white rounded-md cursor-pointer"
                    onClick={() => upgradeFourth()}
                  >
                    {tokensLoading[3] ? (
                      <AiOutlineLoading size={10} color="white" />
                    ) : (
                      "upgrade reo"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
