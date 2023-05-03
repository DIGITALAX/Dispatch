import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { PlayerProps } from "../types/video.types";
import dynamic from "next/dynamic";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";

const Component = dynamic(() => import("./Component"), { ssr: false });

const Player: FunctionComponent<PlayerProps> = ({
  streamRef,
  mainVideo,
  videos,
  volume,
  wrapperRef,
  dispatchVideos,
  fullScreen,
  muted,
  videoSync,
}): JSX.Element => {
  return (
    <div
      className={`relative justify-center items-center flex  ${
        fullScreen ? "w-full h-full" : "w-16 h-10"
      }`}
      key={mainVideo.local}
      ref={wrapperRef}
    >
      {videoSync.heart && (
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmNPPsBttGAxvu6cX3gWT4cnFF8PMF9C55GgJUehGp3nCA`}
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full flex object-cover z-30"
          draggable={false}
        />
      )}
      {videoSync.videosLoading ? (
        <div className="relative w-16 h-10 bg-offBlack flex flex-col items-center justify-center">
          <FetchMoreLoading size="1rem" height="fit-content" />
        </div>
      ) : (
        <Component
          streamRef={streamRef}
          mainVideo={mainVideo}
          videos={videos}
          volume={volume}
          dispatchVideos={dispatchVideos}
          muted={muted}
          videoSync={videoSync}
        />
      )}
    </div>
  );
};

export default Player;
