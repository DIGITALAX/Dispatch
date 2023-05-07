import { apolloClient } from "@/lib/lens/client";
import { gql } from "@apollo/client";

export const HIDE_POST = `mutation HidePublication($request: HidePublicationRequest!) {
    hidePublication(request: $request)
  }`;

const hidePublication = (hidePublicationData: any) => {
  return apolloClient.mutate({
    mutation: gql(HIDE_POST),
    variables: {
      request: hidePublicationData,
    },
  });
};

export default hidePublication;
