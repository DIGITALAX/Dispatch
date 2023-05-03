import { FetchResult, gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const DROPS = `
  query {
    dropCreateds(orderDirection: desc, where: $where) {
      dropId
      dropURI
      creator
      collectionIds
    }
  }
`;

const getAllDrops = async (where: any): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(DROPS),
    variables: {
      where,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all"
  });
};

export default getAllDrops;
