import { INFURA_GATEWAY } from "@/lib/constants";
import { setFullScreenVideo } from "@/redux/reducers/fullScreenVideoSlice";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { FullScreenVideoProps } from "../types/modals.types";
import Player from "../../Tunes/modules/Player";

const FullScreenVideo: FunctionComponent<FullScreenVideoProps> = ({
  dispatch,
  mainVideo,
  videoRef,
  streamRef,
  videos,
  wrapperRef,
  dispatchVideos,
  videoSync,
}): JSX.Element => {
  return (
    <Draggable
      cancel=".frame"
      enableUserSelectHack={false}
      nodeRef={videoRef as any}
    >
      <div
        className={
          "absolute z-20 w-3/5 xl:w-1/3 h-96 px-8 pb-8 pt-4 cursor-grab active:cursor-grabbing items-center justify-center border-4 border-black rounded-lg top-1/3 left-1/3 flex flex-col"
        }
        id="videoplayer"
        ref={videoRef as any}
      >
        <div className="relative w-full h-fit flex flex-row items-center">
          <div className="relative w-fit h-fit justify-start row-start-1 col-start-1 pb-2">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/Qmf6evtDntW5NPNp5vcGRpyG2LgK6qg5ndJ3kw7cNy4BuK`}
              width={25}
              height={25}
              draggable={false}
            />
          </div>
          <div
            className="relative w-fit h-fit justify-end pb-2 cursor-pointer ml-auto"
            onClick={() => dispatch(setFullScreenVideo(false))}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmRtXzfqbJXXZ6fReUihpauh9nz6pmjUv5CKGm3oXquzh4`}
              // layout="fill"
              width={25}
              height={25}
              draggable={false}
            />
          </div>
        </div>
        <div className="relative w-full h-full justify-self-end row-start-2 border border-offBlue col-start-1 rounded-md bg-offBlack">
          <Player
            streamRef={streamRef}
            mainVideo={mainVideo}
            videos={videos}
            wrapperRef={wrapperRef}
            dispatchVideos={dispatchVideos}
            fullScreen={true}
            muted={true}
            volume={0}
            videoSync={videoSync}
          />
        </div>
      </div>
    </Draggable>
  );
};

export default FullScreenVideo;
