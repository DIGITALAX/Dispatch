import { FormEvent, FunctionComponent } from "react";
import { RiAddLine } from "react-icons/ri";
import { AudioUploadProps } from "../types/inputs.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { AiOutlineLoading } from "react-icons/ai";

const AudioUpload: FunctionComponent<AudioUploadProps> = ({
  image,
  audio,
  uploadImage,
  setImageLoading,
  type,
  loaderGeneral,
  imageLoading,
  disabled,
  audioFileName,
  audioLoading,
  setAudioLoading,
  uploadAudio,
}): JSX.Element => {
  return (
    <div className={`relative flex flex-col gap-4 h-fit w-fit`}>
      <div className={`relative w-40 h-14 border border-lily p-3 rounded-tr-lg rounded-bl-lg flex items-end justify-end ${
        audio !== "" && "bg-lily/50"
      }`}>
        {audio !== "" && (
          <div className="absolute top-0 left-0 w-full h-full flex object-cover text-white text-xs font-earl items-center justify-start break-words px-2 overflow-y-scroll">
            {audioFileName}
          </div>
        )}
        <div className="relative w-fit h-fit items-end justify-end flex">
          <label
            className={`relative w-8 h-8 rounded-tr-lg rounded-bl-lg bg-lily flex flex-col items-center justify-center ${
              !loaderGeneral && "cursor-pointer active:scale-95"
            }`}
            onChange={(e: FormEvent) => uploadAudio(e, setAudioLoading, type)}
          >
            <div
              className={`relative w-fit h-fit flex items-center justify-center ${
                audioLoading && "animate-spin"
              }`}
            >
              {audioLoading ? (
                <AiOutlineLoading color="#131313" size={10} />
              ) : (
                <RiAddLine color="#131313" size={10} />
              )}
            </div>
            <input
              type="file"
              accept={"audio/mpeg"}
              hidden
              required
              id="files"
              multiple={false}
              name="images"
              className="caret-transparent"
              disabled={
                imageLoading || loaderGeneral || disabled ? true : false
              }
            />
          </label>
        </div>
      </div>
      <div className="relative w-40 h-fit flex flex-col gap-2">
        <div className="relative w-fit h-fit font-earl text-lg">
          Track Cover
        </div>
        <div className="relative w-40 h-28 border border-lily p-3 rounded-tr-lg rounded-bl-lg flex">
          <div className="absolute top-0 left-0 w-full h-full flex object-cover">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${
                image.includes("ipfs://") ? image?.split("ipfs://")[1] : image
              }`}
              layout="fill"
              objectFit="cover"
              className="rounded-tr-lg rounded-bl-lg w-full h-full flex"
              draggable={false}
            />
          </div>
          <div className="relative w-full h-full items-end justify-end flex">
            <label
              className={`relative w-8 h-8 rounded-tr-lg rounded-bl-lg bg-lily flex flex-col items-center justify-center ${
                !loaderGeneral && "cursor-pointer active:scale-95"
              }`}
              onChange={(e: FormEvent) => uploadImage(e, setImageLoading, type)}
            >
              <div
                className={`relative w-fit h-fit flex items-center justify-center ${
                  imageLoading && "animate-spin"
                }`}
              >
                {imageLoading ? (
                  <AiOutlineLoading color="#131313" size={10} />
                ) : (
                  <RiAddLine color="#131313" size={10} />
                )}
              </div>
              <input
                type="file"
                accept={"image/png, image/gif"}
                hidden
                required
                id="files"
                multiple={false}
                name="images"
                className="caret-transparent"
                disabled={
                  imageLoading || loaderGeneral || disabled ? true : false
                }
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioUpload;
