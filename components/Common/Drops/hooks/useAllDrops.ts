import getAllDrops from "@/graphql/subgraph/queries/getAllDrops";
import { setAllDropsRedux } from "@/redux/reducers/allDropsSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import collectionGetter from "@/lib/helpers/collectionGetter";
import { setAllCollectionsRedux } from "@/redux/reducers/allCollectionsSlice";
import getAllCollections from "@/graphql/subgraph/queries/getAllCollections";

const useAllDrops = () => {
  const dispatch = useDispatch();
  const successModal = useSelector(
    (state: RootState) => state.app.successModalReducer
  );
  const { address } = useAccount();
  const [allDrops, setAllDrops] = useState<any[]>([]);
  const allDropsRedux = useSelector(
    (state: RootState) => state.app.allDropsReducer.value
  );
  const [dropsLoading, setDropsLoading] = useState<boolean>(false);

  const getDropsAll = async (): Promise<void> => {
    setDropsLoading(true);
    try {
      const data = await getAllDrops({
        creator: address,
      });
      const colls = await getAllCollections({
        owner: address,
      });
      const drops = await Promise.all(
        data.data.dropCreateds.map(async (drop: any) => {
          const json = await fetchIPFSJSON(
            (drop.dropURI as any)?.split("ipfs://")[1].replace(/"/g, "").trim()
          );

          return {
            ...drop,
            uri: json,
          };
        })
      );
      const collections = await collectionGetter(colls, drops);
      dispatch(setAllCollectionsRedux(collections ? collections : []));
      setAllDrops(drops);
      dispatch(setAllDropsRedux(drops));
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
      getDropsAll();
    }
  }, [successModal.open]);

  return { allDrops, dropsLoading };
};

export default useAllDrops;
