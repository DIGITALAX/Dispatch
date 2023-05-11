import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedPublication from "./FeedPublication";
import { Publication } from "@/components/Home/types/lens.types";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";
import { CommentsProps } from "../types/allPosts.types";

const Comments: FunctionComponent<CommentsProps> = ({
  commentAmounts,
  commentors,
  mirrorLoading,
  reactLoading,
  collectLoading,
  feedType,
  dispatch,
  address,
  followerOnly,
  commentPost,
  reactPost,
  collectPost,
  mirrorPost,
  fetchMoreComments,
  hasMoreComments,
  commentsLoading,
  setCollectLoader,
  setMirrorLoader,
  setReactLoader,
}): JSX.Element => {
  console.log({setReactLoader})
  return (
    <div className="relative w-full h-full flex min-w-full">
      {commentsLoading ? (
        <div className="relative w-full h-auto flex flex-col gap-4 overflow-y-scroll">
          {Array.from({ length: 1 }).map((_, index: number) => {
            return (
              <div
                key={index}
                className="relative w-full h-60 rounded-md animate-pulse border border-white min-w-full opacity-70"
                id="staticLoad"
              ></div>
            );
          })}
        </div>
      ) : (
        <InfiniteScroll
          height={"20rem"}
          loader={<FetchMoreLoading size="6" height="fit-content" />}
          hasMore={hasMoreComments}
          next={fetchMoreComments}
          dataLength={commentors?.length}
          className={`relative w-full h-full max-w-full overflow-y-scroll grow`}
          style={{ color: "#131313", fontFamily: "Digi Reg" }}
          scrollThreshold={0.9}
          scrollableTarget={"scrollableDiv"}
        >
          <div className="w-full h-full relative flex flex-col gap-4 pb-3 min-w-full">
            {commentors?.map((comment: Publication, index: number) => {
              return (
                <FeedPublication
                  key={index}
                  dispatch={dispatch}
                  publication={comment}
                  hasMirrored={commentAmounts.hasMirrored[index]}
                  hasReacted={commentAmounts.hasLiked?.[index]}
                  hasCollected={commentAmounts.hasCollected[index]}
                  followerOnly={followerOnly[index]}
                  collectPost={collectPost}
                  mirrorPost={mirrorPost}
                  reactPost={reactPost}
                  commentPost={commentPost}
                  address={address}
                  index={index}
                  mirrorLoading={mirrorLoading[index]}
                  reactLoading={reactLoading[index]}
                  collectLoading={collectLoading[index]}
                  reactAmount={commentAmounts.like[index]}
                  mirrorAmount={commentAmounts.mirror[index]}
                  collectAmount={commentAmounts.collect[index]}
                  commentAmount={commentAmounts.comment[index]}
                  feedType={feedType}
                  setCollectLoader={setCollectLoader}
                  setMirrorLoader={setMirrorLoader}
                  setReactLoader={setReactLoader}
                />
              );
            })}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Comments;
