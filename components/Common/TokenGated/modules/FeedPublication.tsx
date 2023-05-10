import { MediaSet } from "@/components/Home/types/lens.types";
import Profile from "./Profile";
import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { AiFillEye, AiOutlineRetweet } from "react-icons/ai";
import getLinkPreview from "@/lib/helpers/getLinkPreview";
import { FunctionComponent } from "react";
import { FeedPublicationProps } from "../types/allPosts.types";
import { setImageViewer } from "@/redux/reducers/imageViewerSlice";
import { setReactionState } from "@/redux/reducers/reactionStateSlice";
import { setCommentShow } from "@/redux/reducers/commentShowSlice";
import descriptionRegex from "@/lib/helpers/descriptionRegex";

const FeedPublication: FunctionComponent<FeedPublicationProps> = ({
  publication,
  dispatch,
  type,
  hasReacted,
  hasMirrored,
  followerOnly,
  height,
  viewerOpen,
  address,
  router,
  collectPost,
  commentPost,
  reactPost,
  mirrorPost,
  index,
  collectLoading,
  mirrorLoading,
  reactLoading,
  reactAmount,
  mirrorAmount,
  collectAmount,
  commentAmount,
  hasCollected,
}): JSX.Element => {
  const link = getLinkPreview(
    publication?.__typename !== "Mirror"
      ? publication?.metadata?.content
      : publication?.mirrorOf?.metadata?.content
  );
  const tags = document.querySelectorAll("em");
  if (tags.length > 0) {
    for (let i = 0; i < tags.length; i++) {
      tags[i].addEventListener("click", (e) => {
        router
          ?.push(
            `/?search=${(e.target as any)?.innerText.replaceAll(
              "#",
              ""
            )}/#Slider`
          )
          .catch((e) => {
            if (!e.cancelled) {
              throw e;
            }
          });
      });
    }
  }
  return (
    <div
      className={`relative w-full ${
        height ? "h-full" : "h-fit"
      } flex flex-row flex-wrap sm:flex-nowrap gap-6 rounded-md z-0`}
      data-post-id={publication.id}
      id={publication.id}
    >
      <Profile
        publication={publication}
        setReactionState={setReactionState}
        followerOnly={followerOnly}
        dispatch={dispatch}
        setCommentShow={setCommentShow}
        hasMirrored={hasMirrored}
        hasReacted={hasReacted}
        collectPost={collectPost}
        commentPost={commentPost}
        reactPost={reactPost}
        mirrorPost={mirrorPost}
        address={address}
        index={index}
        collectLoading={collectLoading}
        reactLoading={reactLoading}
        mirrorLoading={mirrorLoading}
        reactAmount={reactAmount}
        mirrorAmount={mirrorAmount}
        collectAmount={collectAmount}
        commentAmount={commentAmount}
        hasCollected={hasCollected}
      />
      <div
        className={`relative w-full h-auto grow rounded-md grid grid-flow-row auto-rows-auto p-3 galaxy:p-6 gap-6 border-2 border-black bg-gradient-to-r from-offBlack via-gray-600 to-black`}
      >
        {publication?.__typename === "Mirror" && (
          <div className="relative w-fit h-fit row-start-1 justify-self-end self-center grid grid-flow-col auto-cols-auto gap-2">
            <div
              className={`relative w-fit h-fit col-start-1 place-self-center text-xs font-dosis text-offWhite`}
            >
              {`Mirrored by @${publication?.profile?.handle}`}
            </div>
            <div className="relative w-fit h-fit col-start-2 place-self-center">
              <AiOutlineRetweet color={"red"} size={15} />
            </div>
          </div>
        )}
        <div
          className={`${
            publication?.__typename === "Mirror" ? "row-start-2" : "row-start-1"
          } relative w-full h-fit text-left font-dosis grid grid-flow-row auto-rows-auto gap-6`}
        >
          <div
            className={`relative w-full h-fit row-start-1 relative w-fit h-fit text-white font-dosis self-center justify-self-start`}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: descriptionRegex(
                  publication?.__typename !== "Mirror"
                    ? publication?.metadata?.content
                    : publication?.mirrorOf?.metadata?.content
                ),
              }}
              className="relative place-self-center whitespace-preline"
            ></div>
          </div>
        </div>
        <div
          className={`relative w-fit max-w-full h-fit rounded-lg overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 z-10 ${
            publication?.__typename === "Mirror" ? "row-start-3" : "row-start-2"
          }`}
        >
          {(publication?.__typename === "Mirror"
            ? publication?.mirrorOf?.metadata?.media
            : publication?.metadata?.media
          )?.map((image: MediaSet | string, index: number) => {
            let formattedImageURL: string;

            if ((image as MediaSet).original.url.includes("ipfs://")) {
              formattedImageURL = `${INFURA_GATEWAY}/ipfs/${
                (image as MediaSet).original.url?.split("ipfs://")[1]
              }`;
            } else {
              formattedImageURL = (image as MediaSet).original.url;
            }

            return (
              <div
                key={index}
                className={`relative w-60 h-60 border-2 border-black rounded-lg bg-black grid grid-flow-col auto-cols-auto col-start-${
                  index + 1
                } cursor-pointer hover:opacity-70 active:scale-95`}
                onClick={() =>
                  dispatch(
                    setImageViewer({
                      actionType: (image as MediaSet).original.mimeType,
                      actionOpen: true,
                      actionImage: formattedImageURL,
                    })
                  )
                }
              >
                <div className="relative w-full h-full col-start-1 flex">
                  {(image as MediaSet)?.original?.mimeType !== "video/mp4" ? (
                    <Image
                      src={
                        (image as MediaSet)?.original?.mimeType ===
                          "image/png" ||
                        (image as MediaSet)?.original?.mimeType ===
                          "image/webp" ||
                        (image as MediaSet)?.original?.mimeType ===
                          "image/jpg" ||
                        (image as MediaSet)?.original?.mimeType === "image/jpeg"
                          ? formattedImageURL
                          : (image as MediaSet)?.original?.url
                      }
                      layout="fill"
                      objectFit="cover"
                      objectPosition={"center"}
                      className="rounded-md"
                      draggable={false}
                    />
                  ) : (
                    <video
                      muted
                      controls
                      className="rounded-md absolute w-full h-full object-cover"
                    >
                      <source src={formattedImageURL} type="video/mp4" />
                    </video>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div
          className={`relative w-full h-full ${
            publication?.__typename === "Mirror" ? "row-start-4" : "row-start-3"
          } grid grid-flow-col auto-cols-auto`}
        >
          {!router.asPath.includes(publication?.id) && (
            <div
              className={`relative w-fit h-full col-start-1 row-start-1 sm:col-start-2 sm:pt-0 pt-3 justify-self-end self-center grid grid-flow-col auto-cols-auto font-digi gap-1 cursor-pointer hover:opacity-70 active:scale-95 text-white`}
            >
              <div className="relative w-fit h-fit self-end col-start-1 text-sm">
                {type === "Post" ? "View Post" : "View Comment"}
              </div>
              <div className="relative w-fit h-fit col-start-2 self-end">
                <AiFillEye color={"white"} size={20} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedPublication;
