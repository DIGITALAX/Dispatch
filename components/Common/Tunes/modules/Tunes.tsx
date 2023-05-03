import { FunctionComponent } from "react";
import Player from "./Player";
import Controls from "./Controls";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { TunesProps } from "../types/video.types";

const Tunes: FunctionComponent<TunesProps> = ({
  videos,
  collectAmount,
  mirrorAmount,
  likeAmount,
  streamRef,
  formatTime,
  volume,
  handleVolumeChange,
  volumeOpen,
  setVolumeOpen,
  handleHeart,
  mirrorVideo,
  collectVideo,
  likeVideo,
  mirrorLoading,
  collectLoading,
  likeLoading,
  profileId,
  wrapperRef,
  progressRef,
  handleSeek,
  videoSync,
}): JSX.Element => {
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  return (
    <div className="relative w-full h-24 md:h-16 bg-chroma bg-cover flex gap-2 justify-center items-center">
      <div
        className={`relative w-full h-24 md:h-16 flex gap-2 items-center justify-center flex-row bg-black/50 p-2`}
      >
        <Player
          streamRef={streamRef}
          mainVideo={mainVideo}
          videos={videos}
          volume={volume}
          wrapperRef={wrapperRef}
          dispatchVideos={dispatchVideos}
          fullScreen={false}
          muted={false}
          videoSync={videoSync}
        />
        <Controls
          formatTime={formatTime}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
          volumeOpen={volumeOpen}
          setVolumeOpen={setVolumeOpen}
          handleHeart={handleHeart}
          collected={mainVideo.collected}
          mirrored={mainVideo.mirrored}
          liked={mainVideo.liked}
          mirrorVideo={mirrorVideo}
          collectVideo={collectVideo}
          likeVideo={likeVideo}
          likeLoading={likeLoading}
          collectLoading={collectLoading}
          mirrorLoading={mirrorLoading}
          authStatus={authStatus}
          profileId={profileId}
          mainVideo={mainVideo}
          videos={videos}
          videoSync={videoSync}
          progressRef={progressRef}
          handleSeek={handleSeek}
          dispatchVideos={dispatchVideos}
          collectAmount={collectAmount}
          mirrorAmount={mirrorAmount}
          likeAmount={likeAmount}
        />
      </div>
    </div>
  );
};

export default Tunes;
