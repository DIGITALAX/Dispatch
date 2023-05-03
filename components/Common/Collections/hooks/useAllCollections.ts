import getAllCollections from "@/graphql/subgraph/queries/getAllCollections";
import { useState } from "react";
import { useAccount } from "wagmi";

const useAllCollections = () => {
  const { address } = useAccount();
  const [allCollections, setAllCollections] = useState<any[]>([]);

  const getCollectionsAll = async (): Promise<void> => {
    try {
      const colls = await getAllCollections({
        owner: address,
      });
      setAllCollections(colls.data.collectionMinteds);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return { allCollections };
};

export default useAllCollections;
