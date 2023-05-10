import { apolloClient, authClient } from "@/lib/lens/client";
import { gql } from "@apollo/client";

const HAS_REACTED = `
query Publications($publicationsRequest: PublicationsQueryRequest!, $reactionRequest: ReactionFieldResolverRequest) {
  publications(request: $publicationsRequest) {
    items {
      __typename 
      ... on Post {
        reaction(request: $reactionRequest)
      }
      ... on Comment {
        reaction(request: $reactionRequest)
      }
      ... on Mirror {
        reaction(request: $reactionRequest)
      }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}
`;

const HAS_REACTED_FEED = `query Feed($feedRequest: FeedRequest!, $reactionRequest: ReactionFieldResolverRequest) {
  feed(request: $feedRequest) {
    items {
      root {
        ... on Post {
          reaction(request: $reactionRequest)
        }
        ... on Comment {
          reaction(request: $reactionRequest)
        }
      }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}
`;

export const hasReactedPost = (
  publicationsRequest: any,
  reactionRequest: any
) => {
  return authClient.query({
    query: gql(HAS_REACTED),
    variables: {
      publicationsRequest,
      reactionRequest,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
};

export const hasReactedFeed = (feedRequest: any, reactionRequest: any) => {
  return apolloClient.query({
    query: gql(HAS_REACTED_FEED),
    variables: {
      feedRequest,
      reactionRequest,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
};
