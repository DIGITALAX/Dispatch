import { FormEvent, FunctionComponent } from "react";
import { RiAddLine } from "react-icons/ri";
import { ImageUploadProps } from "../types/inputs.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { AiOutlineLoading } from "react-icons/ai";

const ImageUpload: FunctionComponent<ImageUploadProps> = ({
  image,
  imageLoading,
  uploadImage,
  loaderGeneral,
  setImageLoading,
  type,
  disabled,
  fileType,
  collectionType,
}): JSX.Element => {
  return (
    <div
      className={`relative flex flex-col p-3 w-40 h-40 justify-end items-end border border-lily rounded-tr-lg rounded-bl-lg`}
    >
      {image !== "" && (
        <div className="absolute top-0 left-0 w-full h-full flex object-cover">
          {fileType === "video/mp4" || collectionType === "video/mp4" ? (
            <video
              playsInline
              autoPlay
              loop
              muted
              className="rounded-tr-lg rounded-bl-lg w-full h-full flex object-cover"
            >
              <source
                src={`${INFURA_GATEWAY}/ipfs/${
                  image?.includes("ipfs://")
                    ? image?.split("ipfs://")[1]
                    : image
                }`}
                type="video/mp4"
              />
            </video>
          ) : (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${
                image.includes("ipfs://") ? image?.split("ipfs://")[1] : image
              }`}
              layout="fill"
              objectFit="cover"
              className="rounded-tr-lg rounded-bl-lg w-full h-full flex"
              draggable={false}
            />
          )}
        </div>
      )}
      <div className="relative w-fit h-fit items-end justify-end flex">
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
            accept={
              fileType === "video/mp4" || collectionType === "video/mp4"
                ? "video/mp4"
                : "image/png, image/gif"
            }
            hidden
            required
            id="files"
            multiple={false}
            name="images"
            className="caret-transparent"
            disabled={imageLoading || loaderGeneral || disabled ? true : false}
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
