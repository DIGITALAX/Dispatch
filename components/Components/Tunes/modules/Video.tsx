import { FunctionComponent } from "react";
import Channels from "./Channels";
import Tunes from "./Tunes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useChannels from "../hooks/useChannels";
import useControls from "../hooks/useControls";
import Marquee from "../../Marquee/Marquee";

const Video: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const {
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
  return (
    <div className="sticky w-full h-full flex flex-col items-center justify-center bottom-0">
      <Channels
        videos={videos}
        dispatch={dispatch}
        liked={liked}
        mirrored={mirrored}
        videosLoading={videosLoading}
        dispatchVideos={dispatchVideos}
        collected={collected}
      />
      <Tunes
        videos={videos}
        mirrored={mirrored}
        liked={liked}
        videosLoading={videosLoading}
        collected={collected}
        collectAmount={collectAmount}
        mirrorAmount={mirrorAmount}
        likeAmount={likeAmount}
        streamRef={streamRef}
        formatTime={formatTime}
        duration={duration}
        currentTime={currentTime}
        volume={volume}
        handleVolumeChange={handleVolumeChange}
        isPlaying={isPlaying}
        volumeOpen={volumeOpen}
        setVolumeOpen={setVolumeOpen}
        handleHeart={handleHeart}
        heart={heart}
        mirrorVideo={mirrorVideo}
        collectVideo={collectVideo}
        likeVideo={likeVideo}
        mirrorLoading={mirrorLoading}
        collectLoading={collectLoading}
        likeLoading={likeLoading}
        profileId={profileId}
        setIsPlaying={setIsPlaying}
        setCurrentTime={setCurrentTime}
        setDuration={setDuration}
        wrapperRef={wrapperRef}
        progressRef={progressRef}
        handleSeek={handleSeek}
      />
      <Marquee />
    </div>
  );
};

export default Video;
