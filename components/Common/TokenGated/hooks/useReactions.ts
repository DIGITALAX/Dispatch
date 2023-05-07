import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import addReaction from "@/graphql/lens/mutations/react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useSignTypedData,
} from "wagmi";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "@/lib/constants";
import LensHubProxy from "../../../../abis/LensHubProxy.json";
import handleIndexCheck from "@/lib/helpers/handleIndexCheck";
import { splitSignature } from "ethers/lib/utils.js";
import broadcast from "@/graphql/lens/mutations/broadcast";
import { omit } from "lodash";
import { mirror, mirrorDispatcher } from "@/graphql/lens/mutations/mirror";
import checkDispatcher from "@/lib/helpers/checkDispatcher";
import collect from "@/graphql/lens/mutations/collect";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { ApprovedAllowanceAmount } from "@/components/Home/types/lens.types";
import {
  getPublication,
  getPublicationAuth,
} from "@/graphql/lens/queries/getPublication";
import checkApproved from "@/lib/helpers/checkApproved";
import { setPostCollectValues } from "@/redux/reducers/postCollectSlice";
import { setPurchase } from "@/redux/reducers/purchaseSlice";
import { setModal } from "@/redux/reducers/modalSlice";
import { waitForTransaction } from "@wagmi/core";
import pollUntilIndexed from "@/graphql/lens/queries/checkIndexed";

const useReactions = () => {
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const feedDispatch = useSelector(
    (state: RootState) => state.app.feedReducer.value
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const purchase = useSelector((state: RootState) => state.app.purchaseReducer);

  const [mirrorArgs, setMirrorArgs] = useState<any>();
  const [collectArgs, setCollectArgs] = useState<any>();
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const [collectInfoLoading, setCollectInfoLoading] = useState<boolean>(false);
  const [mirrorFeedLoading, setMirrorFeedLoading] = useState<boolean[]>(
    Array.from({ length: feedDispatch?.length }, () => false)
  );
  const [reactFeedLoading, setReactFeedLoading] = useState<boolean[]>(
    Array.from({ length: feedDispatch?.length }, () => false)
  );
  const [collectFeedLoading, setCollectFeedLoading] = useState<boolean[]>(
    Array.from({ length: feedDispatch?.length }, () => false)
  );
  const [mirrorTimelineLoading, setMirrorTimelineLoading] = useState<boolean[]>(
    Array.from({ length: feedDispatch?.length }, () => false)
  );
  const [reactTimelineLoading, setReactTimelineLoading] = useState<boolean[]>(
    Array.from({ length: feedDispatch?.length }, () => false)
  );
  const [collectTimelineLoading, setCollectTimelineLoading] = useState<
    boolean[]
  >(Array.from({ length: feedDispatch?.length }, () => false));
  const [mirrorIndex, setMirrorIndex] = useState<number>();
  const [collectIndex, setCollectIndex] = useState<number>();
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MATIC,
    abi: LensHubProxy,
    functionName: "mirrorWithSig",
    enabled: Boolean(mirrorArgs),
    args: [mirrorArgs],
  });

  const { writeAsync } = useContractWrite(config);

  const { config: collectConfig, isSuccess: isSuccessCollect } =
    usePrepareContractWrite({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "collectWithSig",
      enabled: Boolean(collectArgs),
      args: [collectArgs],
    });
  const { writeAsync: collectWriteAsync } = useContractWrite(collectConfig);

  const reactPost = async (id: string): Promise<void> => {
    const index = feedDispatch?.findIndex((feed) => feed.id === id);

    setReactFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = true;
      return updatedArray;
    });

    try {
      await addReaction({
        profileId: profileId,
        reaction: "UPVOTE",
        publicationId: feedDispatch[index].id,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setReactFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = false;
      return updatedArray;
    });

    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Successfully Indexed",
      })
    );
    setTimeout(() => {
      dispatch(
        setIndexModal({
          actionValue: false,
          actionMessage: undefined,
        })
      );
    }, 4000);
  };

  const mirrorPost = async (id: string): Promise<void> => {
    const index = feedDispatch.findIndex((feed) => feed.id === id);
    setMirrorIndex(index);

    setMirrorFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = true;
      return updatedArray;
    });

    let mirrorPost: any;
    try {
      if (dispatcher) {
        mirrorPost = await mirrorDispatcher({
          profileId: profileId,
          publicationId: feedDispatch[index].id,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Indexing Interaction",
          })
        );
        setTimeout(async () => {
          await handleIndexCheck(
            mirrorPost?.data?.createMirrorViaDispatcher?.txHash,
            dispatch,
            true
          );
        }, 7000);
      } else {
        mirrorPost = await mirror({
          profileId: profileId,
          publicationId: feedDispatch[index].id,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });

        const typedData: any = mirrorPost.data.createMirrorTypedData.typedData;

        const signature: any = await signTypedDataAsync({
          domain: omit(typedData?.domain, ["__typename"]),
          types: omit(typedData?.types, ["__typename"]) as any,
          value: omit(typedData?.value, ["__typename"]) as any,
        });

        const broadcastResult: any = await broadcast({
          id: mirrorPost?.data?.createMirrorTypedData?.id,
          signature,
        });

        if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
          const { v, r, s } = splitSignature(signature);
          const mirrorArgs = {
            profileId: typedData.value.profileId,
            profileIdPointed: typedData.value.profileIdPointed,
            pubIdPointed: typedData.value.pubIdPointed,
            referenceModuleData: typedData.value.referenceModuleData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          setMirrorArgs(mirrorArgs);
        } else {
          dispatch(
            setIndexModal({
              actionValue: true,
              actionMessage: "Indexing Interaction",
            })
          );
          setTimeout(async () => {
            await handleIndexCheck(
              broadcastResult?.data?.broadcast?.txHash,
              dispatch,
              true
            );
          }, 7000);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMirrorFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = false;
      return updatedArray;
    });
  };

  const mirrorWrite = async (): Promise<void> => {
    setMirrorFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[mirrorIndex!] = true;
      return updatedArray;
    });
    try {
      const tx = await writeAsync?.();
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Indexing Interaction",
        })
      );
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      await handleIndexCheck(res?.transactionHash, dispatch, true);
    } catch (err: any) {
      console.error(err.message);
    }
    setMirrorFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[mirrorIndex!] = false;
      return updatedArray;
    });
  };

  const collectPost = async (id: string): Promise<void> => {
    const index = feedDispatch.findIndex((feed) => feed.id === id);
    setCollectIndex(index);
    setCollectFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = true;
      return updatedArray;
    });

    try {
      const collectPost = await collect({
        publicationId: feedDispatch[index].id,
      });
      const typedData: any = collectPost.data.createCollectTypedData.typedData;
      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const broadcastResult: any = await broadcast({
        id: collectPost?.data?.createCollectTypedData?.id,
        signature,
      });

      if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
        const { v, r, s } = splitSignature(signature);
        const collectArgs = {
          collector: address,
          profileId: typedData.value.profileId,
          pubId: typedData.value.pubId,
          data: typedData.value.data,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        };
        setCollectArgs(collectArgs);
      } else {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Indexing Interaction",
          })
        );
        setTimeout(async () => {
          await handleIndexCheck(
            broadcastResult?.data?.broadcast?.txHash,
            dispatch,
            false
          );
        }, 7000);
      }
    } catch (err: any) {
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Insufficient Balance to Collect.",
          })
        );
      }
      console.error(err.message);
    }

    setCollectFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = false;
      return updatedArray;
    });
  };

  const collectWrite = async (): Promise<void> => {
    setCollectFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[collectIndex!] = true;
      return updatedArray;
    });
    try {
      const tx = await collectWriteAsync?.();
      dispatch(
        setPurchase({
          actionOpen: false,
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
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      await handleIndexCheck(res?.transactionHash, dispatch, false);
    } catch (err: any) {
      console.error(err.message);
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Insufficient Balance to Collect.",
          })
        );
      }
    }
    setCollectFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[collectIndex!] = false;
      return updatedArray;
    });
  };

  const commentPost = async (): Promise<void> => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      mirrorWrite();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessCollect) {
      collectWrite();
    }
  }, [isSuccessCollect]);

  useEffect(() => {
    checkDispatcher(dispatch, profileId);
  }, [profileId]);

  const getCollectInfo = async (): Promise<void> => {
    setCollectInfoLoading(true);
    try {
      let pubData: any;
      if (profileId) {
        const { data } = await getPublicationAuth({
          publicationId: purchase.id,
        });
        pubData = data;
      } else {
        const { data } = await getPublication({
          publicationId: purchase.id,
        });
        pubData = data;
      }
      const collectModule = pubData?.publication?.collectModule;

      const approvalData: ApprovedAllowanceAmount | void = await checkApproved(
        collectModule?.amount?.asset?.address,
        collectModule?.type,
        null,
        null,
        collectModule?.amount?.value,
        dispatch,
        address,
        profileId
      );
      const isApproved = parseInt(approvalData?.allowance as string, 16);
      dispatch(
        setPostCollectValues({
          actionType: collectModule?.type,
          actionLimit: collectModule?.collectLimit,
          actionRecipient: collectModule?.recipient,
          actionReferralFee: collectModule?.referralFee,
          actionEndTime: collectModule?.endTimestamp,
          actionValue: collectModule?.value,
          actionFollowerOnly: collectModule?.followerOnly,
          actionAmount: {
            asset: {
              address: collectModule?.amount?.asset?.address,
              decimals: collectModule?.amount?.asset?.decimals,
              name: collectModule?.amount?.asset?.name,
              symbol: collectModule?.amount?.asset?.symbol,
            },
            value: collectModule?.amount?.value,
          },
          actionCanCollect: pubData?.publication?.hasCollectedByMe,
          actionApproved:
            collectModule?.type === "FreeCollectModule" ||
            isApproved > collectModule?.amount?.value
              ? true
              : false,
          actionTotalCollects:
            pubData?.publication?.stats?.totalAmountOfCollects,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectInfoLoading(false);
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
      await getCollectInfo();
    } catch (err: any) {
      setApprovalLoading(false);
      console.error(err.message);
    }
  };

  const approveCurrency = async (): Promise<void> => {
    setApprovalLoading(true);
    try {
      await callApprovalSign();
    } catch (err: any) {
      console.error(err.message);
    }
    setApprovalLoading(false);
  };

  useEffect(() => {
    if (purchase.open) {
      getCollectInfo();
    }
  }, [purchase.open]);

  return {
    collectPost,
    mirrorPost,
    reactPost,
    commentPost,
    authStatus,
    profileId,
    mirrorFeedLoading,
    reactFeedLoading,
    collectFeedLoading,
    approvalLoading,
    collectInfoLoading,
    approveCurrency,
    mirrorTimelineLoading,
    reactTimelineLoading,
    collectTimelineLoading,
  };
};

export default useReactions;
