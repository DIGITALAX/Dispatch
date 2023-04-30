import { FunctionComponent } from "react";
import Player from "./Player";
import Controls from "./Controls";
import useControls from "../hooks/useControls";
import useChannels from "../hooks/useChannels";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Tunes: FunctionComponent = (): JSX.Element => {
  const {
    fullScreen,
    setFullScreen,
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
    authStatus,
    mainVideo,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    wrapperRef,
    progressRef,
    handleSeek,
  } = useControls();
  const {
    videos,
    mirrored,
    liked,
    videosLoading,
    collected,
    collectAmount,
    mirrorAmount,
    likeAmount,
  } = useChannels();
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  return (
    <div className="relative w-full h-28 bg-chroma bg-cover flex gap-2 justify-center items-center">
      <div
        className={`relative w-full h-full flex gap-2 items-center justify-center flex-row bg-black/50 p-2`}
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
        />
        <Controls
          fullScreen={fullScreen}
          setFullScreen={setFullScreen}
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
