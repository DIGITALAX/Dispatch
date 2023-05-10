import {
  CHROMADIN_COLLECTION_CONTRACT,
  CHROMADIN_DROP_CONTRACT,
} from "@/lib/constants";
import { setUpgrade } from "@/redux/reducers/upgradeSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

const useUpgrade = () => {
  const dispatch = useDispatch();
  const upgraded = useSelector((state: RootState) => state.app.upgradeReducer);
  const allCollections = useSelector(
    (state: RootState) => state.app.allCollectionsReducer.value
  );
  const [collectionArgs, setCollectionArgs] = useState<any[]>([]);
  const [tokensLoading, setTokensLoading] = useState<boolean[]>(
    Array.from({ length: allCollections.length }, () => false)
  );
  const [dropLoading, setDropLoading] = useState<boolean>(false);
  const [newIndex, setNewIndex] = useState<number>();
  const [dropArgs, setDropArgs] = useState<any[]>([]);

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
    args: collectionArgs as any,
  });

  const { writeAsync } = useContractWrite(config);

  const { config: dropConfig, isSuccess: dropSuccess } =
    usePrepareContractWrite({
      address: CHROMADIN_DROP_CONTRACT,
      abi: [
        {
          inputs: [
            {
              internalType: "uint256[]",
              name: "_collectionIds",
              type: "uint256[]",
            },
            { internalType: "string", name: "_dropURI", type: "string" },
          ],
          name: "createDrop",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      functionName: "createDrop",
      enabled: Boolean(dropArgs),
      args: dropArgs as any,
    });

  const { writeAsync: dropWriteAsync } = useContractWrite(dropConfig);

  const upgradeTokens = (args: any, index: number) => {
    setNewIndex(index);

    setCollectionArgs(args);
  };

  const writeUpgrade = async () => {
    if (tokensLoading.length < 1) {
      setTokensLoading(
        Array.from({ length: allCollections.length }, (_, i) => i === newIndex)
      );
    } else {
      setTokensLoading((prevLoading) =>
        prevLoading.map((loading, i) => (i === newIndex ? true : loading))
      );
    }

    try {
      const tx = await writeAsync?.();
      await tx?.wait();
      dispatch(
        setUpgrade({
          actionColl: upgraded.upgradedColl.map((obj, i) =>
            i === newIndex ? true : obj
          ),
          actionDrop: upgraded.upgradeDrop,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setTokensLoading((prevLoading) =>
      prevLoading.map((loading, i) => (i === newIndex ? false : loading))
    );
  };

  const upgradeDrop = (args: any) => {
    // console.log(args)
    setDropArgs(args);
  };

  const writeDrop = async () => {
    setDropLoading(true);
    try {
      const tx = await dropWriteAsync?.();
      await tx?.wait();
    } catch (err: any) {
      console.error(err.message);
    }
    setDropLoading(false);
  };

  useEffect(() => {
    if (dropSuccess) {
      writeDrop();
    }
  }, [dropSuccess]);

  useEffect(() => {
    if (isSuccess) {
      writeUpgrade();
    }
  }, [isSuccess]);

  return { upgradeTokens, tokensLoading, dropLoading, upgradeDrop };
};

export default useUpgrade;
