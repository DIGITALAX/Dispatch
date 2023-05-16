import useConnect from "@/components/Common/Connect/hooks/useConnect";
import Wallet from "@/components/Common/Connect/modules/Wallet";
import useImageUpload from "@/components/Common/Inputs/hooks/useImageUpload";
import useAllPosts from "@/components/Common/TokenGated/hooks/useAllPosts";
import useCollectOptions from "@/components/Common/TokenGated/hooks/useCollectOptions";
import useComment from "@/components/Common/TokenGated/hooks/useComment";
import useIndividual from "@/components/Common/TokenGated/hooks/useIndividual";
import useMakePost from "@/components/Common/TokenGated/hooks/useMakePost";
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
  const scrollPos = useSelector(
    (state: RootState) => state.app.scrollPosReducer
  );
  const feedType = useSelector((state: RootState) => state.app.feedTypeReducer);
  const commentAmounts = useSelector(
    (state: RootState) => state.app.commentCountReducer
  );
  const commentOpen = useSelector(
    (state: RootState) => state.app.openCommentReducer.value
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const canComment = useSelector(
    (state: RootState) => state.app.canCommentReducer.value
  );
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const collections = useSelector(
    (state: RootState) => state.app.allCollectionsReducer.value
  );
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const postImagesDispatched = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );
  const commentors = useSelector(
    (state: RootState) => state.app.commentsReducer.value
  );
  const individualAmounts = useSelector(
    (state: RootState) => state.app.individualFeedCountReducer
  );
  const postGateImagesDispatched = useSelector(
    (state: RootState) => state.app.postGatedImageReducer.value
  );

  const dispatch = useDispatch();
  const { handleLensSignIn, handleConnect } = useConnect();
  const {
    followerOnly,
    postsLoading,
    hasMore,
    fetchMore,
    fetchMoreTimeline,
    hasMoreTimeline,
    followerOnlyTimeline,
    setScrollPos,
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
    handleSetGif,
    gifOpen,
    setGifOpen,
    handleKeyDownDelete,
  } = useComment();

  const {
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
    setAudienceDropDownPost,
    setAudienceTypePost,
    setChargeCollectDropDownPost,
    setChargeCollectPost,
    valuePost,
    setValuePost,
    enabledCurrencyPost,
    audienceDropDownPost,
    audienceTypePost,
    chargeCollectDropDownPost,
    chargeCollectPost,
    collectibleDropDownPost,
    collectiblePost,
    currencyDropDownPost,
    limitPost,
    limitedDropDownPost,
    limitedEditionPost,
    referralPost,
    setCollectibleDropDownPost,
    setCollectiblePost,
    setEnabledCurrencyPost,
    setCurrencyDropDownPost,
    setLimitPost,
    setLimitedDropDownPost,
    setLimitedEditionPost,
    setReferralPost,
    setTimeLimitDropDownPost,
    setTimeLimitPost,
    timeLimitDropDownPost,
    timeLimitPost,
  } = useCollectOptions();
  const {
    videoLoadingComment,
    imageLoadingComment,
    uploadImages,
    uploadVideo,
    handleRemoveImage,
    mappedFeaturedFilesComment,
    videoLoadingPost,
    imageLoadingPost,
    mappedFeaturedFilesPost,
    setMappedFeaturedFilesComment,
    setMappedFeaturedFilesPost,
    imagesUploaded,
    imagesUploadedPost,
    setVideoLoadingComment,
    setVideoLoadingPost,
    setImageLoadingComment,
    setImageLoadingPost,
  } = useImageUpload();

  const {
    tokenGatePost,
    postDescription,
    postLoading,
    handlePostDescription,
    handleGif: handleGifPost,
    handleGifSubmit: handleGifSubmitPost,
    handleKeyDownDelete: handleKeyDownDeletePost,
    handleMentionClick: handleMentionClickPost,
    handleSetGif: handleSetGifPost,
    caretCoord: caretCoordPost,
    textElement: textPostElement,
    mentionProfiles: mentionProfilesPost,
    profilesOpen: profilesOpenPost,
    results: resultsPost,
    tokenIds,
    setTokenIds
  } = useMakePost();

  switch (auth) {
    case true:
      return (
        <AllPosts
          tokenIds={tokenIds}
          setTokenIds={setTokenIds}
          feedType={feedType}
          dispatch={dispatch}
          feedDispatch={feedDispatch}
          postsLoading={postsLoading}
          followerOnly={followerOnly}
          hasMore={hasMore}
          fetchMore={fetchMore}
          address={address!}
          collectPost={collectPost}
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
          videoLoading={videoLoadingComment}
          uploadImages={uploadImages}
          uploadVideo={uploadVideo}
          imageLoading={imageLoadingComment}
          mappedFeaturedFiles={mappedFeaturedFilesComment}
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
          setScrollPos={setScrollPos}
          scrollPos={scrollPos}
          individualAmounts={individualAmounts}
          tokenGatePost={tokenGatePost}
          postDescription={postDescription}
          textPostElement={textPostElement}
          handlePostDescription={handlePostDescription}
          postLoading={postLoading}
          caretCoordPost={caretCoordPost}
          mentionProfilesPost={mentionProfilesPost}
          profilesOpenPost={profilesOpenPost}
          handleMentionClickPost={handleMentionClickPost}
          handleGifSubmitPost={handleGifSubmitPost}
          handleGifPost={handleGifPost}
          resultsPost={resultsPost}
          handleSetGifPost={handleSetGifPost}
          handleKeyDownDeletePost={handleKeyDownDeletePost}
          videoLoadingPost={videoLoadingPost}
          imageLoadingPost={imageLoadingPost}
          mappedFeaturedFilesPost={mappedFeaturedFilesPost}
          audienceDropDownPost={audienceDropDownPost}
          audienceTypePost={audienceTypePost}
          setAudienceDropDownPost={setAudienceDropDownPost}
          setAudienceTypePost={setAudienceTypePost}
          valuePost={valuePost}
          setChargeCollectPost={setChargeCollectPost}
          setChargeCollectDropDownPost={setChargeCollectDropDownPost}
          setCollectiblePost={setCollectiblePost}
          setCollectibleDropDownPost={setCollectibleDropDownPost}
          setCurrencyDropDownPost={setCurrencyDropDownPost}
          setEnabledCurrencyPost={setEnabledCurrencyPost}
          setLimitPost={setLimitPost}
          setLimitedDropDownPost={setLimitedDropDownPost}
          setLimitedEditionPost={setLimitedEditionPost}
          setReferralPost={setReferralPost}
          setTimeLimitPost={setTimeLimitPost}
          setTimeLimitDropDownPost={setTimeLimitDropDownPost}
          setValuePost={setValuePost}
          enabledCurrencyPost={enabledCurrencyPost}
          chargeCollectPost={chargeCollectPost}
          chargeCollectDropDownPost={chargeCollectDropDownPost}
          limitPost={limitPost}
          limitedDropDownPost={limitedDropDownPost}
          limitedEditionPost={limitedEditionPost}
          timeLimitPost={timeLimitPost}
          timeLimitDropDownPost={timeLimitDropDownPost}
          referralPost={referralPost}
          collectiblePost={collectiblePost}
          collectibleDropDownPost={collectibleDropDownPost}
          currencyDropDownPost={currencyDropDownPost}
          postImagesDispatchedPost={postGateImagesDispatched}
          setMappedFeatureFilesComment={setMappedFeaturedFilesComment}
          setMappedFeatureFilesPost={setMappedFeaturedFilesPost}
          uploadImagesComment={imagesUploaded}
          uploadImagesPost={imagesUploadedPost}
          setVideoLoadingComment={setVideoLoadingComment}
          setVideoLoadingPost={setVideoLoadingPost}
          setImageLoadingComment={setImageLoadingComment}
          setImageLoadingPost={setImageLoadingPost}
          collections={collections}
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
