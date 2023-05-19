import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FormEvent, FunctionComponent, KeyboardEvent } from "react";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { AiOutlineLoading } from "react-icons/ai";
import syncScroll from "@/lib/helpers/syncScroll";
import ImageUploads from "./ImageUploads";
import { MakePostProps } from "../types/allPosts.types";
import CollectButton from "../../Miscellaneous/modules/CollectButton";
import CollectInput from "../../Miscellaneous/modules/CollectInput";
import GatedOptions from "./GatedOptions";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

const MakePost: FunctionComponent<MakePostProps> = ({
  tokenGatePost,
  postDescription,
  postLoading,
  handlePostDescription,
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
  uploadImagesPost,
  setMappedFeatureFilesPost,
  setVideoLoadingPost,
  setImageLoadingPost,
  collections,
  tokenIds,
  setTokenIds,
}): JSX.Element => {
  return (
    <div className="relative w-full h-[39rem] flex flex-col max-w-full overflow-y-scroll">
      <div className="relative w-full h-fit flex flex-col gap-10">
        <div className="relative gap-2 flex flex-col w-full h-fit">
          <div className="relative w-full h-100 border border-marip p-px rounded-md bg-stat bg-cover items-center justify-start flex flex-col">
            <div className="absolute w-[85%] h-140 justify-center flex">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmTR8EvhhdGwPqTt4NR1XQ8wziBCCmBdwR4St3nGpyVpu9`}
                layout="fill"
                draggable={false}
              />
            </div>
            <ScrollSync>
              <div className="relative w-3/5 h-60 p-px grid grid-flow-col auto-cols-auto top-14">
                <ScrollSyncPane>
                  <textarea
                    id="post2"
                    onScroll={(e: any) => syncScroll(e, "highlighted-content2")}
                    onInput={(e: FormEvent) => {
                      handlePostDescription(e);
                      // syncScroll(e, "highlighted-content2");
                    }}
                    onKeyDown={(e: KeyboardEvent<Element>) =>
                      handleKeyDownDelete(e)
                    }
                    style={{ resize: "none" }}
                    className="relative w-full h-full bg-stat2 bg-cover font-earl text-black p-2 z-1 overflow-y-auto focus:outline-none"
                    ref={textElement}
                    value={postDescription}
                    disabled={postLoading ? true : false}
                  ></textarea>
                </ScrollSyncPane>
                <ScrollSyncPane>
                  <pre
                    id="highlighting2"
                    className={`absolute w-full h-full bg-stat2 bg-cover font-earl text-black p-2 overflow-y-auto`}
                  >
                    <code
                      id="highlighted-content2"
                      className={`w-full h-full place-self-center text-left whitespace-pre-wrap overflow-y-auto z-0 uppercase`}
                    >
                      {"Make a token gated post"}
                    </code>
                  </pre>
                </ScrollSyncPane>
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
                          onClick={() => handleMentionClick(user)}
                        >
                          <div className="relative flex flex-row w-full h-full text-black font-earl lowercase place-self-center gap-2">
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
            </ScrollSync>
            {(mappedFeaturedFiles?.length !== 0 ||
              postImagesDispatched?.length !== 0) && (
              <div className="relative w-4/5 h-fit flex flex-col gap-2 top-28">
                <ImageUploads
                  handleRemoveImage={handleRemoveImage}
                  commentLoading={postLoading}
                  postImagesDispatched={postImagesDispatched}
                  setMappedFeatureFiles={setMappedFeatureFilesPost}
                  uploadImages={uploadImagesPost}
                />
              </div>
            )}
          </div>
        </div>
        <div className="relative w-full h-fit gap-5 flex flex-col justify-center items-center">
          <div className="relative w-4/5 justify-center items-center">
            <div className="relative flex flex-row w-full h-fit gap-12 justify-center pb-3">
              <div className="relative w-fit h-fit flex flex-col gap-2">
                <div className="text-black font-earl justify-start items-start flex whitespace-nowrap uppercase">
                  Add Media
                </div>
                <div className="relative flex flex-row w-full h-fit gap-5">
                  <label
                    className={`relative w-10 h-10 items-center flex ${
                      !postLoading &&
                      !imageLoading &&
                      (!postImagesDispatched ||
                        (postImagesDispatched as any)?.length < 4) &&
                      "cursor-pointer active:scale-95"
                    } ${postImagesDispatched?.length === 4 && "opacity-20"}`}
                    onChange={(e: FormEvent) => {
                      !postLoading
                        ? uploadImages(
                            e,
                            setImageLoadingPost,
                            setMappedFeatureFilesPost,
                            uploadImagesPost
                          )
                        : {};
                    }}
                  >
                    {!imageLoading ? (
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/QmSnzdXAPN89Fd5vyzpBRTUNUbyRyRq9skymwHPWJoghMS`}
                        alt="opt"
                        layout="fill"
                        draggable={false}
                      />
                    ) : (
                      <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                        <AiOutlineLoading color="white" size={25} />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/png"
                      hidden
                      required
                      id="files"
                      multiple={true}
                      name="images"
                      className="caret-transparent"
                      disabled={
                        imageLoading ||
                        postLoading ||
                        postImagesDispatched?.length === 4
                          ? true
                          : false
                      }
                    />
                  </label>
                  <label
                    className={`relative w-10 h-8 items-center flex ${
                      !postLoading &&
                      !videoLoading &&
                      (!postImagesDispatched ||
                        (postImagesDispatched as any)?.length < 4) &&
                      "cursor-pointer active:scale-95"
                    } ${postImagesDispatched?.length === 4 && "opacity-20"}`}
                    onChange={(e: FormEvent) => {
                      !postLoading
                        ? uploadVideo(
                            e,
                            setVideoLoadingPost,
                            setMappedFeatureFilesPost,
                            uploadImagesPost
                          )
                        : {};
                    }}
                  >
                    {!videoLoading ? (
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/QmPk97A6JDyZcyUBwT3qCa1F3J1QmB8pBt577dafsYbj6d`}
                        alt="opt"
                        layout="fill"
                        draggable={false}
                      />
                    ) : (
                      <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                        <AiOutlineLoading color="white" size={25} />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="video/mp4"
                      hidden
                      required
                      id="files"
                      multiple={false}
                      name="video"
                      className="caret-transparent"
                      disabled={
                        videoLoading ||
                        postLoading ||
                        postImagesDispatched?.length === 4
                          ? true
                          : false
                      }
                    />
                  </label>
                </div>
              </div>
              <div className="relative flex flex-col gap-2 w-full h-fit">
                <div className="text-black font-earl justify-start items-start flex uppercase">
                  Add Gif
                </div>
                <div className="relative w-full h-full grid grid-flow-row auto-rows-auto overflow-y-scroll">
                  <div className="relative w-full h-fit flex flex-row gap-2">
                    <input
                      className={`relative row-start-1 col-start-1 h-10 bg-black border border-white font-earl text-white p-2 rounded-md w-full text-sm`}
                      name="gif"
                      onChange={(e: FormEvent) => handleGif(e)}
                    />
                    <div
                      className="relative w-20 border border-white flex items-center text-center justify-center text-white font-earl bg-black rounded-md cursor-pointer active:scale-95 uppercase"
                      onClick={() => handleGifSubmit()}
                    >
                      go
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {results?.length !== 0 && (
              <div className="relative w-full h-40 flex flex-row flex-wrap justify-center overflow-y-scroll gap-2 pt-3">
                {results?.map((result: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-24 h-24 bg-white cursor-pointer active:scale-95 place-self-center"
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
        </div>
        <div className="relative flex justify-center items-center w-full h-fit pt-4">
          <div className="relative bg-white flex flex-col gap-2 w-3/5 h-fit justify-center items-center p-2">
            <div className="font-earl justify-center h-fit w-full flex uppercase bg-white text-black">
              Collect Options
            </div>
            <div className="relative w-full h-fit flex items-center justify-center flex-col bg-black">
              <div className="relative w-full h-full flex flex-wrap gap-10 flex-row py-3">
                <div className="relative w-full h-fit flex flex-col flex-wrap gap-3 break-words">
                  <div className="relative flex flex-col preG:flex-row items-center justify-center">
                    <CollectButton
                      col={"1"}
                      row={"1"}
                      selectFunction={setCollectible}
                      openDropdown={collectibleDropDown}
                      handleOpenDropdown={setCollectibleDropDown}
                      selectValue={collectible}
                      label={"Collectible?"}
                      gated
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
                        gated
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
                        gated
                      />
                    )}
                  </div>
                  <div className="relative flex flex-col preG:flex-row items-center justify-center">
                    {collectible === "yes" && chargeCollect === "yes" && (
                      <CollectButton
                        col={"1"}
                        row={"1"}
                        selectFunction={setTimeLimit}
                        openDropdown={timeLimitDropDown}
                        handleOpenDropdown={setTimeLimitDropDown}
                        selectValue={timeLimit}
                        label={"24 Hour Collect"}
                        gated
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
                        gated
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
                          gated
                        />
                      )}
                  </div>
                  <div className="relative flex flex-col preG:flex-row w-full items-center justify-center">
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
                        gated
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
                        gated
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
                        gated
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col gap-5 w-full h-fit justify-center items-center">
          <div className="text-white font-earl justify-center flex bg-white p-1.5 w-3/4 h-fit">
            <div className="relative w-full h-fit py-1.5 bg-black uppercase text-center flex justify-center items-center">
              Which Collectors Can Decrypt?
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-row items-center gap-3 flex-wrap preG:flex-nowrap justify-center">
            <GatedOptions
              collections={collections}
              tokenIds={tokenIds}
              setTokenIds={setTokenIds}
            />
          </div>
        </div>
        <div className="relative w-full h-fit preG:h-12 flex flex-row items-center gap-3 flex-wrap preG:flex-nowrap">
          <div className="relative w-full h-fit justify-end flex flex-row gap-2 items-center">
            <div className="relative w-32 min-w-fit h-10 bg-white p-1.5 flex items-center cursor-pointer active:scale-95 hover:bg-moda justify-center">
              <div
                className={`relative w-full h-full flex text-white font-earl bg-black p-1.5 items-center text-center justify-center ${
                  postLoading && "animate-spin"
                }`}
                onClick={() => tokenGatePost()}
              >
                {postLoading ? (
                  <AiOutlineLoading color="white" size={10} />
                ) : (
                  "ENCRYPT & POST"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePost;
