import {
  ApprovedAllowanceAmount,
  Profile,
} from "@/components/Home/types/lens.types";
import broadcast from "@/graphql/lens/mutations/broadcast";
import getOneProfile from "@/graphql/lens/queries/getProfile";
import checkApproved from "@/lib/helpers/checkApproved";
import handleIndexCheck from "@/lib/helpers/handleIndexCheck";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { RootState } from "@/redux/store";
import { splitSignature } from "ethers/lib/utils.js";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useSignTypedData,
} from "wagmi";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "@/lib/constants";
import LensHubProxy from "./../../../../abis/LensHubProxy.json";
import { setLensProfile } from "@/redux/reducers/lensProfileSlice";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { setModal } from "@/redux/reducers/modalSlice";
import { setFollowerOnly } from "@/redux/reducers/followerOnlySlice";
import { waitForTransaction } from "@wagmi/core";
import pollUntilIndexed from "@/graphql/lens/queries/checkIndexed";
import createFollowTypedData from "@/graphql/lens/queries/follow";
import createFollowModule from "@/lib/helpers/createFollowModule";
import { FollowArgs } from "../types/allPosts.types";

const useFollowers = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [followArgs, setFollowArgs] = useState<any>();
  const followerId = useSelector(
    (state: RootState) => state.app.followerOnlyReducer
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const [approved, setApproved] = useState<boolean>(false);
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const { signTypedDataAsync } = useSignTypedData();

  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MATIC,
    abi: LensHubProxy,
    functionName: "followWithSig",
    enabled: Boolean(followArgs),
    args: [followArgs],
  });

  const { writeAsync } = useContractWrite(config);

  const getProfile = async (): Promise<void> => {
    try {
      const prof = await getOneProfile({
        profileId: followerId?.followerId,
      });
      setProfile(prof?.data?.profile);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const approvedFollow = async (): Promise<void> => {
    const approvalData: ApprovedAllowanceAmount | void = await checkApproved(
      (profile?.followModule as any)?.amount?.asset?.address,
      null,
      (profile?.followModule as any)?.type,
      null,
      (profile?.followModule as any)?.amount?.value,
      dispatch,
      address,
      profileId
    );
    const isApproved = parseInt(approvalData?.allowance as string, 16);
    setApproved(
      isApproved > (profile?.followModule as any)?.amount?.value ? true : false
    );
  };

  const { config: approvalConfig } = usePrepareSendTransaction({
    request: {
      to: approvalArgs?.to as string,
      from: approvalArgs?.from as string,
      data: approvalArgs?.data as string,
    },
    // enabled: Boolean(approvalSendEnabled),
  });

  const { sendTransactionAsync, isSuccess: approvalSuccess } =
    useSendTransaction(approvalConfig);

  const callApprovalSign = async (): Promise<void> => {
    try {
      const tx = await sendTransactionAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      await pollUntilIndexed(res?.transactionHash as string, false);
      await approvedFollow();
    } catch (err: any) {
      setFollowLoading(false);
      console.error(err.message);
    }
  };

  const approveCurrency = async (): Promise<void> => {
    setFollowLoading(true);
    try {
      await callApprovalSign();
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowLoading(false);
  };

  const followProfile = async (): Promise<void> => {
    setFollowLoading(true);

    const followModule = createFollowModule(
      profile?.followModule?.type as any,
      (profile?.followModule as any)?.amount?.value,
      (profile?.followModule as any)?.amount?.asset?.address,
      profileId
    );

    try {
      const response = await createFollowTypedData({
        follow: [
          {
            profile: profile?.id,
            followModule,
          },
        ],
      });

      const typedData: any = response?.data?.createFollowTypedData?.typedData;

      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const broadcastResult: any = await broadcast({
        id: response?.data?.createFollowTypedData?.id,
        signature,
      });

      if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
        const { v, r, s } = splitSignature(signature);
        const followArgs: FollowArgs = {
          follower: address as string,
          profileIds: typedData?.value?.profileIds,
          datas: typedData?.value?.datas,
          sig: {
            v,
            r,
            s,
            deadline: typedData?.value?.deadline,
          },
        };
        setFollowArgs(followArgs);
      } else {
        clearFollow();
        setFollowLoading(false);
        setTimeout(async () => {
          await handleIndexCheck(
            broadcastResult?.data?.broadcast?.txHash,
            dispatch,
            false
          );
          await refetchProfile();
        }, 7000);
      }
    } catch (err: any) {
      setFollowLoading(false);
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Insufficient Balance to Follow.",
          })
        );
      }
      console.error(err.message);
    }
  };

  const followWrite = async (): Promise<void> => {
    setFollowLoading(true);
    try {
      const tx = await writeAsync?.();
      clearFollow();
      const res = await tx?.wait();
      await handleIndexCheck(res?.transactionHash, dispatch, false);
      await refetchProfile();
    } catch (err: any) {
      console.error(err.message);
      dispatch(setIndexModal("Unsuccessful. Please Try Again."));
    }
    setFollowLoading(false);
  };

  const refetchProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile(address!);
      dispatch(setLensProfile(profile?.data?.defaultProfile));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const clearFollow = () => {
    dispatch(
      setFollowerOnly({
        actionOpen: false,
        actionFollowerId: "",
        actionId: "",
        actionIndex: undefined,
      })
    );
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
  };

  useEffect(() => {
    if (isSuccess) {
      followWrite();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (followerId.open) {
      getProfile();
      if (profile?.followModule?.type === "FeeFollowModule") {
        approvedFollow();
      }
    }
  }, [followerId.open]);

  return { profile, followProfile, followLoading, approved, approveCurrency };
};

export default useFollowers;
