import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Success from "./Success";
import Error from "./Error";
import Indexing from "./Indexing";
import FullScreenVideo from "./FullScreenVideo";
import useControls from "../../Tunes/hooks/useControls";
import { useRef } from "react";
import ImageViewerModal from "./ImageViewer";
import Purchase from "./Purchase";

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
  const imageViewer = useSelector(
    (state: RootState) => state.app.imageViewerReducer
  );
  const reaction = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const { fullVideoRef, wrapperRef } = useControls();
  return (
    <>
      {/* {reaction.open && reaction.type === "heart" && (
        <Heart
          reacters={reacters}
          getMorePostReactions={getMorePostReactions}
          reactionPost={reactionPost}
          reactionLoading={reactionLoading}
          reactionInfoLoading={reactionInfoLoading}
        />
      )} */}
      {/* {reaction.open && reaction.type === "collect" && (
        <Purchase
          collectInfoLoading={collectInfoLoading}
          approvalLoading={approvalLoading}
          address={address}
          collectModuleValues={collectModuleValues}
          lensProfile={lensProfile}
          collectComment={collectVideo}
          collectLoading={collectLoading[purchaseModal?.index!]}
          approveCurrency={approveCurrency}
          handleLensSignIn={handleLensSignIn}
          commentId={purchaseModal?.id}
        />
      )} */}
      {/* {reaction.open && reaction.type === "mirror" && (
        <Mirror
         
        />
      )}
      {
        <Collect />
      } */}
      {fullScreenVideo.value && (
        <FullScreenVideo
          dispatch={dispatch}
          mainVideo={mainVideo}
          streamRef={fullVideoRef}
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
      {indexingModal?.value && <Indexing message={indexingModal.message} />}
      {imageViewer?.open && (
        <ImageViewerModal
          image={imageViewer.image}
          type={imageViewer.type}
          dispatch={dispatch}
        />
      )}
    </>
  );
};

export default Modals;
