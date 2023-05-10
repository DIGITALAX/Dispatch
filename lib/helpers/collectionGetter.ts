import { Collection } from "@/components/Common/Collections/types/collections.types";
import fetchIPFSJSON from "./fetchIPFSJSON";

const collectionGetter = async (
  colls: any,
  drops: any,
  amount: number
): Promise<any> => {
  try {
    if (
      (!colls?.data?.collectionMinteds || colls?.data?.collectionMinteds < 1) &&
      (!colls?.data?.chromadinCollectionNewCollectionMinteds ||
        colls?.data?.chromadinCollectionNewCollectionMinteds < 1)
    ) {
      return;
    }
    const collections = await Promise.all(
      [
        ...colls?.data?.collectionMinteds,
        ...colls?.data?.chromadinCollectionNewCollectionMinteds,
      ].map(async (collection: Collection, index: number) => {
        let dropjson: any;
        const json = await fetchIPFSJSON(
          (collection.uri as any)?.split("ipfs://")[1].replace(/"/g, "").trim()
        );

        let collectionDrops;

        if (index < amount) {
          collectionDrops = drops.data.dropCreateds;
        } else {
          collectionDrops = drops.data.chromadinDropNewDropCreateds;
        }

        collectionDrops = collectionDrops
          .filter((drop: any) =>
            drop.collectionIds.includes(collection.collectionId)
          )
          .sort((a: any, b: any) => b.dropId - a.dropId);

        if (collectionDrops?.length > 0) {
          dropjson = await fetchIPFSJSON(
            collectionDrops[0]?.dropURI
              ?.split("ipfs://")[1]
              .replace(/"/g, "")
              .trim()
          );
        }

        return {
          ...collection,
          uri: json.json,
          drop: {
            name: dropjson?.json?.name,
            image: dropjson?.json?.image,
          },
          fileType: json.type,
          contractType: index < amount ? "primary" : "secondary",
          collectionIPFS: collection.uri,
          dropIPFS: collectionDrops[0]?.dropURI,
        };
      })
    );

    return collections;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default collectionGetter;
