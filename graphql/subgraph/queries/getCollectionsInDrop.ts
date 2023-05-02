import { gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const COLLECTIONS_IN_DROP = `
  query {
    dropCreateds(orderDirection: desc, where: $where) {
      collectionIds
    }
  }
`;

const getCollectionsInDrop = async (where: any): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_IN_DROP),
    variables: {
      where,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 20000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export default getCollectionsInDrop;
