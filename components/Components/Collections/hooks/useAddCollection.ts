import { setCollectionDetails } from "@/redux/reducers/collectionDetailsSlice";
import { RootState } from "@/redux/store";
import { BigNumber } from "ethers";
import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAddCollection = () => {
  const dispatch = useDispatch();
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [addCollectionLoading, setAddCollectionLoading] =
    useState<boolean>(false);
  const collectionValues = useSelector(
    (state: RootState) => state.app.collectionDetailsReducer
  );
  const [collectionArgs, setCollectionArgs] = useState<
    [readonly BigNumber[], string] | undefined
  >();

  const handleCollectionTitle = (e: FormEvent): void => {
    dispatch(
      setCollectionDetails({
        actionTitle: (e.target as HTMLFormElement).value,
        actionDescription: collectionValues.description,
        actionImage: collectionValues.image,
      })
    );
  };

  const handleCollectionDescription = (e: FormEvent): void => {
    dispatch(
      setCollectionDetails({
        actionTitle: collectionValues.title,
        actionDescription: (e.target as HTMLFormElement).value,
        actionImage: collectionValues.image,
      })
    );
  };

  const addCollection = async (): Promise<void> => {
    if (
      !collectionValues.image ||
      !collectionValues.title ||
      !collectionValues.description ||
      collectionValues.amount < 1 ||
      collectionValues.acceptedTokens.length < 1 ||
      collectionValues.tokenPrices.length < 1 ||
      collectionValues.acceptedTokens.length !==
        collectionValues.tokenPrices.length
    ) {
      return;
    }
    setAddCollectionLoading(true);
    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          name: collectionValues.title,
          description: collectionValues.description,
          image: collectionValues.image,
          external_url: "https://www.chromadin.xyz/",
        }),
      });
      const responseJSON = await response.json();
      setCollectionArgs([collectionValues.collectionIds as any, responseJSON]);
    } catch (err: any) {
      console.error(err.message);
    }
    setAddCollectionLoading(false);
  };

  return {
    imageLoading,
    setImageLoading,
    handleCollectionDescription,
    handleCollectionTitle,
    addCollectionLoading,
  };
};

export default useAddCollection;
