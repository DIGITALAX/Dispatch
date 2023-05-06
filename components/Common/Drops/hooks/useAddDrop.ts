import getAllCollections from "@/graphql/subgraph/queries/getAllCollections";
import getAllDrops from "@/graphql/subgraph/queries/getAllDrops";
import { CHROMADIN_DROP_CONTRACT, MUMBAI_DROP } from "@/lib/constants";
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

const useAddDrop = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const dropValues = useSelector(
    (state: RootState) => state.app.dropDetailsReducer
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
  const [addArgs, setAddArgs] = useState<[BigNumber, BigNumber] | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const [chosenCollections, setChosenCollections] = useState<string[]>([]);
  const [alreadyInDrop, setAlreadyInDrop] = useState<string[]>([]);

  const { config, isSuccess } = usePrepareContractWrite({
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
    args: dropArgs,
  });

  const { writeAsync } = useContractWrite(config);

  const { config: addConfig, isSuccess: addIsSuccess } =
    usePrepareContractWrite({
      address: CHROMADIN_DROP_CONTRACT,
      abi: [
        {
          inputs: [
            { internalType: "uint256", name: "_dropId", type: "uint256" },
            { internalType: "uint256", name: "_collectionId", type: "uint256" },
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

  const addDrop = async (): Promise<void> => {
    if (
      !dropValues.image ||
      !dropValues.title ||
      chosenCollections?.length < 1
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
      const tx = await writeAsync?.();
      await tx?.wait();
      dispatch(
        setSuccessModal({
          actionOpen: true,
          actionMedia: dropValues.image,
          actionLink: `http://www.chromadin.xyz/#collect?option=history?search=${dropValues.title}`,
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
      })
    );
  };

  const getAvailableCollections = async (): Promise<void> => {
    try {
      const drops = await getAllDrops(address);
      const colls = await getAllCollections(address);

      const dropIds = drops.data.dropCreateds.flatMap(
        (d: any) => d.collectionIds
      );
      setAvailableCollectionIds(
        colls?.data?.collectionMinteds
          .filter((c: any) => !dropIds.includes(c.collectionId))
          .map((c: any) => c.name)
      );
      setChosenCollections(
        allCollections
          .filter((cd) =>
            (dropValues.collectionIds as any).includes(cd.collectionId)
          )
          .map((cd) => cd.name)
      );
      setAlreadyInDrop(
        allCollections
          .filter((cd) =>
            (dropValues.collectionIds as any).includes(cd.collectionId)
          )
          .map((cd) => cd.name)
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const addMore = async () => {
    try {
      if (chosenCollections?.length === alreadyInDrop?.length) {
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
          Number(
            allCollections.find((collection) => {
              return (
                collection.name ===
                chosenCollections[chosenCollections?.length - 1]
              );
            })?.collectionId
          ) as any,
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
      const tx = await writeAddAsync?.();
      await tx?.wait();
      const newDrops = await getAllDrops(address);
      dispatch(setAllDropsRedux(newDrops.data.dropCreateds));
      dispatch(
        setSuccessModal({
          actionOpen: true,
          actionMedia: dropValues.image,
          actionLink: `http://www.chromadin.xyz/#collect?option=history?search=${dropValues.title}`,
          actionMessage: "Collection Added! You can view your live drop here:",
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
    setAddDropLoading(false);
  };

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
  };
};

export default useAddDrop;
