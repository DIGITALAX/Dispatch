import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FormEvent, FunctionComponent, KeyboardEvent, useRef } from "react";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { AiOutlineLoading } from "react-icons/ai";
import { setModal } from "@/redux/reducers/modalSlice";
import syncScroll from "@/lib/helpers/syncScroll";
import ImageUploads from "./ImageUploads";
import { MakeCommentProps } from "../types/allPosts.types";
import CollectButton from "../../Miscellaneous/modules/CollectButton";
import CollectInput from "../../Miscellaneous/modules/CollectInput";
import OptionsComment from "./OptionsComment";
import { setCollectOpen } from "@/redux/reducers/collectOpenSlice";

const MakeComment: FunctionComponent<MakeCommentProps> = ({
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
  dispatch,
  handleKeyDownDelete,
  commentId,
  canComment,
  setMappedFeatureFilesComment,
  uploadImagesComment,
  setVideoLoadingComment,
  setImageLoadingComment,
  preElement,
}): JSX.Element => {
  return (
    <div className="relative w-full h-60 flex flex-col">
      <div className="relative w-full h-full rounded-2xl border-2 border-black bg-gradient-to-r from-offBlack via-gray-600 to-black p-4 flex flex-col gap-3">
        {(mappedFeaturedFiles?.length !== 0 ||
          postImagesDispatched?.length !== 0) && (
          <ImageUploads
            handleRemoveImage={handleRemoveImage}
            commentLoading={commentLoading}
            postImagesDispatched={postImagesDispatched}
            setMappedFeatureFiles={setMappedFeatureFilesComment}
            uploadImages={uploadImagesComment}
          />
        )}
        {gifOpen ? (
          <div className="relative w-full h-full grid grid-flow-row auto-rows-auto overflow-y-scroll">
            <div className="relative w-full h-fit flex flex-row gap-2">
              <input
                className={`relative row-start-1 col-start-1 h-10 bg-black border border-white font-geom text-white p-2 rounded-md caret-transparent w-full text-sm`}
                name="gif"
                onChange={(e: FormEvent) => handleGif(e)}
              />
              <div
                className="relative w-20 border border-white flex items-center text-center justify-center text-white font-economicaB rounded-md cursor-pointer active:scale-95"
                onClick={() => handleGifSubmit()}
              >
                Search
              </div>
            </div>
            {results?.length !== 0 && (
              <div className="relative w-full h-full flex flex-row flex-wrap justify-center overflow-y-scroll gap-2 pt-3">
                {results?.map((result: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-16 h-12 bg-white cursor-pointer active:scale-95 place-self-center"
                      onClick={() =>
                        handleSetGif(result?.media_formats?.gif?.url)
                      }
                    >
                      <Image
                        layout="fill"
                        objectFit="cover"
                        src={result?.media_formats?.gif?.url}
                        draggable={false}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : collectOpen ? (
          <div className="relative w-full h-full flex overflow-y-scroll items-center justify-center flex-col">
            <div className="relative w-full h-full flex flex-wrap gap-10 flex-row">
              <div className="relative w-full h-fit flex flex-col flex-wrap justify-start items-start gap-3 break-words">
                <div className="relative flex flex-col preG:flex-row">
                  <CollectButton
                    col={"1"}
                    row={"1"}
                    selectFunction={setCollectible}
                    openDropdown={collectibleDropDown}
                    handleOpenDropdown={setCollectibleDropDown}
                    selectValue={collectible}
                    label={"Collectible?"}
                  />
                  {collectible === "yes" && (
                    <CollectButton
                      col={"1"}
                      row={"1"}
                      values={audienceTypes}
                      selectFunction={setAudienceType}
                      openDropdown={audienceDropDown}
                      handleOpenDropdown={setAudienceDropDown}
                      selectValue={audienceType}
                      label={"Who can collect?"}
                    />
                  )}
                  {collectible === "yes" && (
                    <CollectButton
                      col={"1"}
                      row={"1"}
                      selectFunction={setChargeCollect}
                      openDropdown={chargeCollectDropDown}
                      handleOpenDropdown={setChargeCollectDropDown}
                      selectValue={chargeCollect}
                      label={"Creator award?"}
                    />
                  )}
                </div>
                <div className="relative flex flex-col preG:flex-row">
                  {collectible === "yes" && chargeCollect === "yes" && (
                    <CollectButton
                      col={"1"}
                      row={"1"}
                      selectFunction={setTimeLimit}
                      openDropdown={timeLimitDropDown}
                      handleOpenDropdown={setTimeLimitDropDown}
                      selectValue={timeLimit}
                      label={"24 Hour Collect"}
                    />
                  )}
                  {collectible === "yes" && chargeCollect === "yes" && (
                    <CollectButton
                      col={"1"}
                      row={"1"}
                      selectFunction={setLimitedEdition}
                      openDropdown={limitedDropDown}
                      handleOpenDropdown={setLimitedDropDown}
                      selectValue={limitedEdition}
                      label={"Limited edition?"}
                    />
                  )}
                  {collectible === "yes" &&
                    limitedEdition === "yes" &&
                    chargeCollect === "yes" && (
                      <CollectInput
                        min="1"
                        step="1"
                        defaultValue={limit.toString()}
                        placeholder={limit.toString()}
                        id="collectLimit"
                        label="Edition Amount"
                        name="collectLimit"
                        col={"1"}
                        row={"1"}
                        handleValueChange={setLimit}
                      />
                    )}
                </div>
                <div className="relative flex flex-col preG:flex-row w-full">
                  {collectible === "yes" && chargeCollect === "yes" && (
                    <CollectButton
                      col={"1"}
                      row={"1"}
                      values={enabledCurrencies}
                      selectFunction={setEnabledCurrency}
                      openDropdown={currencyDropDown}
                      handleOpenDropdown={setCurrencyDropDown}
                      selectValue={enabledCurrency}
                      label={"Award currency"}
                    />
                  )}
                  {collectible === "yes" && chargeCollect === "yes" && (
                    <CollectInput
                      min="0"
                      defaultValue={value.toString()}
                      placeholder={value.toString()}
                      id="valueAmount"
                      label="Award amount"
                      name="valueAmount"
                      col={"1"}
                      row={"1"}
                      step="0.00001"
                      handleValueChange={setValue}
                    />
                  )}
                  {collectible === "yes" && chargeCollect === "yes" && (
                    <CollectInput
                      min="0"
                      defaultValue={referral.toString()}
                      placeholder={referral.toString()}
                      id="referral"
                      label="Mirrored posts (%)"
                      name="referral"
                      col={"1"}
                      row={"1"}
                      step="0.1"
                      handleValueChange={setReferral}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full rounded-md" id="boxBg1">
            <div className="relative w-full h-full p-px rounded-md grid grid-flow-col auto-cols-auto">
              <textarea
                id="post"
                onScroll={(e: any) => syncScroll( preElement, textElement)}
                onInput={(e: FormEvent) => {
                  handleCommentDescription(e);
                  syncScroll( preElement, textElement);
                }}
                onKeyDown={(e: KeyboardEvent<Element>) =>
                  handleKeyDownDelete(e)
                }
                style={{ resize: "none" }}
                className="relative w-full h-full bg-black font-economicaB text-white p-2 z-1 rounded-lg overflow-y-auto"
                ref={textElement}
                value={commentDescription}
                disabled={commentLoading || !canComment ? true : false}
              ></textarea>
              <pre
                id="highlighting"
                className={`absolute w-full h-full bg-black font-economicaB text-white p-2 rounded-lg overflow-y-auto ${
                  !canComment && "opacity-70"
                }`}
                ref={preElement}
              >
                <code
                  id="highlighted-content"
                  className={`w-full h-full place-self-center text-left whitespace-pre-wrap overflow-y-auto z-0`}
                >
                  {!canComment
                    ? "Looks Like Only Select Profiles Can Comment on this Post ATM"
                    : commentId !== ""
                    ? "Reply with a Comment?"
                    : "Have Something to Say?"}
                </code>
              </pre>
              {mentionProfiles?.length > 0 && profilesOpen && (
                <div
                  className={`absolute w-44 max-h-28 h-fit flex flex-col overflow-y-scroll items-center justify-center z-2 rounded-lg`}
                  style={{
                    top: caretCoord.y + 30,
                    left: caretCoord.x,
                  }}
                >
                  {mentionProfiles?.map((user: any, index: number) => {
                    const profileImage: string = createProfilePicture(user);
                    return (
                      <div
                        key={index}
                        className={`relative w-full h-fit px-3 py-2 bg-white flex flex-row gap-3 cursor-pointer items-center justify-center border-y border-black hover:bg-rosa/70 z-2`}
                        onClick={() => {
                          handleMentionClick(user);
                        }}
                      >
                        <div className="relative flex flex-row w-full h-full text-black font-economicaB lowercase place-self-center gap-2">
                          <div
                            className={`relative rounded-full flex bg-white w-3 h-3 items-center justify-center col-start-1`}
                            id="crt"
                          >
                            {profileImage !== "" && (
                              <Image
                                src={profileImage}
                                objectFit="cover"
                                alt="pfp"
                                layout="fill"
                                className="relative w-fit h-fit rounded-full items-center justify-center flex"
                                draggable={false}
                              />
                            )}
                          </div>
                          <div className="relative col-start-2 items-center justify-center w-fit h-fit text-xs flex">
                            @{user?.handle?.split(".lens")[0]}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="relative w-full h-fit preG:h-12 flex flex-row items-center gap-3 flex-wrap preG:flex-nowrap">
          <div className="relative w-fit h-fit flex flex-row items-center gap-2 justify-start">
            <div className="relative w-3 h-3 rounded-full" id="chrome"></div>
            <div className="relative w-3 h-3 rounded-full" id="chrome"></div>
            <OptionsComment
              videoLoading={videoLoading}
              imageLoading={imageLoading}
              commentLoading={commentLoading}
              uploadImages={uploadImages}
              uploadVideo={uploadVideo}
              setGifOpen={setGifOpen}
              gifOpen={gifOpen}
              collectOpen={collectOpen}
              dispatch={dispatch}
              setMappedFeatureFiles={setMappedFeatureFilesComment}
              uploadedImages={uploadImagesComment}
              setVideoLoading={setVideoLoadingComment}
              setImageLoading={setImageLoadingComment}
              imagesRedux={postImagesDispatched}
              setCollectOpen={setCollectOpen}
            />
          </div>
          <div className="relative w-full h-fit justify-end flex flex-row gap-2 items-center">
            <div className="relative w-24 min-w-fit h-10 border-white border rounded-tr-xl rounded-bl-xl py-2 px-4 flex items-center cursor-pointer active:scale-95 hover:bg-moda justify-center">
              <div
                className={`relative w-full h-full flex text-white font-economicaB items-center text-center justify-center ${
                  commentLoading && "animate-spin"
                }`}
                onClick={
                  !authStatus && !profileId
                    ? () => handleConnect()
                    : authStatus && !profileId
                    ? () => handleLensSignIn()
                    : commentLoading
                    ? () => {}
                    : collectNotif !== ""
                    ? () =>
                        dispatch(
                          setModal({
                            actionOpen: true,
                            actionMessage: collectNotif,
                          })
                        )
                    : () => commentPost(commentId)
                }
              >
                {!authStatus && !profileId ? (
                  "CONNECT"
                ) : authStatus && !profileId ? (
                  "SIGN IN"
                ) : commentLoading ? (
                  <AiOutlineLoading size={10} color="white" />
                ) : (
                  "SEND IT"
                )}
              </div>
            </div>
            <Image
              alt="gear"
              src={`${INFURA_GATEWAY}/ipfs/QmY72fgrYJvDrc8iDSYRiyTpdsxbPMbPk7hxT2jrH9jrXJ`}
              width={15}
              height={15}
              className="relative w-7 h-7 flex justify-end"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeComment;
