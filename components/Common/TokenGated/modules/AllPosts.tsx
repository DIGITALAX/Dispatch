import { FunctionComponent } from "react";
import MakePost from "./MakePost";
import { AllPostsProps } from "../types/allPosts.types";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";
import InfiniteScroll from "react-infinite-scroll-component";
import { BsToggle2Off, BsToggle2On } from "react-icons/bs";
import FeedPublication from "./FeedPublication";
import { Publication } from "@/components/Home/types/lens.types";
import Individual from "./Individual";
import { setFeedType } from "@/redux/reducers/feedTypeSlice";
import MakeComment from "./MakeComment";

const AllPosts: FunctionComponent<AllPostsProps> = ({
  dispatch,
  followerOnly,
  feedDispatch,
  postsLoading,
  hasMore,
  fetchMore,
  address,
  collectPost,
  mirrorPost,
  reactPost,
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
  feedType,
  mainPost,
  followerOnlyMain,
  mainPostLoading,
  hasMoreComments,
  getMorePostComments,
  commentors,
  commentsLoading,
  reactCommentLoading,
  mirrorCommentLoading,
  collectCommentLoading,
  followerOnlyComments,
  commentAmounts,
  collectPostLoading,
  mirrorPostLoading,
  reactPostLoading,
  setMirrorCommentLoading,
  setCollectCommentLoading,
  setReactCommentLoading,
  setCollectPostLoading,
  setMirrorPostLoading,
  setReactPostLoading,
  commentOpen,
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
  handleSetGif,
  gifOpen,
  setGifOpen,
  handleKeyDownDelete,
  collectNotif,
  referral,
  setCollectible,
  collectibleDropDown,
  setCollectibleDropDown,
  collectible,
  setAudienceDropDown,
  audienceType,
  audienceTypes,
  chargeCollect,
  limit,
  limitedEdition,
  audienceDropDown,
  setAudienceType,
  setTimeLimit,
  timeLimit,
  timeLimitDropDown,
  setTimeLimitDropDown,
  setLimitedEdition,
  limitedDropDown,
  setLimitedDropDown,
  setReferral,
  setLimit,
  setChargeCollect,
  setCurrencyDropDown,
  chargeCollectDropDown,
  setChargeCollectDropDown,
  enabledCurrencies,
  enabledCurrency,
  currencyDropDown,
  setEnabledCurrency,
  value,
  setValue,
  handleLensSignIn,
  handleConnect,
  handleRemoveImage,
  authStatus,
  videoLoading,
  profileId,
  uploadImages,
  uploadVideo,
  imageLoading,
  collectOpen,
  mappedFeaturedFiles,
  canComment,
  postImagesDispatched,
  setScrollPos,
  scrollPos,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
      <div className="relative w-full h-10 flex flex-row items-center justify-end ml-auto gap-4">
        <div className="w-fit h-fit text-white font-arcade text-sm">
          {feedSwitch ? "Profile Feed" : "Creator Timeline"}
        </div>
        <div
          className="relative w-fit h-fit cursor-pointer active:scale-95"
          onClick={() => {
            dispatch(
              setFeedType({
                actionValue: "",
                actionIndex: 0,
              })
            );
            dispatch(setFeedSwitch(!feedSwitch));
          }}
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
        {feedType.value !== "" ? (
          <Individual
            dispatch={dispatch}
            commentors={commentors}
            fetchMoreComments={getMorePostComments}
            commentsLoading={commentsLoading}
            mainPost={mainPost!}
            hasMoreComments={hasMoreComments}
            mirrorPost={mirrorPost}
            collectPost={collectPost}
            reactPost={reactPost}
            followerOnlyMain={followerOnlyMain}
            reactCommentLoading={reactCommentLoading}
            mirrorCommentLoading={mirrorCommentLoading}
            collectCommentLoading={collectCommentLoading}
            mainPostLoading={mainPostLoading}
            address={address}
            feedType={feedType}
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
            postAmounts={reactionAmounts}
            commentPost={commentPost}
            commentDescription={commentDescription}
            textElement={textElement}
            handleCommentDescription={handleCommentDescription}
            commentLoading={commentLoading}
            caretCoord={caretCoord}
            mentionProfiles={mentionProfiles}
            profilesOpen={profilesOpen}
            handleMentionClick={handleMentionClick}
            handleGifSubmit={handleGifSubmit}
            handleGif={handleGif}
            results={results}
            handleSetGif={handleSetGif}
            gifOpen={gifOpen}
            setGifOpen={setGifOpen}
            handleKeyDownDelete={handleKeyDownDelete}
            commentOpen={commentOpen}
            handleLensSignIn={handleLensSignIn}
            handleConnect={handleConnect}
            handleRemoveImage={handleRemoveImage}
            authStatus={authStatus}
            profileId={profileId}
            videoLoading={videoLoading}
            uploadImages={uploadImages}
            uploadVideo={uploadVideo}
            imageLoading={imageLoading}
            mappedFeaturedFiles={mappedFeaturedFiles}
            collectOpen={collectOpen}
            enabledCurrencies={enabledCurrencies}
            audienceDropDown={audienceDropDown}
            audienceType={audienceType}
            setAudienceDropDown={setAudienceDropDown}
            setAudienceType={setAudienceType}
            value={value}
            setChargeCollect={setChargeCollect}
            setChargeCollectDropDown={setChargeCollectDropDown}
            setCollectible={setCollectible}
            setCollectibleDropDown={setCollectibleDropDown}
            setCurrencyDropDown={setCurrencyDropDown}
            setEnabledCurrency={setEnabledCurrency}
            setLimit={setLimit}
            setLimitedDropDown={setLimitedDropDown}
            setLimitedEdition={setLimitedEdition}
            setReferral={setReferral}
            setTimeLimit={setTimeLimit}
            setTimeLimitDropDown={setTimeLimitDropDown}
            setValue={setValue}
            enabledCurrency={enabledCurrency}
            chargeCollect={chargeCollect}
            chargeCollectDropDown={chargeCollectDropDown}
            limit={limit}
            limitedDropDown={limitedDropDown}
            limitedEdition={limitedEdition}
            timeLimit={timeLimit}
            timeLimitDropDown={timeLimitDropDown}
            audienceTypes={audienceTypes}
            referral={referral}
            canComment={canComment}
            collectNotif={collectNotif}
            collectible={collectible}
            collectibleDropDown={collectibleDropDown}
            currencyDropDown={currencyDropDown}
            postImagesDispatched={postImagesDispatched}
          />
        ) : postsLoading ? (
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
            onScroll={(e) => setScrollPos(e)}
            initialScrollY={feedSwitch ? scrollPos.feed : scrollPos.timeline}
          >
            <div className="w-full xl:max-w-230 h-full relative flex flex-col gap-4 pb-3">
              {(feedSwitch ? feedDispatch : timelineDispatch)?.map(
                (publication: Publication, index: number) => {
                  return (
                    <div
                      className="relative w-full h-fit gap-2 flex flex-col"
                      key={index}
                    >
                      <FeedPublication
                        dispatch={dispatch}
                        publication={publication}
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
                        address={address}
                        index={index}
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
                        feedType={feedType.value}
                        openComment={commentOpen}
                      />
                      {(publication?.__typename === "Mirror"
                        ? publication?.mirrorOf?.id
                        : publication?.id) === commentOpen && (
                        <MakeComment
                          commentPost={commentPost}
                          commentDescription={commentDescription}
                          textElement={textElement}
                          handleCommentDescription={handleCommentDescription}
                          commentLoading={commentLoading}
                          caretCoord={caretCoord}
                          mentionProfiles={mentionProfiles}
                          profilesOpen={profilesOpen}
                          handleMentionClick={handleMentionClick}
                          handleGifSubmit={handleGifSubmit}
                          handleGif={handleGif}
                          results={results}
                          handleSetGif={handleSetGif}
                          gifOpen={gifOpen}
                          setGifOpen={setGifOpen}
                          handleKeyDownDelete={handleKeyDownDelete}
                          handleLensSignIn={handleLensSignIn}
                          handleConnect={handleConnect}
                          handleRemoveImage={handleRemoveImage}
                          authStatus={authStatus}
                          profileId={profileId}
                          videoLoading={videoLoading}
                          uploadImages={uploadImages}
                          uploadVideo={uploadVideo}
                          imageLoading={imageLoading}
                          mappedFeaturedFiles={mappedFeaturedFiles}
                          collectOpen={collectOpen}
                          enabledCurrencies={enabledCurrencies}
                          audienceDropDown={audienceDropDown}
                          audienceType={audienceType}
                          setAudienceDropDown={setAudienceDropDown}
                          setAudienceType={setAudienceType}
                          value={value}
                          setChargeCollect={setChargeCollect}
                          setChargeCollectDropDown={setChargeCollectDropDown}
                          setCollectible={setCollectible}
                          setCollectibleDropDown={setCollectibleDropDown}
                          setCurrencyDropDown={setCurrencyDropDown}
                          setEnabledCurrency={setEnabledCurrency}
                          setLimit={setLimit}
                          setLimitedDropDown={setLimitedDropDown}
                          setLimitedEdition={setLimitedEdition}
                          setReferral={setReferral}
                          setTimeLimit={setTimeLimit}
                          setTimeLimitDropDown={setTimeLimitDropDown}
                          setValue={setValue}
                          enabledCurrency={enabledCurrency}
                          chargeCollect={chargeCollect}
                          chargeCollectDropDown={chargeCollectDropDown}
                          limit={limit}
                          limitedDropDown={limitedDropDown}
                          limitedEdition={limitedEdition}
                          timeLimit={timeLimit}
                          timeLimitDropDown={timeLimitDropDown}
                          audienceTypes={audienceTypes}
                          referral={referral}
                          canComment={canComment}
                          collectNotif={collectNotif}
                          collectible={collectible}
                          collectibleDropDown={collectibleDropDown}
                          commentId={commentOpen}
                          currencyDropDown={currencyDropDown}
                          dispatch={dispatch}
                          postImagesDispatched={postImagesDispatched}
                        />
                      )}
                    </div>
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
