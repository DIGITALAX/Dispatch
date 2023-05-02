import { FunctionComponent } from "react";
import Player from "./Player";
import Controls from "./Controls";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { TunesProps } from "../types/video.types";

const Tunes: FunctionComponent<TunesProps> = ({
  videos,
  mirrored,
  liked,
  videosLoading,
  collected,
  collectAmount,
  mirrorAmount,
  likeAmount,
  streamRef,
  formatTime,
  duration,
  currentTime,
  volume,
  handleVolumeChange,
  isPlaying,
  volumeOpen,
  setVolumeOpen,
  handleHeart,
  heart,
  mirrorVideo,
  collectVideo,
  likeVideo,
  mirrorLoading,
  collectLoading,
  likeLoading,
  profileId,
  setIsPlaying,
  setCurrentTime,
  setDuration,
  wrapperRef,
  progressRef,
  handleSeek,
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
    <div className="relative w-full h-16 bg-chroma bg-cover flex gap-2 justify-center items-center">
      <div
        className={`relative w-full h-16 flex gap-2 items-center justify-center flex-row bg-black/50 p-2`}
      >
        <Player
          heart={heart}
          streamRef={streamRef}
          mainVideo={mainVideo}
          isPlaying={isPlaying}
          setCurrentTime={setCurrentTime}
          setDuration={setDuration}
          videos={videos}
          likedArray={liked}
          mirroredArray={mirrored}
          volume={volume}
          wrapperRef={wrapperRef}
          videosLoading={videosLoading}
          dispatchVideos={dispatchVideos}
          collectedArray={collected}
          fullScreen={false}
          muted={false}
        />
        <Controls
          formatTime={formatTime}
          duration={duration}
          currentTime={currentTime}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
          isPlaying={isPlaying}
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
          likedArray={liked}
          mirroredArray={mirrored}
          videos={videos}
          setIsPlaying={setIsPlaying}
          progressRef={progressRef}
          handleSeek={handleSeek}
          dispatchVideos={dispatchVideos}
          collectedArray={collected}
          collectAmount={collectAmount}
          mirrorAmount={mirrorAmount}
          likeAmount={likeAmount}
        />
      </div>
    </div>
  );
};

export default Tunes;
