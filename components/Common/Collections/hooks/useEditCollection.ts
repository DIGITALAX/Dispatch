import {
  AVAILABLE_TOKENS,
  CHROMADIN_COLLECTION_CONTRACT,
} from "@/lib/constants";
import { setCollectionDetails } from "@/redux/reducers/collectionDetailsSlice";
import { setCollectionSwitcher } from "@/redux/reducers/collectionSwitcherSlice";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { setModal } from "@/redux/reducers/modalSlice";
import { setSuccessModal } from "@/redux/reducers/successModalSlice";
import { setUpdateCollection } from "@/redux/reducers/updateCollectionSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

const useEditCollection = () => {
  const dispatch = useDispatch();
  const collectionValues = useSelector(
    (state: RootState) => state.app.collectionDetailsReducer
  );
  const updateCollectionBool = useSelector(
    (state: RootState) => state.app.updateCollectionReducer.open
  );

  const [deleteCollectionLoading, setDeleteCollectionLoading] =
    useState<boolean>(false);
  const [updateCollectionLoading, setUpdateCollectionLoading] =
    useState<boolean>(false);
  const [collectionURIArgs, setCollectionURIArgs] = useState<string>();

  const { config: burnConfig } = usePrepareContractWrite({
    address: CHROMADIN_COLLECTION_CONTRACT,
    abi: [
      {
        inputs: [
          { internalType: "uint256", name: "_collectionId", type: "uint256" },
        ],
        name: "burnCollection",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "burnCollection",
    args: [collectionValues?.id as any],
  });

  const { writeAsync: burnWriteAsync } = useContractWrite(burnConfig);

  const { config: acceptedTokensConfig } = usePrepareContractWrite({
    address: CHROMADIN_COLLECTION_CONTRACT,
    abi: [
      {
        inputs: [
          { internalType: "uint256", name: "_collectionId", type: "uint256" },
          {
            internalType: "address[]",
            name: "_newAcceptedTokens",
            type: "address[]",
          },
        ],
        name: "setCollectionAcceptedTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "setCollectionAcceptedTokens",
    args: [collectionValues.id as any, collectionValues?.acceptedTokens as any],
  });

  const { writeAsync: acceptedTokensWriteAsync } =
    useContractWrite(acceptedTokensConfig);

  const { config: basePricesConfig } = usePrepareContractWrite({
    address: CHROMADIN_COLLECTION_CONTRACT,
    abi: [
      {
        inputs: [
          { internalType: "uint256", name: "_collectionId", type: "uint256" },
          { internalType: "uint256[]", name: "_newPrices", type: "uint256[]" },
        ],
        name: "setCollectionBasePrices",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "setCollectionBasePrices",
    args: [
      collectionValues.id as any,
      collectionValues?.tokenPrices.map((price, i: number) => {
        if (
          i === collectionValues.acceptedTokens.indexOf(AVAILABLE_TOKENS[2][1])
        ) {
          return (BigInt(price) * BigInt(10 ** 6)).toString();
        } else if (Number.isInteger(price)) {
          return (BigInt(price) * BigInt(10 ** 18)).toString();
        } else {
          const [wholePart, decimalPart] = price
            ?.toFixed(2)
            ?.toString()
            ?.split(".");
          const decimalPlaces = decimalPart.length;
          const factor = BigInt(10 ** (18 - decimalPlaces));
          const adjustedPrice = BigInt(wholePart + decimalPart) * factor;
          return adjustedPrice.toString();
        }
      }) as any,
    ],
  });

  const { writeAsync: basePricesConfigWriteAsync } =
    useContractWrite(basePricesConfig);

  const { config: nameConfig } = usePrepareContractWrite({
    address: CHROMADIN_COLLECTION_CONTRACT,
    abi: [
      {
        inputs: [
          { internalType: "string", name: "_collectionName", type: "string" },
          { internalType: "uint256", name: "_collectionId", type: "uint256" },
        ],
        name: "setCollectionName",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "setCollectionName",
    args: [collectionValues?.title as any, collectionValues.id as any],
  });

  const { writeAsync: nameConfigWriteAsync } = useContractWrite(nameConfig);

  const { config: metadataConfig, isSuccess } = usePrepareContractWrite({
    address: CHROMADIN_COLLECTION_CONTRACT,
    abi: [
      {
        inputs: [
          { internalType: "string", name: "_newURI", type: "string" },
          { internalType: "uint256", name: "_collectionId", type: "uint256" },
        ],
        name: "setCollectionURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "setCollectionURI",
    args: [collectionURIArgs as string, collectionValues.id as any],
    enabled: Boolean(collectionURIArgs),
  });

  const { writeAsync: metadataConfigWriteAsync } =
    useContractWrite(metadataConfig);

  const updateCollection = async () => {
    if (
      !collectionValues.image ||
      !collectionValues.title ||
      !collectionValues.description ||
      collectionValues.acceptedTokens?.length < 1 ||
      collectionValues.tokenPrices?.length < 1 ||
      collectionValues.acceptedTokens?.length !==
        collectionValues.tokenPrices?.length ||
      collectionValues.tokenPrices.some((value) => /^0+$/.test(String(value)))
    ) {
      dispatch(
        setModal({
          actionOpen: true,
          actionMessage: "Missing fields detected; please try again",
        })
      );
      return;
    }
    setUpdateCollectionLoading(true);
    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          name: collectionValues?.title,
          description: collectionValues?.description,
          image: `${collectionValues?.image}`,
          external_url: "https://www.chromadin.xyz/",
        }),
      });
      const responseJSON = await response.json();
      setCollectionURIArgs(`ipfs://${responseJSON.cid}`);
    } catch (err: any) {
      console.error(err.message);
    }
    setUpdateCollectionLoading(true);
  };

  const updateCollectionWrite = async () => {
    setUpdateCollectionLoading(true);
    try {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Updating Collection",
        })
      );
      const txName = await nameConfigWriteAsync?.();
      const txMetadata = await metadataConfigWriteAsync?.();
      const txPrice = await basePricesConfigWriteAsync?.();
      const txAccepted = await acceptedTokensWriteAsync?.();
      await txName?.wait();
      await txMetadata?.wait();
      await txPrice?.wait();
      await txAccepted?.wait();
      dispatch(setUpdateCollection(false));
      dispatch(
        setIndexModal({
          actionValue: false,
          actionMessage: "",
        })
      );
      dispatch(
        setSuccessModal({
          actionOpen: true,
          actionMedia: collectionValues.image,
          actionLink: "",
          actionMessage:
            "Collection Updated! Your Collection has been updated.",
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setUpdateCollectionLoading(false);
  };

  const deleteCollection = async (): Promise<void> => {
    setDeleteCollectionLoading(true);
    try {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Deleting Collection",
        })
      );
      const tx = await burnWriteAsync?.();
      await tx?.wait();
      dispatch(
        setIndexModal({
          actionValue: false,
          actionMessage: "",
        })
      );
      dispatch(
        setSuccessModal({
          actionOpen: true,
          actionMedia: collectionValues.image,
          actionLink: "",
          actionMessage: "Collection Burned! Your Collection has been burned.",
        })
      );
      dispatch(setCollectionSwitcher("collections"));
      dispatch(
        setCollectionDetails({
          actionTitle: "",
          actionDescription: "",
          actionImage: "",
          actionAmount: 1,
          actionAcceptedTokens: [],
          actionTokenPrices: [],
          actionDisabled: false,
          actionFileType: "",
          actionType: "",
          actionId: 0,
          actionSoldTokens: [],
          actionTokenIds: [],
          actionLive: false,
        })
      );
    } catch (err: any) {
      console.error(err.message);
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Unsuccessful. Please Try Again.",
        })
      );
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: false,
            actionMessage: "",
          })
        );
      }, 4000);
    }

    setDeleteCollectionLoading(false);
  };

  useEffect(() => {
    if (isSuccess) {
      updateCollectionWrite();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!updateCollectionBool && updateCollectionLoading) {
      setUpdateCollectionLoading(false);
    }
  }, [updateCollectionBool]);

  return {
    updateCollection,
    deleteCollection,
    deleteCollectionLoading,
    updateCollectionLoading,
  };
};

export default useEditCollection;
