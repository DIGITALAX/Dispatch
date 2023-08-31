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
import { useAccount } from "wagmi";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";

const useEditCollection = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
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

  console.log({ collectionValues });

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
              image: `ipfs://${
                collectionValues?.image.includes("ipfs://")
                  ? collectionValues?.image?.split("ipfs://")[1]
                  : collectionValues?.image
              }`,
              audio: `ipfs://${
                collectionValues?.audio.includes("ipfs://")
                  ? collectionValues?.audio?.split("ipfs://")[1]
                  : collectionValues?.audio
              }`,
              external_url: "https://www.chromadin.xyz/",
            })
          : JSON.stringify({
              name: collectionValues?.title,
              description: collectionValues?.description,
              image: `ipfs://${
                collectionValues?.image.includes("ipfs://")
                  ? collectionValues?.image?.split("ipfs://")[1]
                  : collectionValues?.image
              }`,
              external_url: "https://www.chromadin.xyz/",
            }),
      });
      const responseJSON = await response.json();

      const { request } = await publicClient.simulateContract({
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
        ] as any,
        functionName: "updateCollectionValues",
        chain: polygon,
        args: [
          collectionValues.id as any,
          collectionValues?.title as any,
          `ipfs://${responseJSON.cid}`,
          collectionValues?.tokenPrices.map((price, i: number) => {
            if (
              i ===
              collectionValues.acceptedTokens.indexOf(AVAILABLE_TOKENS[2][1])
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
        account: address,
      });

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Updating Collection",
        })
      );
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
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
          actionType: collectionType,
        })
      );
    } catch (err: any) {
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
      console.error(err.message);
    }
    setUpdateCollectionLoading(true);
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

      const { request } = await publicClient.simulateContract({
        address: collectionValues?.old
          ? CHROMADIN_COLLECTION_CONTRACT
          : CHROMADIN_COLLECTION_CONTRACT_UPDATED,
        abi: [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_collectionId",
                type: "uint256",
              },
            ],
            name: "burnCollection",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ] as any,
        functionName: "burnCollection",
        chain: polygon,
        args: [collectionValues?.id],
        account: address,
      });

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Updating Collection",
        })
      );
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });

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
          actionType: collectionType,
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
