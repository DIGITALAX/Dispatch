import { INFURA_GATEWAY } from "@/lib/constants";

import Image from "next/image";
import { FormEvent, FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { setCollectOpen } from "@/redux/reducers/collectOpenSlice";
import { OptionsCommentProps } from "../types/allPosts.types";

const OptionsComment: FunctionComponent<OptionsCommentProps> = ({
  videoLoading,
  imageLoading,
  commentLoading,
  uploadImages,
  uploadVideo,
  gifOpen,
  setGifOpen,
  collectOpen,
  dispatch,
  setVideoLoading,
  setMappedFeatureFiles,
  uploadedImages,
  setImageLoading,
  imagesRedux
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit flex flex-row gap-2 pl-2">
      <div
        className={`relative w-4 h-4 items-center flex cursor-pointer ${
          imagesRedux?.length === 4 && "opacity-20"
        }`}
        onClick={() => {
          dispatch(setCollectOpen(false));
          setGifOpen(!gifOpen);
        }}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmSmqvoqB88FsKruGmZHGg65MZfC4dxHH6KpMBrHrUDxQs`}
          alt="opt"
          fill
          draggable={false}
        />
      </div>
      <label
        className={`relative w-4 h-4 items-center flex ${
          !commentLoading &&
          !imageLoading &&
          (!imagesRedux || (imagesRedux as any)?.length < 4) &&
          "cursor-pointer active:scale-95"
        } ${imageLoading && "animate-spin"} ${
          imagesRedux?.length === 4 && "opacity-20"
        }`}
        onChange={(e: FormEvent) => {
          !commentLoading
            ? uploadImages(
                e,
                setImageLoading,
                setMappedFeatureFiles,
                uploadedImages,
                
              )
            : {};
        }}
      >
        {!imageLoading ? (
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmR3SNUJj2BNc8iTCAZ1pf6CngJkKwi6vJ36YSroF4N6HE`}
            alt="opt"
            fill
            draggable={false}
          />
        ) : (
          <AiOutlineLoading color="white" size={15} />
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
            imageLoading || commentLoading || imagesRedux?.length === 4
              ? true
              : false
          }
        />
      </label>
      <label
        className={`relative w-4 h-4 items-center flex ${
          !commentLoading &&
          !videoLoading &&
          (!imagesRedux || (imagesRedux as any)?.length < 4) &&
          "cursor-pointer active:scale-95"
        } ${videoLoading && "animate-spin"} ${
          imagesRedux?.length === 4 && "opacity-20"
        }`}
        onChange={(e: FormEvent) => {
          !commentLoading
            ? uploadVideo(
                e,
                setVideoLoading,
                setMappedFeatureFiles,
                uploadedImages,
                
              )
            : {};
        }}
      >
        {!videoLoading ? (
          <Image
            src={`${INFURA_GATEWAY}/ipfs/Qme5Ss6at8oXuaUr8ADqTZojr44Sf81P2M5GszNYTB8Mhq`}
            alt="opt"
            fill
            draggable={false}
          />
        ) : (
          <AiOutlineLoading color="white" size={15} />
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
            videoLoading || commentLoading || imagesRedux?.length === 4
              ? true
              : false
          }
        />
      </label>
      <div
        className="relative w-4 h-4 items-center flex cursor-pointer"
        onClick={() => {
          setGifOpen(false);
          dispatch(setCollectOpen(!collectOpen));
        }}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmeMxvbUP4ryQYdX8c6THtUfnJ3phgvSgbaQScHfVghgpz`}
          alt="opt"
          fill
          draggable={false}
        />
      </div>
    </div>
  );
};

export default OptionsComment;
