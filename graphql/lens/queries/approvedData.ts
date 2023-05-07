import { apolloClient } from "@/lib/lens/client";
import { gql } from "@apollo/client";

export const APPROVE_DATA = `query GenerateModuleCurrencyApprovalData($request: GenerateModuleCurrencyApprovalDataRequest!) {
    generateModuleCurrencyApprovalData(request: $request) {
      to
      from
      data
    }
  }`;

const approvedData = (request: any) => {
  return apolloClient.query({
    query: gql(APPROVE_DATA),
    variables: {
      request: request,
    },
    fetchPolicy: "network-only",
  });
};

export default approvedData;
