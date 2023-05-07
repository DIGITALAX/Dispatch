import useConnect from "@/components/Common/Connect/hooks/useConnect";
import Wallet from "@/components/Common/Connect/modules/Wallet";
import useAllPost from "@/components/Common/TokenGated/hooks/useAllPosts";
import useReactions from "@/components/Common/TokenGated/hooks/useReactions";
import AllPosts from "@/components/Common/TokenGated/modules/AllPosts";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

const TokenGatedSwitcher: FunctionComponent = (): JSX.Element => {
  const auth = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const { address } = useAccount();
  const router = useRouter();
  const feedDispatch = useSelector(
    (state: RootState) => state.app.feedReducer.value
  );
  const timelineDispatch = useSelector(
    (state: RootState) => state.app.timelineReducer.value
  );
  const viewerOpen = useSelector(
    (state: RootState) => state.app.imageViewerReducer.open
  );
  const reactionAmounts = useSelector(
    (state: RootState) => state.app.reactionFeedCountReducer
  );
  const reactionTimelineAmounts = useSelector(
    (state: RootState) => state.app.reactionTimelineCountReducer
  );
  const dispatch = useDispatch();
  const { handleLensSignIn } = useConnect();
  const {
    feed,
    hasMirrored,
    hasReacted,
    followerOnly,
    postsLoading,
    hasMore,
    fetchMore,
    hasCollected,
    feedSwitch,
    setFeedSwitch,
    timeline,
    fetchMoreTimeline,
    hasMoreTimeline,
    hasCollectedTimeline,
    hasMirroredTimeline,
    hasReactedTimeline,
    followerOnlyTimeline,
  } = useAllPost();

  const {
    commentPost,
    reactPost,
    collectPost,
    mirrorPost,
    reactFeedLoading,
    mirrorFeedLoading,
    collectFeedLoading,
    collectInfoLoading,
    reactTimelineLoading,
    mirrorTimelineLoading,
    collectTimelineLoading,
  } = useReactions();

  switch (auth) {
    case auth:
      return (
        <AllPosts
          feed={feed}
          dispatch={dispatch}
          hasMirrored={hasMirrored}
          hasReacted={hasReacted}
          feedDispatch={feedDispatch}
          postsLoading={postsLoading}
          followerOnly={followerOnly}
          hasMore={hasMore}
          fetchMore={fetchMore}
          address={address!}
          viewerOpen={viewerOpen ? viewerOpen : false}
          collectPost={collectPost}
          commentPost={commentPost}
          reactPost={reactPost}
          mirrorPost={mirrorPost}
          router={router}
          reactLoading={reactFeedLoading}
          collectLoading={collectFeedLoading}
          mirrorLoading={mirrorFeedLoading}
          hasCollected={hasCollected}
          reactionAmounts={reactionAmounts}
          feedSwitch={feedSwitch}
          setFeedSwitch={setFeedSwitch}
          timeline={timeline}
          timelineDispatch={timelineDispatch}
          timelineFollowerOnly={followerOnlyTimeline}
          hasTimelineCollected={hasCollectedTimeline}
          hasTimelineMirrored={hasMirroredTimeline}
          hasTimelineReacted={hasReactedTimeline}
          reactTimelineLoading={reactTimelineLoading}
          mirrorTimelineLoading={mirrorTimelineLoading}
          collectTimelineLoading={collectTimelineLoading}
          fetchMoreTimeline={fetchMoreTimeline}
          hasMoreTimeline={hasMoreTimeline}
          reactionTimelineAmounts={reactionTimelineAmounts}
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
