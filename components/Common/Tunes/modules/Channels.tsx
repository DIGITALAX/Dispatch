import { FunctionComponent } from "react";
import { ChannelsProps } from "../types/video.types";
import { INFURA_GATEWAY } from "@/lib/constants";
import { setMainVideo } from "@/redux/reducers/mainVideoSlice";
import { Publication } from "@/components/Home/types/lens.types";
import json from "../../../../public/videos/local.json";

const Channels: FunctionComponent<ChannelsProps> = ({
  videos,
  dispatch,
  dispatchVideos,
  videoSync,
}): JSX.Element => {
  return (
    <div className="relative w-full h-16 flex flex-row overflow-x-scroll gap-1.5">
      {videoSync.videosLoading ? (
        <>
          {Array.from({ length: 20 }).map((_: any, index: number) => {
            return (
              <div
                className="relative w-28 h-full flex flex-row cursor-pointer rounded-lg border border-white animate-pulse opacity-70"
                key={index}
                id="staticLoad"
              ></div>
            );
          })}
        </>
      ) : (
        (videos?.length > 0 || dispatchVideos?.length > 0) &&
        (videos?.length > 0 ? videos : dispatchVideos)?.map(
          (content: Publication, index: number) => {
            return (
              <div
                className="relative w-28 h-full flex flex-row cursor-pointer rounded-lg border border-white"
                key={index}
                onClick={() =>
                  dispatch(
                    setMainVideo({
                      actionVideo: `${INFURA_GATEWAY}/ipfs/${
                        content?.metadata?.media?.[0]?.original?.url.split(
                          "ipfs://"
                        )[1]
                      }`,
                      actionCollected: videoSync.collectedArray[index],
                      actionLiked: videoSync.likedArray[index],
                      actionMirrored: videoSync.mirroredArray[index],
                      actionId: content?.id,
                      actionLocal: `${json[index].link}`,
                    })
                  )
                }
              >
                <div className="relative w-28 h-full">
                  <video
                    muted
                    playsInline
                    preload="metadata"
                    className="relative object-cover w-full h-full rounded-lg"
                    poster={`${INFURA_GATEWAY}/ipfs/${json[index]?.poster}`}
                  >
                    <source
                      src={`${INFURA_GATEWAY}/ipfs/${
                        content?.metadata?.media?.[0]?.original?.url?.split(
                          "ipfs://"
                        )[1]
                      }`}
                      type="video/mp4"
                    />
                  </video>
                </div>
                <div
                  className={`absolute top-0 right-0 w-full h-full bg-black/70 rounded-lg p-2 opacity-0 hover:opacity-100`}
                >
                  <div className="relative w-fit h-fit flex flex-row items-center">
                    <div
                      className="relative w-fit h-fit text-xs font-arcade flex justify-start break-all"
                      id={`record${(index % 3) + 1}`}
                    >
                      {content?.metadata?.content?.split("\n\n")[0]?.length > 34
                        ? content?.metadata?.content
                            ?.split("\n\n")[0]
                            ?.slice(0, 34) + "..."
                        : content?.metadata?.content?.split("\n\n")[0]}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )
      )}
    </div>
  );
};

export default Channels;
