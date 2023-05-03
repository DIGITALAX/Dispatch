import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/image";
import { FormEvent, FunctionComponent } from "react";
import { ControlsProps } from "../types/video.types";
import { AiOutlineLoading } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { setMainVideo } from "@/redux/reducers/mainVideoSlice";
import lodash from "lodash";
import json from "../../../../public/videos/local.json";
import { setFullScreenVideo } from "@/redux/reducers/fullScreenVideoSlice";
import { setVideoSync } from "@/redux/reducers/videoSyncSlice";

const Controls: FunctionComponent<ControlsProps> = ({
  formatTime,
  volume,
  handleVolumeChange,
  volumeOpen,
  setVolumeOpen,
  handleHeart,
  collected,
  mirrored,
  liked,
  likeVideo,
  collectVideo,
  mirrorVideo,
  authStatus,
  profileId,
  likeLoading,
  mirrorLoading,
  collectLoading,
  videos,
  mainVideo,
  progressRef,
  handleSeek,
  dispatchVideos,
  collectAmount,
  mirrorAmount,
  likeAmount,
  videoSync,
}): JSX.Element => {
  const dispatch = useDispatch();
  const currentIndex = lodash.findIndex(
    videos?.length > 0 ? videos : dispatchVideos,
    { id: mainVideo.id }
  );
  return (
    <div className="relative h-fit flex flex-col md:flex-row w-full gap-3 items-center galaxy:px-2 justify-center min-h-fit">
      <div className="relative w-fit md:w-56 h-full flex justify-center items-center gap-3">
        <div className="relative flex flex-row w-full h-full items-center">
          <div
            className="relative w-4 h-4 cursor-pointer flex"
            onClick={() => dispatch(setFullScreenVideo(true))}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmVpncAteeF7voaGu1ZV5qP63UpZW2xmiCWVftL1QnL5ja`}
              alt="expand"
              fill
              className="flex items-center"
              draggable={false}
            />
          </div>
        </div>
        <div className="relative w-fit h-full flex items-center font-digi text-base text-white">
          <span className="text-rosa">{formatTime(videoSync.currentTime)}</span>
          /<span className="text-light">{formatTime(videoSync.duration)}</span>
        </div>
      </div>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div
          className="relative w-full h-2 bg-white/40 rounded-sm cursor-pointer"
          ref={progressRef}
          onClick={(e: any) => handleSeek(e)}
        >
          <div
            className="absolute h-full bg-white/80 rounded-sm"
            style={{
              width: `${(videoSync.currentTime / videoSync.duration) * 100}%`,
            }}
          />
        </div>
      </div>
      <div className="relative w-full flex flex-row gap-3 items-center justify-center md:justify-end">
        <div className="relative flex flex-row w-fit h-fit gap-2 items-center justify-center">
          <div
            className={`cursor-pointer relative ${
              likeLoading && "animate-spin"
            }`}
            onClick={
              profileId && authStatus
                ? () => {
                    handleHeart();
                    likeVideo();
                  }
                : () => handleHeart()
            }
          >
            {likeLoading ? (
              <AiOutlineLoading size={12} color="white" />
            ) : liked ? (
              <Image
                src={`${INFURA_GATEWAY}/ipfs/Qmc3KCKWRgN8iKwwAPM5pYkAYNeVwWu3moa5RDMDTBV6ZS`}
                width={12}
                height={12}
                alt="heart"
                draggable={false}
              />
            ) : (
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmSX1Y5cKp8p53jv2CnfQBuhu3dgLANjZMTyAMKtgFtvV6`}
                width={12}
                height={12}
                alt="backward"
                draggable={false}
              />
            )}
          </div>
          <div className="relative w-fit h-fit font-earl text-white text-xs">
            {likeAmount[currentIndex]}
          </div>
        </div>
        <div className="relative flex flex-row w-fit h-fit gap-2 items-center justify-center">
          <div
            className={`${
              profileId && authStatus && "cursor-pointer"
            } relative ${collectLoading && "animate-spin"}`}
            onClick={() => collectVideo()}
          >
            {collectLoading ? (
              <AiOutlineLoading size={12} color="white" />
            ) : collected ? (
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmXG1mnHdBDXMzMZ9t1wE1Tqo8DRXQ1oNLUxpETdUw17HU`}
                width={12}
                height={12}
                alt="collect"
                draggable={false}
              />
            ) : (
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmRGf1cz8h9bdw9VKp9zYXZoDfy15nRA1fKc7ARhxnRPwr`}
                width={12}
                height={12}
                alt="collect"
                draggable={false}
              />
            )}
          </div>
          <div className="relative w-fit h-fit font-earl text-white text-xs">
            {collectAmount[currentIndex]}
          </div>
        </div>
        <div className="relative flex flex-row w-fit h-fit gap-2 items-center justify-center">
          <div
            className={`${
              profileId && authStatus && "cursor-pointer"
            } relative ${mirrorLoading && "animate-spin"}`}
            onClick={() => mirrorVideo()}
          >
            {mirrorLoading ? (
              <AiOutlineLoading size={12} color="white" />
            ) : mirrored ? (
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmcMNSnbKvUfx3B3iHBd9deZCDf7E4J8W6UtyNer3xoMsB`}
                width={12}
                height={12}
                alt="mirror"
                draggable={false}
              />
            ) : (
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmXZi8e6UQaXm3BMMdsAUTnxoQSEr97nvuc19v7kBAgFsY`}
                width={12}
                height={12}
                alt="mirror"
                draggable={false}
              />
            )}
          </div>
          <div className="relative w-fit h-fit font-earl text-white text-xs">
            {mirrorAmount[currentIndex]}
          </div>
        </div>
        <div
          className="relative cursor-pointer rotate-180"
          onClick={() =>
            dispatch(
              setMainVideo({
                actionVideo: `${INFURA_GATEWAY}/ipfs/${
                  (videos?.length > 0 ? videos : dispatchVideos)[
                    currentIndex ===
                    (videos?.length > 0 ? videos : dispatchVideos).length - 1
                      ? 0
                      : currentIndex === 0
                      ? (videos?.length > 0 ? videos : dispatchVideos).length -
                        1
                      : currentIndex - 1
                  ]?.metadata?.media[0]?.original?.url?.split("ipfs://")[1]
                }`,
                actionCollected:
                  videoSync.collectedArray[
                    currentIndex ===
                    (videos?.length > 0 ? videos : dispatchVideos).length - 1
                      ? 0
                      : currentIndex === 0
                      ? (videos?.length > 0 ? videos : dispatchVideos).length -
                        1
                      : currentIndex - 1
                  ],
                actionLiked:
                  videoSync.likedArray[
                    currentIndex ===
                    (videos?.length > 0 ? videos : dispatchVideos).length - 1
                      ? 0
                      : currentIndex === 0
                      ? (videos?.length > 0 ? videos : dispatchVideos).length -
                        1
                      : currentIndex - 1
                  ],
                actionMirrored:
                  videoSync.mirroredArray[
                    currentIndex ===
                    (videos?.length > 0 ? videos : dispatchVideos).length - 1
                      ? 0
                      : currentIndex === 0
                      ? (videos?.length > 0 ? videos : dispatchVideos).length -
                        1
                      : currentIndex - 1
                  ],
                actionId: (videos?.length > 0 ? videos : dispatchVideos)[
                  currentIndex ===
                  (videos?.length > 0 ? videos : dispatchVideos).length - 1
                    ? 0
                    : currentIndex === 0
                    ? (videos?.length > 0 ? videos : dispatchVideos).length - 1
                    : currentIndex - 1
                ].id,
                actionLocal: `${
                  json[
                    currentIndex ===
                    (videos?.length > 0 ? videos : dispatchVideos).length - 1
                      ? 0
                      : currentIndex === 0
                      ? (videos?.length > 0 ? videos : dispatchVideos).length -
                        1
                      : currentIndex - 1
                  ].link
                }`,
              })
            )
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmcYHKZJWJjgibox8iLqNozENnkgD4CZQqYsmmVJpoYUyo`}
            width={12}
            height={12}
            alt="backward"
            draggable={false}
          />
        </div>
        <div
          className="relative cursor-pointer"
          onClick={() =>
            dispatch(
              setVideoSync({
                actionHeart: videoSync.heart,
                actionDuration: videoSync.duration,
                actionCurrentTime: videoSync.currentTime,
                actionIsPlaying: videoSync.isPlaying ? false : true,
                actionLikedArray: videoSync.likedArray,
                actionMirroredArray: videoSync.mirroredArray,
                actionCollectedArray: videoSync.collectedArray,
                actionVideosLoading: videoSync.videosLoading,
              })
            )
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              videoSync.isPlaying
                ? "Qmbg8t4xoNywhtCexD5Ln5YWvcKMXGahfwyK6UHpR3nBip"
                : "QmXw52mJFnzYXmoK8eExoHKv7YW9RBVEwSFtfvxXgy7sfp"
            }`}
            draggable={false}
            width={12}
            height={12}
            alt="play"
          />
        </div>
        <div
          className="relative cursor-pointer"
          onClick={() =>
            dispatch(
              setMainVideo({
                actionVideo: `${INFURA_GATEWAY}/ipfs/${
                  (videos?.length > 0 ? videos : dispatchVideos)[
                    (currentIndex + 1) %
                      (videos?.length > 0 ? videos : dispatchVideos)?.length
                  ]?.metadata?.media[0]?.original?.url?.split("ipfs://")[1]
                }`,
                actionCollected:
                  videoSync.collectedArray[
                    (currentIndex + 1) %
                      (videos?.length > 0 ? videos : dispatchVideos)?.length
                  ],
                actionLiked:
                  videoSync.likedArray[
                    (currentIndex + 1) %
                      (videos?.length > 0 ? videos : dispatchVideos)?.length
                  ],
                actionMirrored:
                  videoSync.mirroredArray[
                    (currentIndex + 1) %
                      (videos?.length > 0 ? videos : dispatchVideos)?.length
                  ],
                actionId: (videos?.length > 0 ? videos : dispatchVideos)[
                  (currentIndex + 1) %
                    (videos?.length > 0 ? videos : dispatchVideos).length
                ].id,
                actionLocal: `${
                  json[
                    (currentIndex + 1) %
                      (videos?.length > 0 ? videos : dispatchVideos)?.length
                  ].link
                }`,
              })
            )
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmcYHKZJWJjgibox8iLqNozENnkgD4CZQqYsmmVJpoYUyo`}
            width={12}
            height={12}
            alt="forward"
            draggable={false}
          />
        </div>
        <div
          className="relative cursor-pointer"
          onClick={() => setVolumeOpen(!volumeOpen)}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              volume === 0
                ? "QmVVzvq68RwGZFi46yKEthuG6PXQf74BaMW4yCrZCkgtzK"
                : "Qme1i88Yd1x4SJfgrSCFyXp7GELCZRnnPQeFUt6jbfPbqL"
            }`}
            width={12}
            height={12}
            alt="volume"
            draggable={false}
          />
        </div>
        {volumeOpen && (
          <input
            className="absolute w-40 h-fit bottom-10"
            type="range"
            value={volume}
            max={1}
            min={0}
            step={0.1}
            onChange={(e: FormEvent) => handleVolumeChange(e)}
          />
        )}
      </div>
    </div>
  );
};

export default Controls;
