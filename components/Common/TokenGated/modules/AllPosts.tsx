import { FunctionComponent } from "react";
import MakePost from "./MakePost";
import { AllPostsProps } from "../types/allPosts.types";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";
import InfiniteScroll from "react-infinite-scroll-component";
import { BsToggle2Off, BsToggle2On } from "react-icons/bs";
import FeedPublication from "./FeedPublication";
import { Publication } from "@/components/Home/types/lens.types";

const AllPosts: FunctionComponent<AllPostsProps> = ({
  dispatch,
  followerOnly,
  feedDispatch,
  postsLoading,
  hasMore,
  fetchMore,
  address,
  commentPost,
  collectPost,
  mirrorPost,
  reactPost,
  router,
  viewerOpen,
  mirrorLoading,
  collectLoading,
  reactLoading,
  reactionAmounts,
  feedSwitch,
  setFeedSwitch,
  timelineFollowerOnly,
  timelineDispatch,
  mirrorTimelineLoading,
  collectTimelineLoading,
  reactTimelineLoading,
  reactionTimelineAmounts,
  fetchMoreTimeline,
  hasMoreTimeline,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-fit flex flex-col items-start justify-start gap-4"
      id="here"
    >
      <div className="relative w-full h-10 flex flex-row items-center justify-end ml-auto gap-4">
        <div className="w-fit h-fit text-white font-arcade text-sm">
          {feedSwitch ? "Profile Feed" : "Creator Timeline"}
        </div>
        <div
          className="relative w-fit h-fit cursor-pointer active:scale-95"
          onClick={() => dispatch(setFeedSwitch(!feedSwitch))}
        >
          {feedSwitch ? (
            <BsToggle2On size={30} color="white" />
          ) : (
            <BsToggle2Off size={30} color="white" />
          )}
        </div>
      </div>
      <div className="relative w-full h-full flex flex-col xl:flex-row items-start justify-end gap-8">
        <MakePost />
        {postsLoading ? (
          <div className="relative w-full h-auto flex flex-col gap-4 overflow-y-scroll">
            {Array.from({ length: 10 }).map((_, index: number) => {
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
            height={"39rem"}
            loader={<FetchMoreLoading size="6" height="fit-content" />}
            hasMore={feedSwitch ? hasMore : hasMoreTimeline}
            next={feedSwitch ? fetchMore : fetchMoreTimeline}
            dataLength={
              feedSwitch ? feedDispatch?.length : timelineDispatch?.length
            }
            className={`relative row-start-1 w-full ml-auto h-full max-w-full overflow-y-scroll`}
            style={{ color: "#131313", fontFamily: "Digi Reg" }}
            scrollThreshold={0.9}
            scrollableTarget={"scrollableDiv"}
          >
            <div className="w-full xl:w-210 h-full relative flex flex-col gap-4 pb-3">
              {(feedSwitch ? feedDispatch : timelineDispatch)?.map(
                (publication: Publication, index: number) => {
                  return (
                    <FeedPublication
                      key={index}
                      dispatch={dispatch}
                      publication={publication}
                      type={publication.__typename}
                      hasMirrored={
                        feedSwitch
                          ? reactionAmounts.hasMirrored[index]
                          : reactionTimelineAmounts.hasMirrored[index]
                      }
                      hasReacted={
                        feedSwitch
                          ? reactionAmounts.hasLiked?.[index]
                          : reactionTimelineAmounts.hasLiked?.[index]
                      }
                      hasCollected={
                        feedSwitch
                          ? reactionAmounts.hasCollected[index]
                          : reactionTimelineAmounts.hasCollected[index]
                      }
                      followerOnly={
                        feedSwitch
                          ? followerOnly[index]
                          : timelineFollowerOnly[index]
                      }
                      collectPost={collectPost}
                      mirrorPost={mirrorPost}
                      reactPost={reactPost}
                      commentPost={commentPost}
                      address={address}
                      index={index}
                      viewerOpen={viewerOpen}
                      router={router}
                      mirrorLoading={
                        feedSwitch
                          ? mirrorLoading[index]
                          : mirrorTimelineLoading[index]
                      }
                      reactLoading={
                        feedSwitch
                          ? reactLoading[index]
                          : reactTimelineLoading[index]
                      }
                      collectLoading={
                        feedSwitch
                          ? collectLoading[index]
                          : collectTimelineLoading[index]
                      }
                      reactAmount={
                        feedSwitch
                          ? reactionAmounts.like[index]
                          : reactionTimelineAmounts.like[index]
                      }
                      mirrorAmount={
                        feedSwitch
                          ? reactionAmounts.mirror[index]
                          : reactionTimelineAmounts.mirror[index]
                      }
                      collectAmount={
                        feedSwitch
                          ? reactionAmounts.collect[index]
                          : reactionTimelineAmounts.collect[index]
                      }
                      commentAmount={
                        feedSwitch
                          ? reactionAmounts.comment[index]
                          : reactionTimelineAmounts.comment[index]
                      }
                    />
                  );
                }
              )}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default AllPosts;
