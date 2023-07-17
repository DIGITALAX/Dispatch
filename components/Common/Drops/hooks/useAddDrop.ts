import getAllCollections, {
  getAllCollectionsUpdated,
} from "@/graphql/subgraph/queries/getAllCollections";
import getAllDrops, {
  getAllDropsUpdated,
} from "@/graphql/subgraph/queries/getAllDrops";
import {
  CHROMADIN_DROP_CONTRACT,
  CHROMADIN_DROP_CONTRACT_UPDATED,
} from "@/lib/constants";
import { setAllDropsRedux } from "@/redux/reducers/allDropsSlice";
import { setDropDetails } from "@/redux/reducers/dropDetailsSlice";
import { setDropSwitcher } from "@/redux/reducers/dropSwitcherSlice";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { setModal } from "@/redux/reducers/modalSlice";
import { setSuccessModal } from "@/redux/reducers/successModalSlice";
import { RootState } from "@/redux/store";
import { BigNumber } from "ethers";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { waitForTransaction } from "@wagmi/core";

const useAddDrop = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const dropValues = useSelector(
    (state: RootState) => state.app.dropDetailsReducer
  );
  const prof = useSelector(
    (state: RootState) => state.app.autographHandleReducer.value
  );
  const dropSwitcher = useSelector(
    (state: RootState) => state.app.dropSwitcherReducer.value
  );
  const allCollections = useSelector(
    (state: RootState) => state.app.allCollectionsReducer.value
  );
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [addDropLoading, setAddDropLoading] = useState<boolean>(false);
  const [availableCollectionIds, setAvailableCollectionIds] = useState<
    string[]
  >([]);
  const [dropArgs, setDropArgs] = useState<
    [readonly BigNumber[], string] | undefined
  >();
  const [addArgs, setAddArgs] = useState<
    [BigNumber, BigNumber[]] | undefined | [BigNumber, BigNumber]
  >();
  const [open, setOpen] = useState<boolean>(false);
  const [chosenCollections, setChosenCollections] = useState<string[]>([]);
  const [alreadyInDrop, setAlreadyInDrop] = useState<string[]>([]);
  const [alreadyInDropIds, setAlreadyInDropIds] = useState<string[]>([]);
  const [deleteDropLoading, setDeleteDropLoading] = useState<boolean>(false);
  const [collectionToRemove, setCollectionToRemove] = useState<number>(0);
  const [collectionRemoveIndex, setCollectionRemoveIndex] = useState<number>(0);
  const [removeCollectionLoading, setRemoveCollectionLoading] = useState<
    boolean[]
  >(Array.from({ length: chosenCollections.length }, () => false));

  const { config, isSuccess } = usePrepareContractWrite({
    address: dropValues?.old
      ? CHROMADIN_DROP_CONTRACT
      : CHROMADIN_DROP_CONTRACT_UPDATED,
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
    args: dropArgs,
  });

  const { writeAsync } = useContractWrite(config);

  const { config: addConfig, isSuccess: addIsSuccess } =
    usePrepareContractWrite({
      address: dropValues?.old
        ? CHROMADIN_DROP_CONTRACT
        : CHROMADIN_DROP_CONTRACT_UPDATED,
      abi: [
        dropValues?.old
          ? {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_dropId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "_collectionId",
                  type: "uint256",
                },
              ],
              name: "addCollectionToDrop",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            }
          : {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_dropId",
                  type: "uint256",
                },
                {
                  internalType: "uint256[]",
                  name: "_collectionIds",
                  type: "uint256[]",
                },
              ],
              name: "addCollectionToDrop",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
      ],
      functionName: "addCollectionToDrop",
      enabled: Boolean(addArgs),
      args: addArgs,
    });

  const { writeAsync: writeAddAsync } = useContractWrite(addConfig);

  const { config: deleteConfig } = usePrepareContractWrite({
    address: dropValues?.old
      ? CHROMADIN_DROP_CONTRACT
      : CHROMADIN_DROP_CONTRACT_UPDATED,
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_dropId",
            type: "uint256",
          },
        ],
        name: "deleteDrop",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "deleteDrop",
    args: [dropValues?.id as any],
  });

  const { writeAsync: deleteWriteAsync } = useContractWrite(deleteConfig);

  const {
    config: removeCollectionConfig,
    isSuccess: removeCollectionIsSuccess,
  } = usePrepareContractWrite({
    address: dropValues?.old
      ? CHROMADIN_DROP_CONTRACT
      : CHROMADIN_DROP_CONTRACT_UPDATED,
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_collectionId",
            type: "uint256",
          },
        ],
        name: "removeCollectionFromDrop",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "removeCollectionFromDrop",
    enabled: Boolean(collectionToRemove !== 0),
    args: [collectionToRemove] as any,
  });

  const { writeAsync: removeCollectionWriteAsync } = useContractWrite(
    removeCollectionConfig
  );

  const addDrop = async (): Promise<void> => {
    if (!dropValues.image || !dropValues.title) {
      dispatch(
        setModal({
          actionOpen: true,
          actionMessage: "Missing fields detected; please try again",
        })
      );
      return;
    }
    setAddDropLoading(true);
    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          name: dropValues.title,
          image: `ipfs://${dropValues.image}`,
        }),
      });
      const responseJSON = await response.json();
      setDropArgs([
        chosenCollections.map((chosenName) => {
          const matchingCollection = allCollections.find(
            (collection) => collection.name === chosenName
          );
          return matchingCollection
            ? Number(matchingCollection.collectionId)
            : null;
        }) as any,
        `ipfs://${responseJSON.cid}`,
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
    setAddDropLoading(false);
  };

  const addDropWrite = async (): Promise<void> => {
    setAddDropLoading(true);
    try {
      let tx = await writeAsync?.();
      await waitForTransaction({
        hash: tx?.hash!,
        async onSpeedUp(newTransaction) {
          await newTransaction.wait();
          tx!.hash = newTransaction.hash as any;
        },
      });
      dispatch(
        setSuccessModal({
          actionOpen: true,
          actionMedia: dropValues.image,
          actionLink: `http://www.chromadin.xyz/${
            prof?.split(".lens")[0]
          }/drop/${dropValues.title?.replaceAll(" ", "_").toLowerCase()}`,
          actionMessage: "Drop Live! You can view your live drop here",
        })
      );
      dispatch(setDropSwitcher("drops"));
      dispatch(
        setDropDetails({
          actionTitle: "",
          actionImage: "",
          actionCollectionIds: [],
          actionDisabled: false,
          actionFileType: "",
          actionId: 0,
          actionType: "",
          actionOld: false,
        })
      );
      setDropArgs(undefined);
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
    setAddDropLoading(false);
  };

  const handleDropTitle = (e: FormEvent): void => {
    dispatch(
      setDropDetails({
        actionTitle: (e.target as HTMLFormElement).value,
        actionImage: dropValues.image,
        actionCollectionIds: dropValues.collectionIds,
        actionDisabled: false,
        actionFileType: dropValues.fileType,
        actionId: dropValues.id,
        actionType: dropValues.type,
        actionOld: false,
      })
    );
  };

  const getAvailableCollections = async (): Promise<void> => {
    try {
      const drops = await getAllDrops(address);
      const colls = await getAllCollections(address);
      const updatedColls = await getAllCollectionsUpdated(address);
      const updatedDrops = await getAllDropsUpdated(address);

      const dropIds = drops.data.dropCreateds.flatMap(
        (d: any) => d.collectionIds
      );
      const dropIdsUpdated =
        updatedDrops.data.updatedChromadinDropDropCreateds.flatMap(
          (d: any) => d.collectionIds
        );

      setAvailableCollectionIds(
        dropValues?.old
          ? colls?.data?.collectionMinteds
              .filter((c: any) => !dropIds.includes(c.collectionId))
              .map((c: any) => c.name)
          : updatedColls?.data?.updatedChromadinCollectionCollectionMinteds
              .filter((c: any) => !dropIdsUpdated.includes(c.collectionId))
              .map((c: any) => c.name)
      );

      setChosenCollections(
        allCollections
          .filter((cd) => {
            const blockstampCondition = dropValues.old
              ? Number(cd.blockNumber) < 45189643
              : Number(cd.blockNumber) >= 45189643;
            return (
              (dropValues.collectionIds as any).includes(cd.collectionId) &&
              blockstampCondition
            );
          })
          .map((cd) => cd.name)
      );
      setAlreadyInDrop(
        allCollections
          .filter((cd) => {
            const blockstampCondition = dropValues.old
              ? Number(cd.blockNumber) < 45189643
              : Number(cd.blockNumber) >= 45189643;
            return (
              (dropValues.collectionIds as any).includes(cd.collectionId) &&
              blockstampCondition
            );
          })
          .map((cd) => cd.name)
      );
      setAlreadyInDropIds(
        allCollections
          .filter((cd) => {
            const blockstampCondition = dropValues.old
              ? Number(cd.blockNumber) < 45189643
              : Number(cd.blockNumber) >= 45189643;
            return (
              (dropValues.collectionIds as any).includes(cd.collectionId) &&
              blockstampCondition
            );
          })
          .map((cd) => cd.collectionId)
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const addMore = async () => {
    try {
      if (
        chosenCollections?.length === alreadyInDrop?.length &&
        alreadyInDrop.length !== 0
      ) {
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Missing fields detected; please try again",
          })
        );
        return;
      }
      setAddDropLoading(true);
      try {
        setAddArgs([
          Number(dropValues.id) as any,
          dropValues?.old
            ? Number(
                allCollections.find((collection) => {
                  return (
                    collection.name ===
                    chosenCollections[chosenCollections?.length - 1]
                  );
                })?.collectionId
              )
            : ([
                Number(
                  allCollections.find((collection) => {
                    return (
                      collection.name ===
                      chosenCollections[chosenCollections?.length - 1]
                    );
                  })?.collectionId
                ) as any,
              ] as any),
        ]);
      } catch (err: any) {
        console.error(err.message);
      }
      setAddDropLoading(false);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const addMoreWrite = async () => {
    setAddDropLoading(true);
    try {
      let tx = await writeAddAsync?.();
      await waitForTransaction({
        hash: tx?.hash!,
        async onSpeedUp(newTransaction) {
          await newTransaction.wait();
          tx!.hash = newTransaction.hash as any;
        },
      });
      const newDrops = await getAllDrops(address);
      const newDropsUpdated = await getAllDropsUpdated(address);
      dispatch(
        setAllDropsRedux([
          ...(newDrops.data.dropCreateds || []),
          ...(newDropsUpdated.data.updatedChromadinDropDropCreateds || []),
        ])
      );
      dispatch(
        setSuccessModal({
          actionOpen: true,
          actionMedia: dropValues.image,
          actionLink: `http://www.chromadin.xyz/${
            prof?.split(".lens")[0]
          }/drop/${dropValues.title?.replaceAll(" ", "_").toLowerCase()}`,
          actionMessage: "Collection Added! You can view your live drop here:",
        })
      );
      dispatch(setDropSwitcher("drops"));
      setAddArgs(undefined);
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
    setAddDropLoading(false);
  };

  const deleteDrop = async (): Promise<void> => {
    setDeleteDropLoading(true);
    try {
      let tx = await deleteWriteAsync?.();
      await waitForTransaction({
        hash: tx?.hash!,
        async onSpeedUp(newTransaction) {
          await newTransaction.wait();
          tx!.hash = newTransaction.hash as any;
        },
      });
      const newDrops = await getAllDrops(address);
      const newDropsUpdated = await getAllDropsUpdated(address);
      dispatch(
        setAllDropsRedux([
          ...(newDrops.data.dropCreateds || []),
          ...(newDropsUpdated.data.updatedChromadinDropDropCreateds || []),
        ])
      );
      dispatch(
        setSuccessModal({
          actionOpen: true,
          actionMedia: dropValues.image,
          actionLink: "",
          actionMessage:
            "Drop Deleted! Your drop has been deleted and included collections been removed from the market.",
        })
      );
      dispatch(setDropSwitcher("drops"));
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
    setDeleteDropLoading(false);
  };

  const removeCollectionFromDrop = async (collectionId: number) => {
    const index = alreadyInDropIds.findIndex(
      (id) => Number(id) === collectionId
    );
    setRemoveCollectionLoading(
      removeCollectionLoading.map((element, i) =>
        i === index ? true : element
      )
    );
    try {
      setCollectionRemoveIndex(index);
      setCollectionToRemove(collectionId);
    } catch (err: any) {
      console.error(err.message);
    }
    setRemoveCollectionLoading(
      removeCollectionLoading.map((element, i) =>
        i === index ? false : element
      )
    );
  };

  const removeCollectionWrite = async () => {
    setRemoveCollectionLoading(
      removeCollectionLoading.map((element, i) =>
        i === collectionRemoveIndex ? true : element
      )
    );
    try {
      let tx = await removeCollectionWriteAsync?.();
      await waitForTransaction({
        hash: tx?.hash!,
        async onSpeedUp(newTransaction) {
          await newTransaction.wait();
          tx!.hash = newTransaction.hash as any;
        },
      });
      const newDrops = await getAllDrops(address);
      const newDropsUpdated = await getAllDropsUpdated(address);
      setCollectionToRemove(0);
      dispatch(
        setAllDropsRedux([
          ...(newDrops.data.dropCreateds || []),
          ...(newDropsUpdated.data.updatedChromadinDropDropCreateds || []),
        ])
      );
      dispatch(
        setSuccessModal({
          actionOpen: true,
          actionMedia: dropValues.image,
          actionLink: "",
          actionMessage:
            "Collection Removed! Your collection has been removed from this drop and is no longer live on the market.",
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
    setRemoveCollectionLoading(
      removeCollectionLoading.map((element, i) =>
        i === collectionRemoveIndex ? false : element
      )
    );
  };

  useEffect(() => {
    if (removeCollectionIsSuccess) {
      removeCollectionWrite();
    }
  }, [removeCollectionIsSuccess]);

  useEffect(() => {
    if (isSuccess) {
      addDropWrite();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (addIsSuccess) {
      addMoreWrite();
    }
  }, [addIsSuccess]);

  useEffect(() => {
    if (address && dropSwitcher === "add") {
      getAvailableCollections();
    }
  }, [dropSwitcher]);

  useEffect(() => {
    setRemoveCollectionLoading((prevLoading) => {
      const newLoading = [...prevLoading];
      if (chosenCollections.length < newLoading.length) {
        newLoading.splice(chosenCollections.length);
      } else if (chosenCollections.length > newLoading.length) {
        newLoading.push(
          ...Array(chosenCollections.length - newLoading.length).fill(false)
        );
      }
      return newLoading;
    });
  }, [chosenCollections]);

  return {
    addDropLoading,
    addDrop,
    handleDropTitle,
    availableCollectionIds,
    chosenCollections,
    setChosenCollections,
    open,
    setOpen,
    imageLoading,
    setImageLoading,
    addMore,
    alreadyInDrop,
    deleteDrop,
    deleteDropLoading,
    removeCollectionFromDrop,
    removeCollectionLoading,
    alreadyInDropIds,
  };
};

export default useAddDrop;
