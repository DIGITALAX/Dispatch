import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { PlayerProps } from "../types/video.types";
import dynamic from "next/dynamic";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";

const Component = dynamic(() => import("./Component"), { ssr: false });

const Player: FunctionComponent<PlayerProps> = ({
  heart,
  streamRef,
  mainVideo,
  videosLoading,
  isPlaying,
  videos,
  likedArray,
  mirroredArray,
  volume,
  setCurrentTime,
  setDuration,
  wrapperRef,
  dispatchVideos,
  collectedArray,
}): JSX.Element => {
  return (
    <div
      className={`relative justify-center items-center flex w-16 h-10`}
      key={mainVideo.local}
      ref={wrapperRef}
    >
      {heart && (
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmNPPsBttGAxvu6cX3gWT4cnFF8PMF9C55GgJUehGp3nCA`}
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full flex object-cover z-1"
          draggable={false}
        />
      )}
      {videosLoading ? (
        <div className="relative w-16 h-10 bg-offBlack flex flex-col items-center justify-center">
          <FetchMoreLoading size="4" />
        </div>
      ) : (
        <Component
          streamRef={streamRef}
          mainVideo={mainVideo}
          isPlaying={isPlaying}
          videos={videos}
          likedArray={likedArray}
          mirroredArray={mirroredArray}
          volume={volume}
          setCurrentTime={setCurrentTime}
          setDuration={setDuration}
          dispatchVideos={dispatchVideos}
          collectedArray={collectedArray}
        />
      )}
    </div>
  );
};

export default Player;
