import getAllCollections, {
  getAllCollectionsUpdated,
} from "@/graphql/subgraph/queries/getAllCollections";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import getAllDrops, {
  getAllDropsUpdated,
} from "@/graphql/subgraph/queries/getAllDrops";
import { setAllCollectionsRedux } from "@/redux/reducers/allCollectionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import collectionGetter from "@/lib/helpers/collectionGetter";
import { Collection } from "../types/collections.types";

const useAllCollections = () => {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const successModal = useSelector(
    (state: RootState) => state.app.successModalReducer
  );
  const [collectionsLoading, setCollectionsLoading] = useState<boolean>(false);
  const collectionsDispatched = useSelector(
    (state: RootState) => state.app.allCollectionsReducer.value
  );

  const getCollectionsAll = async (): Promise<void> => {
    setCollectionsLoading(true);
    try {
      const colls = await getAllCollections(address);
      const drops = await getAllDrops(address);

      const collsUpdated = await getAllCollectionsUpdated(address);
      const dropsUpdated = await getAllDropsUpdated(address);
      const collections = await collectionGetter(colls, drops);
      const collectionsUpdated = await collectionGetter(
        collsUpdated,
        dropsUpdated,
        false,
        true
      );
      const filteredCols = (collections || [])?.filter(
        (obj: Collection) =>
          obj.collectionId !== "104" && obj.collectionId !== "99"
      );

      dispatch(
        setAllCollectionsRedux(
          filteredCols || collectionsUpdated
            ? [...(filteredCols || []), ...(collectionsUpdated || [])]
            : []
        )
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectionsLoading(false);
  };

  useEffect(() => {
    if (!collectionsDispatched || collectionsDispatched?.length < 1) {
      getCollectionsAll();
    }
  }, []);

  useEffect(() => {
    if (
      successModal.message.includes("Collection Minted!") ||
      successModal.message.includes("Collection Updated!") ||
      successModal.message.includes("Collection Burned!")
    ) {
      setTimeout(() => {
        getCollectionsAll();
      }, 5000);
    }
  }, [successModal.open]);

  return { collectionsLoading };
};

export default useAllCollections;
