import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Success from "./Success";
import Error from "./Error";
import Indexing from "./Indexing";
import FullScreenVideo from "./FullScreenVideo";
import { useRef } from "react";

const Modals = () => {
  const dispatch = useDispatch();
  const videoRef = useRef<any>(null);
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
  return (
    <>
      {fullScreenVideo.value && (
        <FullScreenVideo
          dispatch={dispatch}
          mainVideo={mainVideo}
          videoRef={videoRef as any}
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
      {indexingModal?.value && <Indexing message={indexingModal.message} />}
    </>
  );
};

export default Modals;
