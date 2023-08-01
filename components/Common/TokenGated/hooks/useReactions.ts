import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import addReaction from "@/graphql/lens/mutations/react";
import { useAccount } from "wagmi";
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
import pollUntilIndexed from "@/graphql/lens/queries/checkIndexed";
import { setFeedReactId } from "@/redux/reducers/feedReactIdSlice";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";

const useReactions = () => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
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
  const timelineDispatch = useSelector(
    (state: RootState) => state.app.timelineReducer.value
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const purchase = useSelector((state: RootState) => state.app.purchaseReducer);
  const feedSwitch = useSelector(
    (state: RootState) => state.app.feedSwitchReducer.value
  );
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const [collectInfoLoading, setCollectInfoLoading] = useState<boolean>(false);
  const [mirrorFeedLoading, setMirrorFeedLoading] = useState<boolean[]>(
    Array.from({ length: feedDispatch.length }, () => false)
  );
  const [reactFeedLoading, setReactFeedLoading] = useState<boolean[]>(
    Array.from({ length: feedDispatch.length }, () => false)
  );
  const [collectFeedLoading, setCollectFeedLoading] = useState<boolean[]>(
    Array.from({ length: feedDispatch.length }, () => false)
  );
  const [mirrorTimelineLoading, setMirrorTimelineLoading] = useState<boolean[]>(
    Array.from({ length: timelineDispatch.length }, () => false)
  );
  const [reactTimelineLoading, setReactTimelineLoading] = useState<boolean[]>(
    Array.from({ length: timelineDispatch.length }, () => false)
  );
  const [collectTimelineLoading, setCollectTimelineLoading] = useState<
    boolean[]
  >(Array.from({ length: timelineDispatch.length }, () => false));
  const dispatch = useDispatch();
  const { address } = useAccount();

  const reactPost = async (
    id: string,
    loader?: (e: any) => void,
    inputIndex?: number,
    mirrorId?: string
  ): Promise<void> => {
    let index: number;
    if (inputIndex === undefined || inputIndex === null) {
      index = (feedSwitch ? feedDispatch : timelineDispatch)?.findIndex(
        (feed) => feed.id === (mirrorId !== undefined ? mirrorId : id)
      );
      (feedSwitch ? setReactFeedLoading : setReactTimelineLoading)((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = true;
        return updatedArray;
      });
    } else {
      loader!((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[inputIndex] = true;
        return updatedArray as boolean[];
      });
    }

    try {
      await addReaction({
        profileId: profileId,
        reaction: "UPVOTE",
        publicationId: id,
      });
      dispatch(
        setFeedReactId({
          actionValue: id,
          actionType: 0,
        })
      );
    } catch (err: any) {
      if (
        err.message.includes(
          "You have already reacted to this publication with action UPVOTE"
        )
      ) {
        dispatch(
          setFeedReactId({
            actionValue: id,
            actionType: 0,
          })
        );
      } else {
        console.error(err.message);
      }
    }
    if (inputIndex === undefined || inputIndex === null) {
      (feedSwitch ? setReactFeedLoading : setReactTimelineLoading)((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    } else {
      loader!((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[inputIndex] = false;
        return updatedArray as boolean[];
      });
    }

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

  const mirrorPost = async (
    id: string,
    loader?: (e: any) => void,
    inputIndex?: number,
    mirrorId?: string
  ): Promise<void> => {
    let index: number;
    if (inputIndex === undefined || inputIndex === null) {
      index = (feedSwitch ? feedDispatch : timelineDispatch).findIndex(
        (feed) => feed.id === (mirrorId !== undefined ? mirrorId : id)
      );

      (feedSwitch ? setMirrorFeedLoading : setMirrorTimelineLoading)((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = true;
        return updatedArray;
      });
    } else {
      loader!((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[inputIndex] = true;
        return updatedArray as boolean[];
      });
    }

    let mirrorPost: any;
    try {
      if (dispatcher) {
        mirrorPost = await mirrorDispatcher({
          profileId: profileId,
          publicationId: id,
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
          publicationId: id,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });

        const typedData: any = mirrorPost.data.createMirrorTypedData.typedData;

        const clientWallet = createWalletClient({
          chain: polygon,
          transport: custom((window as any).ethereum),
        });
        const signature: any = await clientWallet.signTypedData({
          domain: omit(typedData?.domain, ["__typename"]),
          types: omit(typedData?.types, ["__typename"]),
          primaryType: "MirrorWithSig",
          message: omit(typedData?.value, ["__typename"]),
          account: address as `0x${string}`,
        });

        const broadcastResult: any = await broadcast({
          id: mirrorPost?.data?.createMirrorTypedData?.id,
          signature,
        });

        if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
          const { v, r, s } = splitSignature(signature);
          const { request } = await publicClient.simulateContract({
            address: LENS_HUB_PROXY_ADDRESS_MATIC,
            abi: LensHubProxy,
            functionName: "mirrorWithSig",
            args: [
              {
                profileId: typedData.value.profileId,
                profileIdPointed: typedData.value.profileIdPointed,
                pubIdPointed: typedData.value.pubIdPointed,
                referenceModuleData: typedData.value.referenceModuleData,
                referenceModule: typedData.value.referenceModule,
                referenceModuleInitData:
                  typedData.value.referenceModuleInitData,
                sig: {
                  v,
                  r,
                  s,
                  deadline: typedData.value.deadline,
                },
              },
            ],
            account: address,
          });

          dispatch(
            setFeedReactId({
              actionValue: id,
              actionType: 1,
            })
          );
          const res = await clientWallet.writeContract(request);
          await publicClient.waitForTransactionReceipt({ hash: res });
          dispatch(
            setIndexModal({
              actionValue: true,
              actionMessage: "Indexing Interaction",
            })
          );
          await handleIndexCheck(res, dispatch, true);
        } else {
          dispatch(
            setFeedReactId({
              actionValue: id,
              actionType: 1,
            })
          );
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
      if (err.message.includes("data availability publication")) {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Momoka won't let you interact ATM.",
          })
        );
        setTimeout(() => {
          dispatch(
            setIndexModal({
              actionValue: false,
              actionMessage: "",
            })
          );
        }, 4000);
      }
      console.error(err.message);
    }
    if (inputIndex === undefined || inputIndex === null) {
      (feedSwitch ? setMirrorFeedLoading : setMirrorTimelineLoading)((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    } else {
      loader!((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[inputIndex] = false;
        return updatedArray as boolean[];
      });
    }
  };

  const collectPost = async (
    id: string,
    loader?: (e: any) => void,
    inputIndex?: number,
    mirrorId?: string
  ): Promise<void> => {
    let index: number;
    if (inputIndex === undefined || inputIndex === null) {
      index = (feedSwitch ? feedDispatch : timelineDispatch).findIndex(
        (feed) => feed.id === (mirrorId !== undefined ? mirrorId : id)
      );
      (feedSwitch ? setCollectFeedLoading : setCollectTimelineLoading)(
        (prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = true;
          return updatedArray;
        }
      );
    } else {
      loader!((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[inputIndex] = true;
        return updatedArray as boolean[];
      });
    }

    try {
      const collectPost = await collect({
        publicationId: id,
      });
      const typedData: any = collectPost.data.createCollectTypedData.typedData;
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      const signature: any = await clientWallet.signTypedData({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]),
        primaryType: "CollectWithSig",
        message: omit(typedData?.value, ["__typename"]),
        account: address as `0x${string}`,
      });
      const broadcastResult: any = await broadcast({
        id: collectPost?.data?.createCollectTypedData?.id,
        signature,
      });

      if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
        const { v, r, s } = splitSignature(signature);
        const { request } = await publicClient.simulateContract({
          address: LENS_HUB_PROXY_ADDRESS_MATIC,
          abi: LensHubProxy,
          functionName: "collectWithSig",
          args: [
            {
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
            },
          ],
          account: address,
        });
        dispatch(
          setFeedReactId({
            actionValue: id,
            actionType: 2,
          })
        );
        const res = await clientWallet.writeContract(request);
        await publicClient.waitForTransactionReceipt({ hash: res });
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
        await handleIndexCheck(res, dispatch, false);
      
      } else {
        dispatch(
          setFeedReactId({
            actionValue: id,
            actionType: 2,
          })
        );
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
      if (err.message.includes("data availability publication")) {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Momoka won't let you interact ATM.",
          })
        );
        setTimeout(() => {
          dispatch(
            setIndexModal({
              actionValue: false,
              actionMessage: "",
            })
          );
        }, 4000);
      }
      console.error(err.message);
    }

    if (inputIndex === undefined || inputIndex === null) {
      (feedSwitch ? setCollectFeedLoading : setCollectTimelineLoading)(
        (prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        }
      );
    } else {
      loader!((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[inputIndex] = false;
        return updatedArray as boolean[];
      });
    }
  };

  useEffect(() => {
    checkDispatcher(dispatch, profileId);
  }, [profileId]);

  const getCollectInfo = async (): Promise<void> => {
    setCollectInfoLoading(true);
    try {
      let pubData: any;
      if (profileId) {
        const { data } = await getPublicationAuth(
          {
            publicationId: purchase.id,
          },
          profileId
        );
        pubData = data;
      } else {
        const { data } = await getPublication({
          publicationId: purchase.id,
        });
        pubData = data;
      }
      const collectModule =
        pubData?.publication?.__typename === "Mirror"
          ? pubData?.publication?.mirrorOf?.collectModule
          : pubData?.publication?.collectModule;

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
          actionLimit:
            collectModule?.__typename === "SimpleCollectModuleSettings" ||
            collectModule?.type === "SimpleCollectModule"
              ? collectModule?.simpleCollectLimit
              : collectModule?.collectLimit,
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
          actionCanCollect:
            pubData?.publication?.__typename === "Mirror"
              ? pubData?.publication?.mirrorOf?.hasCollectedByMe
              : pubData?.publication?.hasCollectedByMe,
          actionApproved:
            collectModule?.type === "FreeCollectModule" ||
            isApproved > collectModule?.amount?.value ||
            ((collectModule?.__typename === "SimpleCollectModuleSettings" ||
              collectModule?.type === "SimpleCollectModule") &&
              !collectModule?.amount &&
              !collectModule?.simpleCollectLimit &&
              !collectModule?.endTime)
              ? true
              : false,
          actionTotalCollects:
            pubData?.publication?.__typename === "Mirror"
              ? pubData?.publication?.mirrorOf?.stats?.totalAmountOfCollects
              : pubData?.publication?.stats?.totalAmountOfCollects,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectInfoLoading(false);
  };

  const callApprovalSign = async (): Promise<void> => {
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const res = await clientWallet.sendTransaction({
        to: approvalArgs?.to as `0x${string}`,
        value: BigInt(approvalArgs?.data as string),
        account:approvalArgs?.from as `0x${string}`,
      });
      await publicClient.waitForTransactionReceipt({ hash: res });
      await pollUntilIndexed(res as string, false);
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
