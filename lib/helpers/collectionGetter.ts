import { Collection } from "@/components/Common/Collections/types/collections.types";
import fetchIPFSJSON from "./fetchIPFSJSON";
import { INFURA_GATEWAY } from "../constants";

const collectionGetter = async (
  colls: any,
  drops: any,
  decrypted?: boolean,
  updated?: boolean
): Promise<any> => {
  try {
    if (updated) {
      if (
        !colls?.data?.updatedChromadinCollectionCollectionMinteds ||
        colls?.data?.updatedChromadinCollectionCollectionMinteds < 1
      ) {
        return;
      }
    } else {
      if (
        !colls?.data?.collectionMinteds ||
        colls?.data?.collectionMinteds < 1
      ) {
        return;
      }
    }

    const collections = await Promise.all(
      (updated
        ? colls?.data?.updatedChromadinCollectionCollectionMinteds
        : colls?.data?.collectionMinteds
      ).map(async (collection: Collection, index: number) => {
        let dropjson: any;
        const json = await fetchIPFSJSON(
          (collection.uri as any)?.includes("ipfs://")
            ? (collection.uri as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            : (collection.uri as any)?.trim()
        );

        if (!decrypted) {
          let collectionDrops;

          collectionDrops = (
            updated
              ? drops.data.updatedChromadinDropDropCreateds
              : drops.data.dropCreateds
          )
            ?.filter((drop: any) =>
              drop.collectionIds.includes(collection.collectionId)
            )
            ?.sort((a: any, b: any) => b.dropId - a.dropId);

          if (collectionDrops?.length > 0) {
            dropjson = await fetchIPFSJSON(
              collectionDrops[0]?.dropURI?.includes("ipfs://")
                ? collectionDrops[0]?.dropURI
                    ?.split("ipfs://")[1]
                    ?.replace(/"/g, "")
                    ?.trim()
                : collectionDrops[0]?.dropURI?.trim()
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
          };
        } else {
          return {
            ...collection,
            uri: json.json,
            drop: {},
            fileType: json.type,
          };
        }
      })
    );

    return collections;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default collectionGetter;
