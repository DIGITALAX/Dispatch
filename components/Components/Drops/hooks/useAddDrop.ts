import getAllCollections from "@/graphql/subgraph/queries/getAllCollections";
import getAllDrops from "@/graphql/subgraph/queries/getAllDrops";
import getCollectionsInDrop from "@/graphql/subgraph/queries/getCollectionsInDrop";
import { CHROMADIN_DROP_CONTRACT } from "@/lib/constants";
import { setAllDropsRedux } from "@/redux/reducers/allDropsSlice";
import { setDropDetails } from "@/redux/reducers/dropDetailsSlice";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
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
  const auth = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [addDropLoading, setAddDropLoading] = useState<boolean>(false);
  const [availableCollectionIds, setAvailableCollectionIds] = useState<
    string[]
  >([]);
  const [dropArgs, setDropArgs] = useState<
    [readonly BigNumber[], string] | undefined
  >();
  const [open, setOpen] = useState<boolean>(false);
  const [chosenCollections, setChosenCollections] = useState<string[]>([]);

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

  const addDrop = async (): Promise<void> => {
    if (
      !dropValues.image ||
      !dropValues.title ||
      chosenCollections.length < 1
    ) {
      return;
    }
    setAddDropLoading(true);
    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          name: dropValues.title,
          image: dropValues.image,
        }),
      });
      const responseJSON = await response.json();
      setDropArgs([dropValues.collectionIds as any, responseJSON]);
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
        setDropDetails({
          actionTitle: "",
          actionImage: "",
          actionCollectionIds: [],
        })
      );
      const newDrops = await getAllDrops({ creator: address });
      dispatch(setAllDropsRedux(newDrops.data.dropCreateds));
      await getCollectionsInDrop({
        dropId: newDrops.data.dropCreateds[0].dropId,
      });
    } catch (err: any) {
      console.error(err.message);
      dispatch(setIndexModal("Unsuccessful. Please Try Again."));
    }
    setAddDropLoading(false);
  };

  const handleDropTitle = (e: FormEvent): void => {
    dispatch(
      setDropDetails({
        actionTitle: (e.target as HTMLFormElement).value,
        actionImage: dropValues.image,
        actionCollectionIds: dropValues.collectionIds,
      })
    );
  };

  const getAvailableCollections = async (): Promise<void> => {
    try {
      const colls = await getAllCollections({
        owner: address,
      });
      const drops = await getAllDrops({
        creator: address,
      });
      const collIds = colls.data.collectionMinteds.map(
        (c: any) => c.collectionId
      );
      const dropIds = drops.data.dropCreateds.map((d: any) => d.collectionId);
      setAvailableCollectionIds(
        collIds.filter((id: string) => !dropIds.includes(id))
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      addDropWrite();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (address && auth) {
      getAvailableCollections();
    }
  }, []);

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
  };
};

export default useAddDrop;
