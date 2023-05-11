import moment from "moment";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { ProfileSideBarProps } from "../types/allPosts.types";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { INFURA_GATEWAY } from "@/lib/constants";
import Reactions from "./Reactions";
import Link from "next/link";

const Profile: FunctionComponent<ProfileSideBarProps> = ({
  publication,
  followerOnly,
  dispatch,
  hasMirrored,
  hasReacted,
  index,
  collectPost,
  reactPost,
  mirrorPost,
  address,
  reactLoading,
  mirrorLoading,
  collectLoading,
  hasCollected,
  reactAmount,
  collectAmount,
  mirrorAmount,
  commentAmount,
  openComment,
  setMirrorLoader,
  setCollectLoader,
  setReactLoader,
  feedType
}): JSX.Element => {
  const profileImage = createProfilePicture(publication, true);
  return (
    <div
      className={`relative h-auto rounded-md pr-px py-px w-full sm:w-40 preG:min-w-[7.5rem]`}
      id="sideProfile"
    >
      <div
        className={`relative w-full h-full bg-shame rounded-md flex flex-col items-start sm:items-center py-1.5 px-1 gap-3`}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmSjh6dsibg9yDfBwRfC5YSWFTmwpwPxRDTFG8DzLHzFyB`}
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full rounded-lg"
        />
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`w-20 relative h-8 rounded-full flex justify-self-center`}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmfDmMCcgcseCFzGam9DbmDk5sQRbt6zrQVhvj4nTeuLGq`}
              layout="fill"
              alt="backdrop"
              priority
              draggable={false}
              className="rounded-full w-full h-full"
            />
          </div>
          <Link
            className={`absolute rounded-full flex bg-white w-8 h-full justify-self-center sm:right-6 col-start-1 cursor-pointer active:scale-95 hover:opacity-80`}
            id="crt"
            target="_blank"
            rel="noreferrer"
            href={`https://lenster.xyz/u/${
              publication?.__typename !== "Mirror"
                ? publication?.profile?.handle.split(".lens")[0]
                : publication?.mirrorOf?.profile?.handle.split(".lens")[0]
            }`}
          >
            {profileImage !== "" && (
              <Image
                src={profileImage}
                objectFit="cover"
                alt="pfp"
                layout="fill"
                className="relative w-full h-full rounded-full"
                draggable={false}
              />
            )}
          </Link>
        </div>
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`relative w-fit h-fit font-dosis text-xs justify-self-center`}
            id={"username"}
          >
            {publication?.__typename !== "Mirror"
              ? publication?.profile?.name
                ? publication?.profile?.name?.length > 25
                  ? publication?.profile?.name?.substring(0, 20) + "..."
                  : publication?.profile?.name
                : ""
              : publication?.mirrorOf?.profile?.name
              ? publication?.mirrorOf?.profile?.name?.length > 20
                ? publication?.mirrorOf?.profile?.name?.substring(0, 25) + "..."
                : publication?.mirrorOf?.profile?.name
              : ""}
          </div>
        </div>
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`relative w-fit h-fit ${
              publication?.profile?.name ? "row-start-2" : "row-start-1"
            } font-clash text-xs justify-self-center text-black`}
          >
            @
            {publication?.__typename !== "Mirror"
              ? publication?.profile?.handle?.length > 15
                ? publication?.profile?.handle
                    ?.split(".lens")[0]
                    ?.substring(0, 10) + "..."
                : publication?.profile?.handle?.split(".lens")[0]
              : publication?.mirrorOf?.profile?.handle?.length > 15
              ? publication?.mirrorOf?.profile?.handle
                  ?.split(".lens")[0]
                  ?.substring(0, 10) + "..."
              : publication?.mirrorOf?.profile?.handle?.split(".lens")[0]}
          </div>
        </div>
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`relative w-fit h-fit text-offBlack font-dosis justify-self-center fo:pb-0 pb-2 text-xs `}
          >
            {moment(`${publication?.createdAt}`).fromNow()}
          </div>
        </div>
        <div className="relative w-full h-full grid grid-flow-col auto-cols-auto items-end pt-3">
          <Reactions
            id={publication?.id}
            textColor={"black"}
            commentColor={"#0AC7AB"}
            mirrorColor={"#712AF6"}
            collectColor={"#81A8F8"}
            heartColor={"red"}
            dispatch={dispatch}
            hasReacted={hasReacted ? hasReacted : false}
            hasMirrored={hasMirrored ? hasMirrored : false}
            followerOnly={followerOnly as boolean}
            collectPost={collectPost}
            mirrorPost={mirrorPost}
            reactPost={reactPost}
            address={address!}
            publication={publication}
            index={index}
            reactLoading={reactLoading}
            mirrorLoading={mirrorLoading}
            collectLoading={collectLoading}
            reactAmount={reactAmount}
            collectAmount={collectAmount}
            mirrorAmount={mirrorAmount}
            hasCollected={hasCollected ? hasCollected : false}
            commentAmount={commentAmount}
            openComment={openComment}
            setReactLoader={setReactLoader}
            setMirrorLoader={setMirrorLoader}
            setCollectLoader={setCollectLoader}
            feedType={feedType}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
