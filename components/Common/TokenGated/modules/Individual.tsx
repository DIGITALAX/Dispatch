import { FunctionComponent } from "react";
import FeedPublication from "./FeedPublication";
import Comments from "./Comments";
import { setFeedType } from "@/redux/reducers/feedTypeSlice";
import { AiFillFastBackward } from "react-icons/ai";
import { IndividualProps } from "../types/allPosts.types";

const Individual: FunctionComponent<IndividualProps> = ({
  dispatch,
  mainPost,
  feedType,
  address,
  followerOnlyMain,
  collectPost,
  mirrorPost,
  commentPost,
  reactPost,
  mainPostLoading,
  commentAmounts,
  commentors,
  mirrorCommentLoading,
  reactCommentLoading,
  collectCommentLoading,
  followerOnlyComments,
  hasMoreComments,
  fetchMoreComments,
  commentsLoading,
  collectPostLoading,
  setCollectCommentLoading,
  setCollectPostLoading,
  setMirrorCommentLoading,
  setMirrorPostLoading,
  setReactCommentLoading,
  setReactPostLoading,
  mirrorPostLoading,
  reactPostLoading,
  postAmounts,
}): JSX.Element => {
  return (
    <div className="relative flex flex-col items-start justify-start gap-3 h-full w-full min-w-230">
      <div className="sticky z-1 w-full h-10 flex flex-col items-center justify-start">
        <div
          className="relative w-full h-full flex items-center cursor-pointer"
          onClick={() => {
            dispatch(
              setFeedType({
                actionValue: "",
                actionIndex: 0,
              })
            );
          }}
        >
          <AiFillFastBackward color="white" size={20} />
        </div>
      </div>
      {!mainPostLoading ? (
        <FeedPublication
          dispatch={dispatch}
          publication={mainPost}
          hasMirrored={postAmounts?.hasMirrored[feedType.index]}
          hasReacted={postAmounts?.hasLiked[feedType.index]}
          hasCollected={postAmounts?.hasCollected[feedType.index]}
          followerOnly={followerOnlyMain}
          collectPost={collectPost}
          mirrorPost={mirrorPost}
          reactPost={reactPost}
          commentPost={commentPost}
          address={address as any}
          index={0}
          mirrorLoading={mirrorPostLoading[feedType.index]}
          reactLoading={reactPostLoading[feedType.index]}
          collectLoading={collectPostLoading[feedType.index]}
          reactAmount={postAmounts?.like[feedType.index]}
          mirrorAmount={postAmounts?.mirror[feedType.index]}
          collectAmount={postAmounts?.collect[feedType.index]}
          commentAmount={postAmounts?.comment[feedType.index]}
          feedType={feedType.value}
          setCollectLoader={setCollectPostLoading}
          setMirrorLoader={setMirrorPostLoading}
          setReactLoader={setReactPostLoading}
        />
      ) : (
        <div
          className="relative w-full h-60 rounded-md animate-pulse border border-white min-w-full opacity-70"
          id="staticLoad"
        ></div>
      )}
      <Comments
        dispatch={dispatch}
        commentors={commentors}
        commentAmounts={commentAmounts}
        collectPost={collectPost}
        mirrorPost={mirrorPost}
        reactPost={reactPost}
        commentPost={commentPost}
        address={address as `0x${string}`}
        mirrorLoading={mirrorCommentLoading}
        reactLoading={reactCommentLoading}
        collectLoading={collectCommentLoading}
        feedType={feedType.value}
        followerOnly={followerOnlyComments}
        fetchMoreComments={fetchMoreComments}
        hasMoreComments={hasMoreComments}
        commentsLoading={commentsLoading}
        setCollectLoader={setCollectCommentLoading}
        setMirrorLoader={setMirrorCommentLoading}
        setReactLoader={setReactCommentLoading}
      />
    </div>
  );
};

export default Individual;
