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

  const upgradeFirst = () => {
    setNewIndex(0);
    setCollectionArgs([
      "ipfs://QmUgYVToxHkcy7ikbneWrhY7HwvsSHq2Zas4uFR33PonKK",
      8,
      "Thalassa",
      [
        0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,
        0xc2132d05d31c914a87c6611c10748aeb04b58e8f,
      ],
      [150000000000000000000, 150000000000000000000],
    ]);
  };

  const upgradeSecond = () => {
    setNewIndex(1);
    setCollectionArgs([
      "ipfs://QmY1F2d1TKGGHgMNVy1EcabioDfTT6d9A3a5oCLWoJ4APj",
      8,
      "Empathy muse",
      [
        0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,
        0xc2132d05d31c914a87c6611c10748aeb04b58e8f,
      ],
      [150000000000000000000, 150000000000000000000],
    ]);
  };

  const upgradeThird = () => {
    setNewIndex(2);
    setCollectionArgs([
      "ipfs://QmVKwa4uec6JLhjNeroU4ApExVuEPGQsUQvLqwBa9ELcZT",
      8,
      "Lea",
      [
        0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,
        0xc2132d05d31c914a87c6611c10748aeb04b58e8f,
      ],
      [150000000000000000000, 150000000000000000000],
    ]);
  };

  const upgradeFourth = () => {
    setNewIndex(3);
    setCollectionArgs([
      "ipfs://QmUbMQPnF2WX8rCBt4oZ2NpFNdb1FJBaEhM7SkWcYbpEL2",
      8,
      "Reo",
      [
        0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,
        0xc2132d05d31c914a87c6611c10748aeb04b58e8f,
      ],
      [150000000000000000000, 150000000000000000000],
    ]);
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

  const upgradeDrop = () => {
    setDropArgs([
      [29, 30, 31, 32],
      `ipfs://QmR7Y8URQiDg5RqJHsWnDfi4tAHGh8acBneZQkSEMqUJx1`,
    ]);
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

  return {
    upgradeFirst,
    tokensLoading,
    dropLoading,
    upgradeDrop,
    upgradeSecond,
    upgradeThird,
    upgradeFourth,
  };
};

export default useUpgrade;
