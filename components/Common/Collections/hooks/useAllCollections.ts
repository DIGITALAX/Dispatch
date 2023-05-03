import getAllCollections from "@/graphql/subgraph/queries/getAllCollections";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Collection } from "../types/collections.types";
import getAllDrops from "@/graphql/subgraph/queries/getAllDrops";
import { setAllCollectionsRedux } from "@/redux/reducers/allCollectionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const useAllCollections = () => {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const [allCollections, setAllCollections] = useState<any[]>([]);
  const successModal = useSelector(
    (state: RootState) => state.app.successModalReducer
  );
  const collectionsDispatched = useSelector(
    (state: RootState) => state.app.allCollectionsReducer.value
  );

  const getCollectionsAll = async (): Promise<void> => {
    let dropjson: any;
    try {
      const colls = await getAllCollections({
        owner: address,
      });
      const drops = await getAllDrops({
        creator: address,
      });

      const collections = await Promise.all(
        colls.data.collectionMinteds.map(async (collection: Collection) => {
          const json = await fetchIPFSJSON(
            (collection.uri as any)
              ?.split("ipfs://")[1]
              .replace(/"/g, "")
              .trim()
          );
          if (drops.data.dropCreateds.length > 0) {
            const collectionDrops = drops.data.dropCreateds
              .filter((drop: any) =>
                drop.collectionIds.includes(collection.collectionId)
              )
              .sort((a: any, b: any) => b.dropId - a.dropId);
            dropjson = await fetchIPFSJSON(
              collectionDrops[0]?.dropURI
                ?.split("ipfs://")[1]
                .replace(/"/g, "")
                .trim()
            );
          }

          return {
            ...collection,
            uri: json,
            drop: {
              name: dropjson?.name,
              image: dropjson?.image,
            },
          };
        })
      );
      setAllCollections(collections);
      dispatch(setAllCollectionsRedux(collections));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!collectionsDispatched || collectionsDispatched?.length < 1) {
      getCollectionsAll();
    }
  }, []);

  useEffect(() => {
    if (successModal.message.includes("Collection Minted!")) {
      getCollectionsAll();
    }
  }, [successModal.open]);

  return { allCollections };
};

export default useAllCollections;
