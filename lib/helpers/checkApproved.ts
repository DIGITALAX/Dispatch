import { ApprovedAllowanceAmount } from "@/components/Home/types/lens.types";
import approvedModuleAllowance from "@/graphql/lens/queries/approvedAllowance";
import approvedData from "@/graphql/lens/queries/approvedData";
import { setApprovalArgs } from "@/redux/reducers/approvalArgsSlice";
import { AnyAction, Dispatch } from "redux";

const checkApproved = async (
  currencyAddress: string,
  collectModule: string | null,
  followModule: string | null,
  referenceModule: string | null,
  value: string,
  dispatch: Dispatch<AnyAction>,
  address: string | undefined,
  profileId: string
): Promise<ApprovedAllowanceAmount | void> => {
  if (!currencyAddress || !address || !profileId) {
    return;
  }
  try {
    const response = await approvedModuleAllowance({
      currencies: [currencyAddress],
      collectModules: collectModule ? [collectModule] : [],
      followModules: followModule ? [followModule] : [],
      referenceModules: referenceModule ? [referenceModule] : [],
    });
    let approvalArgs: any;
    if (collectModule) {
      approvalArgs = await approvedData({
        currency: currencyAddress,
        value: value,
        collectModule: collectModule,
      });
    } else if (followModule) {
      approvalArgs = await approvedData({
        currency: currencyAddress,
        value: value,
        followModule: followModule,
      });
    }
    dispatch(
      setApprovalArgs(approvalArgs?.data?.generateModuleCurrencyApprovalData)
    );
    return response?.data?.approvedModuleAllowanceAmount[0];
  } catch (err: any) {
    console.error(err.message);
  }
};

export default checkApproved;
