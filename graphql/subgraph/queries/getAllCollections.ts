import { gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const COLLECTIONS = `
  query {
    collectionMinteds(where: $where, orderDirection: desc) {
      name
      collectionId
    }
  }
`;

const getAllCollections = async (where: any): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS),
    variables: {
      where,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 20000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export default getAllCollections;
