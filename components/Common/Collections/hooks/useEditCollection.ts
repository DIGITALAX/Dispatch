import {
  AVAILABLE_TOKENS,
  CHROMADIN_COLLECTION_CONTRACT,
  CHROMADIN_COLLECTION_CONTRACT_UPDATED,
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
import { waitForTransaction } from "@wagmi/core";

const useEditCollection = () => {
  const dispatch = useDispatch();
  const collectionValues = useSelector(
    (state: RootState) => state.app.collectionDetailsReducer
  );
  const updateCollectionBool = useSelector(
    (state: RootState) => state.app.updateCollectionReducer.open
  );
  const collectionType = useSelector(
    (state: RootState) => state.app.collectionTypeReducer.value
  );

  const [deleteCollectionLoading, setDeleteCollectionLoading] =
    useState<boolean>(false);
  const [updateCollectionLoading, setUpdateCollectionLoading] =
    useState<boolean>(false);
  const [collectionURIArgs, setCollectionURIArgs] = useState<string>();

  const { config: burnConfig, error } = usePrepareContractWrite({
    address: collectionValues?.old
      ? CHROMADIN_COLLECTION_CONTRACT
      : CHROMADIN_COLLECTION_CONTRACT_UPDATED,
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

  const { config: valuesConfig, isSuccess } = usePrepareContractWrite({
    address: CHROMADIN_COLLECTION_CONTRACT_UPDATED,
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_collectionId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "_collectionName",
            type: "string",
          },
          {
            internalType: "string",
            name: "_newURI",
            type: "string",
          },
          {
            internalType: "uint256[]",
            name: "_newPrices",
            type: "uint256[]",
          },
          {
            internalType: "address[]",
            name: "_newAcceptedTokens",
            type: "address[]",
          },
        ],
        name: "updateCollectionValues",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "updateCollectionValues",
    args: [
      collectionValues.id as any,
      collectionValues?.title as any,
      collectionURIArgs as string,
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
      collectionValues?.acceptedTokens as any,
    ],
    enabled: Boolean(collectionURIArgs),
  });

  const { writeAsync: valuesWriteAsync } = useContractWrite(valuesConfig);

  const updateCollection = async () => {
    if (collectionValues?.old) return;
    if (
      !collectionValues.image ||
      !collectionValues.title ||
      !collectionValues.description ||
      collectionValues.acceptedTokens?.length < 1 ||
      collectionValues.tokenPrices?.length < 1 ||
      collectionValues.acceptedTokens?.length !==
        collectionValues.tokenPrices?.length ||
      collectionValues.tokenPrices.some((value) =>
        /^0+$/.test(String(value))
      ) ||
      (collectionType === "audio/mpeg" && !collectionValues?.audio)
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
        body: collectionValues?.audio
          ? JSON.stringify({
              name: collectionValues?.title,
              description: collectionValues?.description,
              image: `${collectionValues?.image}`,
              audio: `ipfs://${collectionValues?.audio}`,
              external_url: "https://www.chromadin.xyz/",
            })
          : JSON.stringify({
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
    if (collectionValues?.old) return;
    setUpdateCollectionLoading(true);
    try {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Updating Collection",
        })
      );
      let tx = await valuesWriteAsync?.();
      await waitForTransaction({
        hash: tx?.hash!,
        async onSpeedUp(newTransaction) {
          await newTransaction.wait();
          tx!.hash = newTransaction.hash as any;
        },
      });
      dispatch(setUpdateCollection(false));
      setCollectionURIArgs(undefined);
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
      let tx = await burnWriteAsync?.();
      await waitForTransaction({
        hash: tx?.hash!,
        async onSpeedUp(newTransaction) {
          await newTransaction.wait();
          tx!.hash = newTransaction.hash as any;
        },
      });
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
          actionAudio: "",
          actionAudioFileName: "",
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
          actionOld: false,
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
