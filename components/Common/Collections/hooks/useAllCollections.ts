import getAllCollections from "@/graphql/subgraph/queries/getAllCollections";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import getAllDrops from "@/graphql/subgraph/queries/getAllDrops";
import { setAllCollectionsRedux } from "@/redux/reducers/allCollectionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import collectionGetter from "@/lib/helpers/collectionGetter";

const useAllCollections = () => {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const [allCollections, setAllCollections] = useState<any[]>([]);
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
      const collections = await collectionGetter(
        colls,
        drops,
        colls.data?.collectionMinteds?.length
      );
      setAllCollections(collections ? collections : []);
      dispatch(setAllCollectionsRedux(collections ? collections : []));
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
    if (successModal.message.includes("Collection Minted!")) {
      setTimeout(() => {
        getCollectionsAll();
      }, 5000);
    }
  }, [successModal.open]);

  return { allCollections, collectionsLoading };
};

export default useAllCollections;
