import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedPublication from "./FeedPublication";
import { Publication } from "@/components/Home/types/lens.types";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";
import { CommentsProps } from "../types/allPosts.types";
import MakeComment from "./MakeComment";

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
  reactPost,
  collectPost,
  mirrorPost,
  fetchMoreComments,
  hasMoreComments,
  commentsLoading,
  setCollectLoader,
  setMirrorLoader,
  setReactLoader,
  authStatus,
  profileId,
  commentPost,
  handleLensSignIn,
  handleConnect,
  commentDescription,
  commentLoading,
  handleCommentDescription,
  textElement,
  caretCoord,
  mentionProfiles,
  profilesOpen,
  handleMentionClick,
  videoLoading,
  imageLoading,
  uploadImages,
  uploadVideo,
  mappedFeaturedFiles,
  postImagesDispatched,
  handleRemoveImage,
  handleGifSubmit,
  handleGif,
  results,
  handleSetGif,
  setGifOpen,
  gifOpen,
  collectOpen,
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
  handleKeyDownDelete,
  commentId,
  canComment,
  openComment,
}): JSX.Element => {
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
                <div
                  className="relative w-full h-fit flex flex-col gap-2"
                  key={index}
                >
                  <FeedPublication
                    dispatch={dispatch}
                    publication={comment}
                    hasMirrored={commentAmounts.hasMirrored[index]}
                    hasReacted={commentAmounts.hasLiked?.[index]}
                    hasCollected={commentAmounts.hasCollected[index]}
                    followerOnly={followerOnly[index]}
                    collectPost={collectPost}
                    mirrorPost={mirrorPost}
                    reactPost={reactPost}
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
                    openComment={openComment}
                  />
                  {comment?.id === commentId && (
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
                      commentId={commentId}
                      currencyDropDown={currencyDropDown}
                      dispatch={dispatch}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Comments;
