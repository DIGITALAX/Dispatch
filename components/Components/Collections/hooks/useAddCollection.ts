import getAllCollections from "@/graphql/subgraph/queries/getAllCollections";
import { CHROMADIN_COLLECTION_CONTRACT } from "@/lib/constants";
import { setAllCollectionsRedux } from "@/redux/reducers/allCollectionsSlice";
import { setCollectionDetails } from "@/redux/reducers/collectionDetailsSlice";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { setModal } from "@/redux/reducers/modalSlice";
import { setSuccessModal } from "@/redux/reducers/successModalSlice";
import { RootState } from "@/redux/store";
import { BigNumber } from "ethers";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

const useAddCollection = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const availableTokens = [
    ["WMATIC", "0x6199a505ec1707695ce49b59a07a147f2d50f22d"],
    ["WETH", "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"],
    ["USDT", "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"],
    ["MONA", "0x6968105460f67c3bf751be7c15f92f5286fd0ce5"],
  ];
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [addCollectionLoading, setAddCollectionLoading] =
    useState<boolean>(false);
  const [price, setPrice] = useState<{ value: number; currency: string }>();
  const [editingIndex, setEditingIndex] = useState<number>(0);
  const collectionValues = useSelector(
    (state: RootState) => state.app.collectionDetailsReducer
  );
  const [collectionArgs, setCollectionArgs] = useState<
    | [
        string,
        BigNumber,
        string,
        readonly `0x${string}`[],
        readonly BigNumber[]
      ]
    | undefined
  >();

  const { config, isSuccess } = usePrepareContractWrite({
    address: CHROMADIN_COLLECTION_CONTRACT,
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
    functionName: "mintCollection",
    enabled: Boolean(collectionArgs),
    args: collectionArgs,
  });

  const { writeAsync } = useContractWrite(config);

  const handleCollectionTitle = (e: FormEvent): void => {
    dispatch(
      setCollectionDetails({
        actionTitle: (e.target as HTMLFormElement).value,
        actionDescription: collectionValues.description,
        actionImage: collectionValues.image,
        actionAmount: collectionValues.amount,
        actionAcceptedTokens: collectionValues.acceptedTokens,
        actionTokenPrices: collectionValues.tokenPrices,
      })
    );
  };

  const handleCollectionDescription = (e: FormEvent): void => {
    dispatch(
      setCollectionDetails({
        actionTitle: collectionValues.title,
        actionDescription: (e.target as HTMLFormElement).value,
        actionImage: collectionValues.image,
        actionAmount: collectionValues.amount,
        actionAcceptedTokens: collectionValues.acceptedTokens,
        actionTokenPrices: collectionValues.tokenPrices,
      })
    );
  };

  const handleCollectionAmount = (e: FormEvent): void => {
    dispatch(
      setCollectionDetails({
        actionTitle: collectionValues.title,
        actionDescription: collectionValues.description,
        actionImage: collectionValues.image,
        actionAmount: Number((e.target as HTMLFormElement).value),
        actionAcceptedTokens: collectionValues.acceptedTokens,
        actionTokenPrices: collectionValues.tokenPrices,
      })
    );
  };

  const handleCollectionPrices = (e: FormEvent, address: string): void => {
    const acceptedTokens = [...collectionValues.acceptedTokens];
    const tokenPrices = [...collectionValues.tokenPrices];
    const tokenIndex = acceptedTokens.indexOf(address);

    setEditingIndex(tokenIndex);

    if ((e.target as HTMLFormElement).value === "") {
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
        actionTitle: collectionValues.title,
        actionDescription: collectionValues.description,
        actionImage: collectionValues.image,
        actionAmount: collectionValues.amount,
        actionAcceptedTokens: acceptedTokens,
        actionTokenPrices: tokenPrices,
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
        body: JSON.stringify({
          name: collectionValues.title,
          description: collectionValues.description,
          image: collectionValues.image,
          external_url: "https://www.chromadin.xyz/",
        }),
      });
      const responseJSON = await response.json();
      setCollectionArgs([
        responseJSON,
        collectionValues.amount as any,
        collectionValues.title,
        collectionValues.acceptedTokens as any,
        collectionValues.tokenPrices.map(
          (price) => BigInt(price) * BigInt(10 ** 18)
        ) as any,
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
    setAddCollectionLoading(false);
  };

  const addCollectionWrite = async (): Promise<void> => {
    setAddCollectionLoading(true);
    try {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Minting Collection",
        })
      );
      const tx = await writeAsync?.();
      await tx?.wait();
      const newCollections = await getAllCollections({ creator: address });
      dispatch(setAllCollectionsRedux(newCollections.data.collectionMinteds));
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
            "Collection Minted! Before you're collection is live on the Market, you need to add it to a drop.",
        })
      );
      dispatch(
        setCollectionDetails({
          actionTitle: "",
          actionDescription: "",
          actionImage: "",
          actionAmount: 1,
          actionAcceptedTokens: [],
          actionTokenPrices: [],
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
        setIndexModal({
          actionValue: false,
          actionMessage: "",
        })
      }, 4000)
    }
    setAddCollectionLoading(false);
  };

  useEffect(() => {
    if (isSuccess) {
      addCollectionWrite();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (
      collectionValues.tokenPrices?.length > 0 &&
      editingIndex !== undefined
    ) {
      const currencyAddress = collectionValues.acceptedTokens[editingIndex];
      const matchingToken = availableTokens.find(
        (token) => token[1] === currencyAddress
      );
      if (matchingToken) {
        setPrice({
          value: parseInt(
            String(collectionValues.tokenPrices[editingIndex]),
            10
          ),
          currency: matchingToken[0],
        });
      } else if (collectionValues.acceptedTokens.length > 0) {
        const lastCurrencyAddress =
          collectionValues.acceptedTokens.slice(-1)[0];
        const lastMatchingToken = availableTokens.find(
          (token) => token[1] === lastCurrencyAddress
        );
        if (lastMatchingToken) {
          setPrice({
            value: parseInt(
              String(collectionValues.tokenPrices.slice(-1)[0]),
              10
            ),
            currency: lastMatchingToken[0],
          });
        }
      }
    }
  }, [collectionValues.tokenPrices, editingIndex]);

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
  };
};

export default useAddCollection;
