import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent, useEffect, useRef } from "react";
import { CollectionPreviewProps } from "../types/collections.types";
import WaveSurfer from "wavesurfer.js";
import { HiOutlinePlayPause } from "react-icons/hi2";

const CollectionPreview: FunctionComponent<CollectionPreviewProps> = ({
  collectionDetails,
  setPrice,
  price,
  collectionType,
}): JSX.Element => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef<null | WaveSurfer>(null);

  useEffect(() => {
    if (waveformRef.current) {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }

      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: "white",
        height: 16,
      });

      if (collectionDetails?.audio) {
        wavesurfer.current.load(
          `${INFURA_GATEWAY}/ipfs/${
            collectionDetails?.audio?.includes("ipfs://")
              ? collectionDetails?.audio?.split("ipfs://")[1]
              : collectionDetails?.audio
          }`
        );
      }
    }

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [collectionDetails?.audio, wavesurfer]);

  const handlePlayPause = () => {
    wavesurfer.current?.playPause();
  };
  return (
    <div className="relative w-full h-fit flex flex-col items-center justify-center gap-3">
      <div className="relative w-3/4 h-fit items-center justify-center text-ama font-earl text-xl flex text-center break-all">
        {collectionDetails?.title}
      </div>
      <div className="relative w-3/4 max-h-16 mid:max-h-32 items-start justify-center text-white font-earl text-xs flex text-center px-3  overflow-y-scroll break-all  overflow-x-hidden whitespace-pre-wrap">
        {collectionDetails?.description}
      </div>
      <div className="relative w-full h-fit items-center justify-center text-ama font-earl text-base flex">
        {Math.ceil(collectionDetails?.amount)}
      </div>
      <div className="relative w-full h-fit flex flex-col items-center justify-center">
        {collectionDetails.fileType === "audio/mpeg" ||
        collectionType === "audio/mpeg" || collectionDetails?.audio ? (
          <div className="relative flex flex-col gap-5 w-fit h-fit">
            {collectionDetails?.audio !== "" && (
              <div className="relative w-full h-fit flex flex-row gap-1.5 items-center justify-center">
                <div
                  className="relative flex w-fit h-fit items-center justify-center flex cursor-pointer active:scale-95"
                  onClick={handlePlayPause}
                >
                  <HiOutlinePlayPause color="white" size={15} />
                </div>
                <div
                  className="relative w-full h-fit justify-center items-center cursor-pointer"
                  ref={waveformRef}
                />
              </div>
            )}
            <div className="relative w-fit h-fit flex flex-col items-center justify-center p-3 border border-white rounded-br-lg rounded-tl-lg">
              <div className="relative w-40 h-32 preG:w-60 preG:h-56 border-2 border-lily bg-black">
                {collectionDetails?.image !== "" && (
                  <Image
                    src={
                      collectionDetails?.image?.includes("ipfs://")
                        ? `${INFURA_GATEWAY}/ipfs/${
                            collectionDetails?.image?.split("ipfs://")[1]
                          }`
                        : `${INFURA_GATEWAY}/ipfs/${collectionDetails?.image}`
                    }
                    className="w-full h-full"
                    layout="fill"
                    draggable={false}
                    objectFit="cover"
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-fit h-fit flex flex-col items-center justify-center p-3 border border-white rounded-br-lg rounded-tl-lg">
            <div className="relative w-40 h-52 preG:w-60 preG:h-72 border-2 border-lily bg-black">
              {collectionDetails?.image !== "" &&
                ((collectionDetails.fileType !== "image/png" &&
                  collectionDetails.fileType !== "image/gif") ||
                collectionType === "video/mp4" ? (
                  <video
                    muted
                    playsInline
                    autoPlay
                    className="w-full h-full flex object-cover"
                  >
                    <source
                      src={`${INFURA_GATEWAY}/ipfs/${
                        collectionDetails?.image?.includes("ipfs://")
                          ? collectionDetails?.image?.split("ipfs://")[1]
                          : collectionDetails?.image
                      }`}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <Image
                    src={
                      collectionDetails?.image?.includes("ipfs://")
                        ? `${INFURA_GATEWAY}/ipfs/${
                            collectionDetails?.image?.split("ipfs://")[1]
                          }`
                        : `${INFURA_GATEWAY}/ipfs/${collectionDetails?.image}`
                    }
                    className="w-full h-full"
                    layout="fill"
                    draggable={false}
                    objectFit="cover"
                  />
                ))}
            </div>
          </div>
        )}
        <div className="relative w-full h-fit flex flex-col items-center gap-3 pt-4 justify-center px-3">
          <div className="relative w-fit h-fit flex flex-row items-center justify-center gap-2">
            {Array.from([
              [
                "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
                "WMATIC",
                "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
              ],
              [
                "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
                "WETH",
                "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
              ],
              [
                "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
                "USDT",
                "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
              ],
              [
                "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
                "MONA",
                "0x6968105460f67c3bf751be7c15f92f5286fd0ce5",
              ],
            ])
              .filter((item) =>
                collectionDetails?.acceptedTokens?.includes(
                  item[2].toLowerCase()
                )
              )
              .map((item: string[], index: number) => {
                return (
                  <div
                    className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                      price?.currency === item[1] && "opacity-70"
                    }`}
                    key={index}
                    onClick={() => {
                      const index =
                        collectionDetails?.acceptedTokens?.findIndex(
                          (token) =>
                            token.toLowerCase() === item[2].toLowerCase()
                        );
                      if (index !== undefined && index >= 0) {
                        setPrice({
                          value: collectionDetails?.tokenPrices[index],
                          currency: item[1],
                        });
                      }
                    }}
                  >
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${item[0]}`}
                      className="flex"
                      draggable={false}
                      width={30}
                      height={35}
                    />
                  </div>
                );
              })}
          </div>
          <div className="relative w-1/2 h-fit font-digi text-white text-sm items-center justify-center flex whitespace-nowrap">
            {collectionDetails.tokenPrices?.length > 0 &&
              price &&
              `${price?.value} ${price?.currency}`}
          </div>
        </div>
      </div>
      {collectionDetails?.tokenIds?.length > 0 && (
        <div className="relative w-full h-fit justify-center items-center flex flex-row">
          <div className="relative inline-flex justify-start items-start overflow-x-scroll gap-1 font-earl text-xs">
            {collectionDetails?.tokenIds?.map((id: number, index: number) => {
              return (
                <div
                  key={index}
                  className={`relative flex w-fit h-fit ${
                    collectionDetails?.soldTokens?.includes(id)
                      ? " text-ama"
                      : "text-white"
                  }`}
                >
                  {id}
                  {id !==
                    collectionDetails?.tokenIds[
                      collectionDetails?.tokenIds?.length - 1
                    ] && ", "}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPreview;
