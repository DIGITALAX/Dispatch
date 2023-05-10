import {
  CHROMADIN_COLLECTION_CONTRACT,
  CHROMADIN_DROP_CONTRACT,
} from "@/lib/constants";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

const useUpgrade = () => {
  const [collectionArgs, setCollectionArgs] = useState<any[]>([]);
  const [tokensLoading, setTokensLoading] = useState<boolean[]>(
    Array.from({ length: 4 }, () => false)
  );
  const [dropLoading, setDropLoading] = useState<boolean>(false);
  const [newIndex, setNewIndex] = useState<number>();
  const [dropArgs, setDropArgs] = useState<any[]>([]);

  const { config, isSuccess } = usePrepareContractWrite({
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
    enabled: Boolean(collectionArgs),
    args: collectionArgs as any,
  });

  const { writeAsync } = useContractWrite(config);

  const upgradeFirst = () => {
    setNewIndex(0);
    setCollectionArgs([29, ["150000000000000000000", "150000000"]]);
  };

  const upgradeSecond = () => {
    setNewIndex(1);
    setCollectionArgs([30, ["150000000000000000000", "150000000"]]);
  };

  const upgradeThird = () => {
    setNewIndex(2);
    setCollectionArgs([31, ["150000000000000000000", "150000000"]]);
  };

  const upgradeFourth = () => {
    setNewIndex(3);
    setCollectionArgs([32, ["150000000000000000000", "150000000"]]);
  };

  const writeUpgrade = async () => {
    if (tokensLoading.length < 1) {
      setTokensLoading(Array.from({ length: 4 }, (_, i) => i === newIndex));
    } else {
      setTokensLoading((prevLoading) =>
        prevLoading.map((loading, i) => (i === newIndex ? true : loading))
      );
    }

    try {
      const tx = await writeAsync?.();
      await tx?.wait();
    } catch (err: any) {
      console.error(err.message);
    }
    setTokensLoading((prevLoading) =>
      prevLoading.map((loading, i) => (i === newIndex ? false : loading))
    );
  };

  useEffect(() => {
    if (isSuccess) {
      writeUpgrade();
    }
  }, [isSuccess]);

  return {
    upgradeFirst,
    tokensLoading,
    dropLoading,
    upgradeSecond,
    upgradeThird,
    upgradeFourth,
  };
};

export default useUpgrade;
