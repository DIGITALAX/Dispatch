import {
  AVAILABLE_TOKENS,
  CHROMADIN_COLLECTION_CONTRACT_UPDATED,
} from "@/lib/constants";
import { setCanEdit } from "@/redux/reducers/canEditCollectionSlice";
import { setCollectionDetails } from "@/redux/reducers/collectionDetailsSlice";
import { setCollectionSwitcher } from "@/redux/reducers/collectionSwitcherSlice";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { setModal } from "@/redux/reducers/modalSlice";
import { setSuccessModal } from "@/redux/reducers/successModalSlice";
import { RootState } from "@/redux/store";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";
import { useAccount } from "wagmi";

const useAddCollection = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [addCollectionLoading, setAddCollectionLoading] =
    useState<boolean>(false);
  const [price, setPrice] = useState<{ value: number; currency: string }>();
  const [editingIndex, setEditingIndex] = useState<number>(0);
  const collectionValues = useSelector(
    (state: RootState) => state.app.collectionDetailsReducer
  );
  const collectionType = useSelector(
    (state: RootState) => state.app.collectionTypeReducer.value
  );

  const handleCollectionTitle = (e: FormEvent): void => {
    dispatch(
      setCollectionDetails({
        actionTitle: (e.target as HTMLFormElement).value,
        actionDescription: collectionValues?.description,
        actionImage: collectionValues?.image,
        actionAmount: collectionValues?.amount,
        actionAudio: collectionValues?.audio,
        actionAudioFileName: collectionValues?.audioFileName,
        actionAcceptedTokens: collectionValues?.acceptedTokens,
        actionTokenPrices: collectionValues?.tokenPrices,
        actionDisabled: collectionValues?.disabled,
        actionFileType: collectionValues.fileType,
        actionType: collectionValues?.type,
        actionId: collectionValues.id,
        actionSoldTokens: collectionValues?.soldTokens,
        actionTokenIds: collectionValues?.tokenIds,
        actionLive: collectionValues?.live,
        actionOld: collectionValues?.old,
      })
    );
  };

  const handleCollectionDescription = (e: FormEvent): void => {
    dispatch(
      setCollectionDetails({
        actionTitle: collectionValues.title,
        actionDescription: (e.target as HTMLFormElement).value,
        actionImage: collectionValues?.image,
        actionAmount: collectionValues?.amount,
        actionAudio: collectionValues?.audio,
        actionAudioFileName: collectionValues?.audioFileName,
        actionAcceptedTokens: collectionValues?.acceptedTokens,
        actionTokenPrices: collectionValues?.tokenPrices,
        actionDisabled: collectionValues?.disabled,
        actionFileType: collectionValues.fileType,
        actionType: collectionValues?.type,
        actionId: collectionValues.id,
        actionSoldTokens: collectionValues?.soldTokens,
        actionTokenIds: collectionValues?.tokenIds,
        actionLive: collectionValues?.live,
        actionOld: collectionValues?.old,
      })
    );
  };

  const handleCollectionAmount = (e: FormEvent): void => {
    dispatch(
      setCollectionDetails({
        actionTitle: collectionValues?.title,
        actionDescription: collectionValues?.description,
        actionImage: collectionValues?.image,
        actionAudio: collectionValues?.audio,
        actionAudioFileName: collectionValues?.audioFileName,
        actionAmount: Number((e.target as HTMLFormElement).value),
        actionAcceptedTokens: collectionValues?.acceptedTokens,
        actionTokenPrices: collectionValues?.tokenPrices,
        actionDisabled: collectionValues?.disabled,
        actionFileType: collectionValues.fileType,
        actionType: collectionValues?.type,
        actionId: collectionValues.id,
        actionSoldTokens: collectionValues?.soldTokens,
        actionTokenIds: collectionValues?.tokenIds,
        actionLive: collectionValues?.live,
        actionOld: collectionValues?.old,
      })
    );
  };

  const handleCollectionPrices = (e: FormEvent, address: string): void => {
    const acceptedTokens = collectionValues?.acceptedTokens && [
      ...collectionValues?.acceptedTokens,
    ];
    const tokenPrices = collectionValues?.tokenPrices && [
      ...collectionValues?.tokenPrices,
    ];
    const tokenIndex = acceptedTokens?.indexOf(address);

    setEditingIndex(tokenIndex);

    const value = (e.target as HTMLFormElement).value;
    const formattedValue = value === "" ? "" : Number(value).toFixed(2);

    if (formattedValue === "") {
      if (tokenIndex !== -1) {
        acceptedTokens.splice(tokenIndex, 1);
        tokenPrices.splice(tokenIndex, 1);
      }
    } else {
      if (tokenIndex !== -1) {
        tokenPrices[tokenIndex] = Number((e.target as HTMLFormElement).value);
      } else {
        acceptedTokens.push(address);
        tokenPrices.push(Number((e.target as HTMLFormElement).value));
      }
    }

    dispatch(
      setCollectionDetails({
        actionTitle: collectionValues?.title,
        actionDescription: collectionValues?.description,
        actionImage: collectionValues?.image,
        actionAudio: collectionValues?.audio,
        actionAudioFileName: collectionValues?.audioFileName,
        actionAmount: collectionValues?.amount,
        actionAcceptedTokens: acceptedTokens,
        actionTokenPrices: tokenPrices,
        actionDisabled: collectionValues?.disabled,
        actionFileType: collectionValues.fileType,
        actionType: collectionValues?.type,
        actionId: collectionValues.id,
        actionSoldTokens: collectionValues?.soldTokens,
        actionTokenIds: collectionValues?.tokenIds,
        actionLive: collectionValues?.live,
        actionOld: collectionValues?.old,
      })
    );
  };
  const addCollection = async (): Promise<void> => {
    if (
      !collectionValues.image ||
      !collectionValues.title ||
      !collectionValues.description ||
      collectionValues.amount < 1 ||
      collectionValues.acceptedTokens?.length < 1 ||
      collectionValues.tokenPrices?.length < 1 ||
      collectionValues.acceptedTokens?.length !==
        collectionValues.tokenPrices?.length ||
      collectionValues.tokenPrices.some((value) =>
        /^0+$/.test(String(value))
      ) ||
      (collectionType === "audio/mpeg" &&
        !collectionValues?.audio &&
        !collectionValues?.audioFileName)
    ) {
      dispatch(
        setModal({
          actionOpen: true,
          actionMessage: "Missing fields detected; please try again",
        })
      );
      return;
    }
    setAddCollectionLoading(true);
    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body:
          collectionType === "audio/mpeg"
            ? JSON.stringify({
                name: collectionValues?.title,
                description: collectionValues?.description,
                image: `ipfs://${collectionValues?.image}`,
                audio: `ipfs://${collectionValues?.audio}`,
                external_url: "https://www.chromadin.xyz/",
              })
            : JSON.stringify({
                name: collectionValues?.title,
                description: collectionValues?.description,
                image: `ipfs://${collectionValues?.image}`,
                external_url: "https://www.chromadin.xyz/",
              }),
      });
      const responseJSON = await response.json();

      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Minting Collection",
        })
      );
      const { request } = await publicClient.simulateContract({
        address: CHROMADIN_COLLECTION_CONTRACT_UPDATED,
        abi: [
          {
            inputs: [
              {
                internalType: "string",
                name: "_uri",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "_collectionName",
                type: "string",
              },
              {
                internalType: "address[]",
                name: "_acceptedTokens",
                type: "address[]",
              },
              {
                internalType: "uint256[]",
                name: "_basePrices",
                type: "uint256[]",
              },
            ],
            name: "mintCollection",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "mintCollection" as any,
        args: [
          `ipfs://${responseJSON.cid}`,
          Math.ceil(collectionValues?.amount) as any,
          collectionValues?.title,
          collectionValues?.acceptedTokens as any,
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
        ],
        account: address,
      });
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
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
          actionMessage:
            "Collection Minted! Before your collection is live on the Market, you need to add it to a drop.",
        })
      );
      dispatch(setCollectionSwitcher("collections"));
      dispatch(
        setCollectionDetails({
          actionTitle: "",
          actionDescription: "",
          actionImage: "",
          actionAmount: 1,
          actionAudio: "",
          actionAudioFileName: "",
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
    setAddCollectionLoading(false);
  };

  useEffect(() => {
    if (
      collectionValues.tokenPrices?.length > 0 &&
      editingIndex !== undefined
    ) {
      const currencyAddress = collectionValues?.acceptedTokens[editingIndex];
      const matchingToken = AVAILABLE_TOKENS.find(
        (token) => token[1] === currencyAddress
      );
      if (matchingToken) {
        setPrice({
          value: Number(
            parseFloat(
              String(collectionValues.tokenPrices[editingIndex])
            ).toFixed(2)
          ),
          currency: matchingToken[0],
        });
      } else if (collectionValues?.acceptedTokens?.length > 0) {
        const lastCurrencyAddress =
          collectionValues?.acceptedTokens.slice(-1)[0];
        const lastMatchingToken = AVAILABLE_TOKENS.find(
          (token) => token[1] === lastCurrencyAddress
        );
        if (lastMatchingToken) {
          setPrice({
            value: Number(
              parseFloat(
                String(collectionValues.tokenPrices.slice(-1)[0])
              ).toFixed(2)
            ),
            currency: lastMatchingToken[0],
          });
        }
      }
    }
  }, [collectionValues.tokenPrices, editingIndex]);

  useEffect(() => {
    if (
      collectionValues?.soldTokens?.length === 0 ||
      !collectionValues?.soldTokens
    ) {
      dispatch(setCanEdit(true));
    } else {
      dispatch(setCanEdit(false));
    }
  }, [collectionValues.id]);

  return {
    imageLoading,
    setImageLoading,
    handleCollectionDescription,
    handleCollectionTitle,
    addCollectionLoading,
    addCollection,
    handleCollectionAmount,
    handleCollectionPrices,
    price,
    setPrice,
    audioLoading,
    setAudioLoading,
  };
};

export default useAddCollection;
