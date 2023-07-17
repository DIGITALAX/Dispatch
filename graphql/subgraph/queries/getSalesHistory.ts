import { FetchResult, gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const HISTORY = `
  query($creator: String!) {
    tokensBoughts(where: {creator: $creator} orderBy: blockTimestamp
      orderDirection: desc) {
        uri
        totalPrice
        tokenIds
        name
        buyer
        creator
        transactionHash
        blockTimestamp
        blockNumber
      }
  }
`;

const HISTORY_UPDATED = `
  query($creator: String!) {
    updatedChromadinMarketTokensBoughts(where: {creator: $creator} orderBy: blockTimestamp
      orderDirection: desc) {
        uri
        totalPrice
        tokenIds
        name
        buyer
        creator
        transactionHash
        blockTimestamp
        blockNumber
      }
  }
`;

const getSalesHistory = async (creator: any): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(HISTORY),
    variables: {
      creator: creator,
    },
    fetchPolicy: "no-cache",
  });
};

export const getSalesHistoryUpdated = async (
  creator: any
): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(HISTORY_UPDATED),
    variables: {
      creator: creator,
    },
    fetchPolicy: "no-cache",
  });
};

export default getSalesHistory;
