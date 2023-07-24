import getAllDrops, {
  getAllDropsUpdated,
} from "@/graphql/subgraph/queries/getAllDrops";
import { setAllDropsRedux } from "@/redux/reducers/allDropsSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import collectionGetter from "@/lib/helpers/collectionGetter";
import { setAllCollectionsRedux } from "@/redux/reducers/allCollectionsSlice";
import getAllCollections, {
  getAllCollectionsUpdated,
} from "@/graphql/subgraph/queries/getAllCollections";
import { Collection } from "../../Collections/types/collections.types";

const useAllDrops = () => {
  const dispatch = useDispatch();
  const successModal = useSelector(
    (state: RootState) => state.app.successModalReducer
  );
  const { address } = useAccount();
  const allDropsRedux = useSelector(
    (state: RootState) => state.app.allDropsReducer.value
  );
  const [dropsLoading, setDropsLoading] = useState<boolean>(false);

  const getDropsAll = async (): Promise<void> => {
    setDropsLoading(true);
    try {
      const data = await getAllDrops(address);
      const colls = await getAllCollections(address);
      const dataUpdated = await getAllDropsUpdated(address);
      const collsUpdated = await getAllCollectionsUpdated(address);

      const drops =
        (data?.data?.dropCreateds ||
          dataUpdated.data?.updatedChromadinDropDropCreateds) &&
        (await Promise.all(
          [
            ...(data.data?.dropCreateds || []),
            ...(dataUpdated.data?.updatedChromadinDropDropCreateds || []),
          ]?.map(async (drop: any) => {
            const json = await fetchIPFSJSON(
              (drop.dropURI as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            );

            return {
              ...drop,
              uri: json.json,
              fileType: json.type,
            };
          })
        ));
      const collections = await collectionGetter(colls, data);
      const collectionsUpdated = await collectionGetter(
        collsUpdated,
        dataUpdated,
        false,
        true
      );
      const newCols = collectionsUpdated.filter(
        (obj: Collection) =>
          obj.collectionId !== "104" && obj.collectionId !== "99"
      );

      dispatch(
        setAllCollectionsRedux(
          collections || newCols
            ? [...(collections || []), ...(newCols || [])]
            : []
        )
      );
      dispatch(setAllDropsRedux(drops ? drops : []));
    } catch (err: any) {
      console.error(err.message);
    }
    setDropsLoading(false);
  };

  useEffect(() => {
    if (!allDropsRedux || allDropsRedux?.length < 1) {
      getDropsAll();
    }
  }, []);

  useEffect(() => {
    if (
      successModal.message.includes("Drop Live!") ||
      successModal.message.includes("Collection Added!")
    ) {
      setTimeout(() => {
        getDropsAll();
      }, 5000);
    }
  }, [successModal.open]);

  return { dropsLoading };
};

export default useAllDrops;
