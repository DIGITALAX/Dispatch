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
  const videoSync = useSelector(
    (state: RootState) => state.app.videoSyncReducer
  );
  const {
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
    streamRef
  } = useControls();
  const {
    videos,
    collectAmount,
    mirrorAmount,
    likeAmount,
  } = useChannels();
  return (
    <div className="sticky w-full h-full flex flex-col items-center justify-center bottom-0">
      <Channels
        videos={videos}
        dispatch={dispatch}
        dispatchVideos={dispatchVideos}
        videoSync={videoSync}
      />
      <Tunes
        videos={videos}
        collectAmount={collectAmount}
        mirrorAmount={mirrorAmount}
        likeAmount={likeAmount}
        streamRef={streamRef}
        formatTime={formatTime}
        volume={volume}
        handleVolumeChange={handleVolumeChange}
        volumeOpen={volumeOpen}
        setVolumeOpen={setVolumeOpen}
        handleHeart={handleHeart}
        mirrorVideo={mirrorVideo}
        collectVideo={collectVideo}
        likeVideo={likeVideo}
        mirrorLoading={mirrorLoading}
        collectLoading={collectLoading}
        likeLoading={likeLoading}
        profileId={profileId}
        videoSync={videoSync}
        wrapperRef={wrapperRef}
        progressRef={progressRef}
        handleSeek={handleSeek}
      />
      <Marquee />
    </div>
  );
};

export default Video;
