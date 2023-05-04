import { Collection } from "@/components/Common/Collections/types/collections.types";
import fetchIPFSJSON from "./fetchIPFSJSON";

const collectionGetter = async (colls: any, drops: any): Promise<any> => {
  let dropjson: any;
  try {
    const collections = await Promise.all(
      colls.data.collectionMinteds.map(async (collection: Collection) => {
        const json = await fetchIPFSJSON(
          (collection.uri as any)?.split("ipfs://")[1].replace(/"/g, "").trim()
        );

        const collectionDrops = drops.data.dropCreateds
          .filter((drop: any) =>
            drop.collectionIds.includes(collection.collectionId)
          )
          .sort((a: any, b: any) => b.dropId - a.dropId);

        if (collectionDrops.length > 0) {
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

    return collections;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default collectionGetter;
