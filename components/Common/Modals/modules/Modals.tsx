import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Success from "./Success";
import Error from "./Error";
import Indexing from "./Indexing";
import FullScreenVideo from "./FullScreenVideo";
import useControls from "../../Tunes/hooks/useControls";
import { useRef } from "react";

const Modals = () => {
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLDivElement>(null);
  const indexingModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const successModal = useSelector(
    (state: RootState) => state.app.successModalReducer
  );
  const errorModal = useSelector((state: RootState) => state.app.modalReducer);
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const videoSync = useSelector(
    (state: RootState) => state.app.videoSyncReducer
  );
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const { streamRef, wrapperRef } = useControls();
  return (
    <>
      {fullScreenVideo.value && (
        <FullScreenVideo
          dispatch={dispatch}
          mainVideo={mainVideo}
          streamRef={streamRef}
          wrapperRef={wrapperRef}
          videos={dispatchVideos}
          dispatchVideos={dispatchVideos}
          videoSync={videoSync}
          videoRef={videoRef}
        />
      )}
      {errorModal.open && (
        <Error dispatch={dispatch} message={errorModal.message} />
      )}
      {successModal.open && (
        <Success
          dispatch={dispatch}
          media={successModal.media}
          link={successModal.link}
          message={successModal.message}
        />
      )}
      {!indexingModal?.value && <Indexing message={indexingModal.message} />}
    </>
  );
};

export default Modals;
