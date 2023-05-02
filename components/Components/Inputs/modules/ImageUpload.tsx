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
  setImageLoading
}): JSX.Element => {
  return (
    <div className="relative w-40 h-40 border border-white rounded-md flex flex-col p-3">
      {image !== "" && (
        <div className="absolute top-0 left-0 w-full h-full flex object-cover">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${image}`}
            layout="fill"
            objectFit="cover"
            className="rounded-md w-full h-full flex"
          />
        </div>
      )}
      <div className="relative w-full h-full items-end justify-end flex">
        <label
          className="relative w-8 h-8 rounded-sm bg-azul flex flex-col items-center justify-center cursor-pointer active:scale-95"
          onChange={(e: FormEvent) => uploadImage(e, setImageLoading)}
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
            accept="image/png"
            hidden
            required
            id="files"
            multiple={false}
            name="images"
            className="caret-transparent"
            disabled={imageLoading || loaderGeneral ? true : false}
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
