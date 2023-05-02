import { FunctionComponent } from "react";
import json from "./../../../../public/videos/local.json";
import { setMainVideo } from "@/redux/reducers/mainVideoSlice";
import { useDispatch } from "react-redux";
import lodash from "lodash";
import { INFURA_GATEWAY } from "@/lib/constants";
import { ComponentProps } from "../types/video.types";
import ReactPlayer from "react-player/lazy";

const Component: FunctionComponent<ComponentProps> = ({
  streamRef,
  mainVideo,
  isPlaying,
  videos,
  likedArray,
  mirroredArray,
  volume,
  setCurrentTime,
  setDuration,
  dispatchVideos,
  collectedArray,
  muted
}): JSX.Element => {
  const dispatch = useDispatch();
  const currentIndex = lodash.findIndex(
    videos?.length > 0 ? videos : dispatchVideos,
    { id: mainVideo.id }
  );
  return (
    <ReactPlayer
      url={mainVideo.local}
      playing={isPlaying}
      playsinline
      light={false}
      ref={streamRef}
      style={{
        width: "100%",
        height: "100%",
      }}
      width="100%"
      height="100%"
      onEnded={() =>
        dispatch(
          setMainVideo({
            actionVideo: `${INFURA_GATEWAY}/ipfs/${
              (videos?.length > 0 ? videos : dispatchVideos)[
                (currentIndex + 1) % videos?.length
              ]?.metadata?.media[0]?.original?.url?.split("ipfs://")[1]
            }`,
            actionCollected:
              collectedArray[
                (currentIndex + 1) %
                  (videos?.length > 0 ? videos : dispatchVideos)?.length
              ],
            actionLiked:
              likedArray[
                (currentIndex + 1) %
                  (videos?.length > 0 ? videos : dispatchVideos)?.length
              ],
            actionMirrored:
              mirroredArray[
                (currentIndex + 1) %
                  (videos?.length > 0 ? videos : dispatchVideos)?.length
              ],
            actionId: (videos?.length > 0 ? videos : dispatchVideos)[
              (currentIndex + 1) %
                (videos?.length > 0 ? videos : dispatchVideos)?.length
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
      volume={volume}
      onDuration={(duration) => setDuration(duration)}
      onProgress={(progress) => setCurrentTime(progress.playedSeconds)}
      muted={muted}
    />
  );
};

export default Component;
