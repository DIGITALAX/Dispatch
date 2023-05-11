import useConnect from "@/components/Common/Connect/hooks/useConnect";
import Wallet from "@/components/Common/Connect/modules/Wallet";
import useAllPosts from "@/components/Common/TokenGated/hooks/useAllPosts";
import useComment from "@/components/Common/TokenGated/hooks/useComment";
import useIndividual from "@/components/Common/TokenGated/hooks/useIndividual";
import useReactions from "@/components/Common/TokenGated/hooks/useReactions";
import AllPosts from "@/components/Common/TokenGated/modules/AllPosts";
import { setFeedSwitchRedux } from "@/redux/reducers/feedSwitchSlice";
import { RootState } from "@/redux/store";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

const TokenGatedSwitcher: FunctionComponent = (): JSX.Element => {
  const auth = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const { address } = useAccount();
  const feedDispatch = useSelector(
    (state: RootState) => state.app.feedReducer.value
  );
  const timelineDispatch = useSelector(
    (state: RootState) => state.app.timelineReducer.value
  );
  const reactionAmounts = useSelector(
    (state: RootState) => state.app.reactionFeedCountReducer
  );
  const reactionTimelineAmounts = useSelector(
    (state: RootState) => state.app.reactionTimelineCountReducer
  );
  const feedSwitch = useSelector(
    (state: RootState) => state.app.feedSwitchReducer.value
  );
  const feedType = useSelector((state: RootState) => state.app.feedTypeReducer);
  const commentAmounts = useSelector(
    (state: RootState) => state.app.commentCountReducer
  );
  const dispatch = useDispatch();
  const { handleLensSignIn } = useConnect();
  const {
    followerOnly,
    postsLoading,
    hasMore,
    fetchMore,
    fetchMoreTimeline,
    hasMoreTimeline,
    followerOnlyTimeline,
  } = useAllPosts();

  const {
    reactPost,
    collectPost,
    mirrorPost,
    reactFeedLoading,
    mirrorFeedLoading,
    collectFeedLoading,
    reactTimelineLoading,
    mirrorTimelineLoading,
    collectTimelineLoading,
  } = useReactions();

  const {
    getMorePostComments,
    commentors,
    hasMoreComments,
    commentsLoading,
    mainPostLoading,
    followerOnly: followerOnlyMain,
    mainPost,
    followerOnlyComments,
    reactCommentLoading,
    mirrorCommentLoading,
    collectCommentLoading,
    setMirrorCommentLoading,
    setCollectCommentLoading,
    setReactCommentLoading,
    setCollectPostLoading,
    setMirrorPostLoading,
    setReactPostLoading,
    collectPostLoading,
    reactPostLoading,
    mirrorPostLoading,
  } = useIndividual();

  const {
    commentPost,
    commentDescription,
    textElement,
    handleCommentDescription,
    commentLoading,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    handleGifSubmit,
    handleGif,
    results,
    gifs,
    handleSetGif,
    gifOpen,
    setGifOpen,
    handleKeyDownDelete,
  } = useComment();

  switch (auth) {
    case true:
      return (
        <AllPosts
          feedType={feedType}
          dispatch={dispatch}
          feedDispatch={feedDispatch}
          postsLoading={postsLoading}
          followerOnly={followerOnly}
          hasMore={hasMore}
          fetchMore={fetchMore}
          address={address!}
          collectPost={collectPost}
          commentPost={commentPost}
          reactPost={reactPost}
          mirrorPost={mirrorPost}
          reactLoading={reactFeedLoading}
          collectLoading={collectFeedLoading}
          mirrorLoading={mirrorFeedLoading}
          reactionAmounts={reactionAmounts}
          feedSwitch={feedSwitch}
          setFeedSwitch={setFeedSwitchRedux}
          timelineDispatch={timelineDispatch}
          timelineFollowerOnly={followerOnlyTimeline}
          reactTimelineLoading={reactTimelineLoading}
          mirrorTimelineLoading={mirrorTimelineLoading}
          collectTimelineLoading={collectTimelineLoading}
          fetchMoreTimeline={fetchMoreTimeline}
          hasMoreTimeline={hasMoreTimeline}
          reactionTimelineAmounts={reactionTimelineAmounts}
          mainPost={mainPost!}
          followerOnlyMain={followerOnlyMain}
          mainPostLoading={mainPostLoading}
          hasMoreComments={hasMoreComments}
          getMorePostComments={getMorePostComments}
          commentors={commentors}
          commentsLoading={commentsLoading}
          reactCommentLoading={reactCommentLoading}
          mirrorCommentLoading={mirrorCommentLoading}
          collectCommentLoading={collectCommentLoading}
          followerOnlyComments={followerOnlyComments}
          commentAmounts={commentAmounts}
          collectPostLoading={collectPostLoading}
          mirrorPostLoading={mirrorPostLoading}
          reactPostLoading={reactPostLoading}
          setMirrorCommentLoading={setMirrorCommentLoading}
          setCollectCommentLoading={setCollectCommentLoading}
          setReactCommentLoading={setReactCommentLoading}
          setCollectPostLoading={setCollectPostLoading}
          setMirrorPostLoading={setMirrorPostLoading}
          setReactPostLoading={setReactPostLoading}
        />
      );

    default:
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-2">
          <div className="relative w-fit h-fit font-arcade items-center justify-center text-center text-white">
            Connect with Lens for Token Gating
          </div>
          <Wallet handleTransaction={handleLensSignIn} buttonText={"SOCIAL"} />
        </div>
      );
  }
};

export default TokenGatedSwitcher;
