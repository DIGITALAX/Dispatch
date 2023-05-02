import { FunctionComponent } from "react";
import FillIn from "../../Inputs/modules/FillIn";
import ImageUpload from "../../Inputs/modules/ImageUpload";
import ButtonAdd from "../../Inputs/modules/ButtonAdd";
import { BsRewindFill } from "react-icons/bs";
import { AddCollectionProps } from "../types/collections.types";
import { setCollectionSwitcher } from "@/redux/reducers/collectionSwitcherSlice";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import CollectionPreview from "./CollectionPreview";

const AddCollection: FunctionComponent<AddCollectionProps> = ({
  imageLoading,
  uploadImage,
  addCollection,
  addCollectionLoading,
  dispatch,
  handleCollectionTitle,
  handleCollectionDescription,
  setImageLoading,
  handleCollectionPrices,
  handleCollectionAmount,
  collectionDetails,
  setPrice,
  price,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col justify-start items-start text-white gap-4">
      <div
        className="relative w-fit h-fit items-center justify-start font-economicaB text-sm flex flex-row gap-2 opacity-70 cursor-pointer active:scale-95"
        onClick={() => dispatch(setCollectionSwitcher("collections"))}
      >
        <div className="relative w-fit h-fit ">
          <BsRewindFill color="white" size={15} />
        </div>
        <div className="relative w-fit h-fit justify-start items-center flex">
          return
        </div>
      </div>
      <div className="relative w-full h-fit items-start justify-start font-economicaB text-xl">
        ADD COLLECTION
      </div>
      <div className="relative w-full h-full flex flex-row gap-10">
        <div className="relative w-1/2 h-fit flex flex-col gap-5">
          <div className="relative flex flex-col gap-2 w-full h-fit">
            <div className="relative w-fit h-fit font-economica text-lg">
              Collection Name
            </div>
            <FillIn
              textArea={false}
              changeFunction={(e) => handleCollectionTitle(e)}
              type={"string"}
              width="full"
              defaultValue={collectionDetails.title}
            />
          </div>
          <div className="relative flex flex-col gap-2 w-full h-fit">
            <div className="relative w-fit h-fit font-economica text-lg">
              Collection Description
            </div>
            <FillIn
              textArea={true}
              changeFunction={(e) => handleCollectionDescription(e)}
              width="full"
              defaultValue={collectionDetails.description}
            />
          </div>
          <div className="relative flex flex-row w-full h-full items-start justify-start gap-10">
            <div className="relative w-full h-full flex flex-col gap-5">
              <div className="relative flex flex-col gap-2 w-full h-fit">
                <div className="relative w-fit h-fit font-economica text-lg">
                  Collection Art
                </div>
                <ImageUpload
                  image={collectionDetails.image}
                  imageLoading={imageLoading}
                  uploadImage={uploadImage}
                  loaderGeneral={addCollectionLoading}
                  setImageLoading={setImageLoading}
                  type="collection"
                />
              </div>
              <div className="relative w-full h-fit flex flex-col gap-2">
                <div className="relative w-fit h-fit font-economica text-lg">
                  Collection Amount
                </div>
                <FillIn
                  textArea={false}
                  changeFunction={(e) => handleCollectionAmount(e)}
                  type={"number"}
                  width={"full"}
                  defaultValue={String(collectionDetails.amount)}
                />
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-col gap-2 font-economica justify-start">
              <div className="relative w-fit h-fit text-lg">
                Collection Prices
              </div>
              <div className="opacity-70 w-fit word-break text-xxs">
                (Set Prices for the Tokens You want to Accept On Payment)
              </div>
              <div className="relative flex flex-col gap-2 w-full h-fit font-economica">
                {Array.from([
                  [
                    "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
                    "WMATIC",
                    "0x6199a505ec1707695ce49b59a07a147f2d50f22d",
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
                ]).map((value: string[], index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit flex flex-row gap-3 items-center justify-start"
                    >
                      <div className="relative w-7 h-10 flex rounded-full flex-col items-center justify-center">
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/${value[0]}`}
                          draggable={false}
                          width={30}
                          height={35}
                          className="flex"
                        />
                      </div>
                      <FillIn
                        textArea={false}
                        changeFunction={(e) => {
                          handleCollectionPrices(e, value[2]);
                        }}
                        type={"number"}
                        width={"32"}
                        defaultValue={String(
                          collectionDetails.tokenPrices[index]
                        )}
                      />
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        {value[1]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="relative flex flex-col gap-2 w-fit h-fit justify-start items-center">
            <ButtonAdd
              text={"Mint Collection"}
              width={"28"}
              functionAdd={addCollection}
              loader={addCollectionLoading}
            />
          </div>
        </div>
        <div className="relative w-full h-full flex">
          <CollectionPreview
            collectionDetails={collectionDetails}
            setPrice={setPrice}
            price={price}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCollection;
