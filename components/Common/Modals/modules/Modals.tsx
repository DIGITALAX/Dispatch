import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Success from "./Success";
import Error from "./Error";
import Indexing from "./Indexing";
import FullScreenVideo from "./FullScreenVideo";
import useControls from "../../Tunes/hooks/useControls";
import { useRef } from "react";
import ImageViewerModal from "./ImageViewer";
import Who from "./Who";
import useWho from "../../TokenGated/hooks/useWho";
import Purchase from "./Purchase";
import useReactions from "../../TokenGated/hooks/useReactions";
import { useAccount } from "wagmi";
import useConnect from "../../Connect/hooks/useConnect";
import useFollowers from "../../TokenGated/hooks/useFollowers";
import FollowerOnly from "./FollowerOnly";

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
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
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
  const purchase = useSelector((state: RootState) => state.app.purchaseReducer);
  const collectModuleValues = useSelector(
    (state: RootState) => state.app.postCollectReducer
  );
  const followersModal = useSelector(
    (state: RootState) => state.app.followerOnlyReducer
  );
  const feedSwitch = useSelector(
    (state: RootState) => state.app.feedSwitchReducer.value
  );
  const { fullVideoRef, wrapperRef } = useControls();
  const {
    reacters,
    mirrorers,
    collectors,
    getMorePostCollects,
    getMorePostMirrors,
    getMorePostReactions,
    mirrorInfoLoading,
    reactInfoLoading,
    collectInfoLoading,
    hasMoreReact,
    hasMoreCollect,
    hasMoreMirror,
  } = useWho();
  const {
    profile,
    followProfile,
    followLoading,
    approved,
    approveCurrency: approveFollowCurrency,
  } = useFollowers();
  const {
    collectInfoLoading: purchaseInfoLoading,
    approvalLoading,
    collectFeedLoading,
    collectTimelineLoading,
    approveCurrency,
    collectPost,
  } = useReactions();
  const { address } = useAccount();
  const { handleLensSignIn } = useConnect();
  return (
    <>
      {reaction.open && (
        <Who
          accounts={
            reaction.type === "heart"
              ? reacters
              : reaction.type === "mirror"
              ? mirrorers
              : collectors
          }
          fetchMore={
            reaction.type === "heart"
              ? getMorePostReactions
              : reaction.type === "mirror"
              ? getMorePostMirrors
              : getMorePostCollects
          }
          loading={
            reaction.type === "heart"
              ? reactInfoLoading
              : reaction.type === "mirror"
              ? mirrorInfoLoading
              : collectInfoLoading
          }
          dispatch={dispatch}
          hasMore={
            reaction.type === "heart"
              ? hasMoreReact
              : reaction.type === "mirror"
              ? hasMoreMirror
              : hasMoreCollect
          }
          type={
            reaction.type === "heart" ? 0 : reaction.type === "collect" ? 1 : 2
          }
        />
      )}
      {purchase.open && (
        <Purchase
          collectInfoLoading={purchaseInfoLoading}
          approvalLoading={approvalLoading}
          address={address}
          collectModuleValues={collectModuleValues}
          lensProfile={lensProfile}
          collectComment={collectPost}
          collectLoading={
            (feedSwitch ? collectFeedLoading : collectTimelineLoading)[
              purchase?.index!
            ]
          }
          approveCurrency={approveCurrency}
          handleLensSignIn={handleLensSignIn}
          commentId={purchase?.id}
          dispatch={dispatch}
        />
      )}
      {followersModal?.open && (
        <FollowerOnly
          profile={profile}
          followProfile={followProfile}
          followLoading={followLoading}
          approved={approved}
          approveCurrency={approveFollowCurrency}
        />
      )}
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
