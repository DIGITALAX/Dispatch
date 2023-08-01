import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { UseControlsResults } from "../types/video.types";
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
import ReactPlayer from "react-player";
import { setReactId } from "@/redux/reducers/reactIdSlice";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { setVideoSync } from "@/redux/reducers/videoSyncSlice";
import { setSeek } from "@/redux/reducers/seekSecondSlice";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";

const useControls = (): UseControlsResults => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const streamRef = useRef<ReactPlayer>(null);
  const fullVideoRef = useRef<ReactPlayer>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState<number>(1);
  const [volumeOpen, setVolumeOpen] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [collectLoading, setCollectLoading] = useState<boolean>(false);
  const [mirrorLoading, setMirrorLoading] = useState<boolean>(false);
  const [mirrorArgs, setMirrorArgs] = useState<any>();
  const [collectArgs, setCollectArgs] = useState<any>();
  const dispatch = useDispatch();
  const { address } = useAccount();
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const seek = useSelector(
    (state: RootState) => state.app.seekSecondReducer.seek
  );
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const videoSync = useSelector(
    (state: RootState) => state.app.videoSyncReducer
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );

  const handleHeart = () => {
    dispatch(
      setVideoSync({
        actionHeart: true,
        actionDuration: videoSync.duration,
        actionCurrentTime: videoSync.currentTime,
        actionIsPlaying: videoSync.isPlaying,
        actionLikedArray: videoSync.likedArray,
        actionMirroredArray: videoSync.mirroredArray,
        actionCollectedArray: videoSync.collectedArray,
        actionVideosLoading: videoSync.videosLoading,
      })
    );
    setTimeout(() => {
      dispatch(
        setVideoSync({
          actionHeart: false,
          actionDuration: videoSync.duration,
          actionCurrentTime: videoSync.currentTime,
          actionIsPlaying: videoSync.isPlaying,
          actionLikedArray: videoSync.likedArray,
          actionMirroredArray: videoSync.mirroredArray,
          actionCollectedArray: videoSync.collectedArray,
          actionVideosLoading: videoSync.videosLoading,
        })
      );
    }, 3000);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleVolumeChange = (e: FormEvent) => {
    setVolume(parseFloat((e.target as HTMLFormElement).value));
  };

  const likeVideo = async (): Promise<void> => {
    setLikeLoading(true);
    dispatch(setReactId(mainVideo.id));
    if (!profileId && !authStatus) {
      setLikeLoading(false);

      return;
    }
    try {
      await addReaction({
        profileId: profileId,
        reaction: "UPVOTE",
        publicationId: mainVideo.id,
      });
    } catch (err: any) {
      setLikeLoading(false);
      console.error(err.message);
    }
    setLikeLoading(false);
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

  const mirrorVideo = async (): Promise<void> => {
    setMirrorLoading(true);
    dispatch(setReactId(mainVideo.id));

    if (!profileId && !authStatus) {
      setMirrorLoading(false);

      return;
    }
    let mirrorPost: any;
    try {
      if (dispatcher) {
        mirrorPost = await mirrorDispatcher({
          profileId: profileId,
          publicationId: mainVideo.id,
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
          publicationId: mainVideo.id,
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

          const res = await clientWallet.writeContract(request);
          dispatch(
            setIndexModal({
              actionValue: true,
              actionMessage: "Indexing Interaction",
            })
          );
          await publicClient.waitForTransactionReceipt({ hash: res });
          await handleIndexCheck(res, dispatch, true);
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
    setMirrorLoading(false);
  };

  const collectVideo = async (): Promise<void> => {
    setCollectLoading(true);
    dispatch(setReactId(mainVideo.id));

    if (!profileId && !authStatus) {
      setCollectLoading(false);
      return;
    }
    try {
      const collectPost = await collect({
        publicationId: mainVideo.id,
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

        const res = await clientWallet.writeContract(request);
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Indexing Interaction",
          })
        );
        await publicClient.waitForTransactionReceipt({ hash: res });
        await handleIndexCheck(res, dispatch, true);
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
      setCollectLoading(false);
      console.error(err.message);
    }
    setCollectLoading(false);
  };

  useEffect(() => {
    checkDispatcher(dispatch, profileId);
  }, [profileId]);

  const handleSeek = (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => {
    const progressRect = e.currentTarget.getBoundingClientRect();
    const seekPosition = (e.clientX - progressRect.left) / progressRect.width;
    // setCurrentTime(seekPosition * duration);
    dispatch(setSeek(seekPosition));
    streamRef.current?.seekTo(seekPosition, "fraction");
  };

  useEffect(() => {
    if (seek !== 0) {
      fullVideoRef?.current?.seekTo(seek, "fraction");
    }
  }, [seek]);

  useEffect(() => {
    if (fullScreenVideo.value) {
      dispatch(
        setVideoSync({
          actionHeart: videoSync.heart,
          actionDuration: videoSync.duration,
          actionCurrentTime: videoSync.currentTime,
          actionIsPlaying: false,
          actionLikedArray: videoSync.likedArray,
          actionMirroredArray: videoSync.mirroredArray,
          actionCollectedArray: videoSync.collectedArray,
          actionVideosLoading: videoSync.videosLoading,
        })
      );
      streamRef?.current?.seekTo(videoSync.currentTime, "seconds");
      fullVideoRef?.current?.seekTo(videoSync.currentTime, "seconds");
      setTimeout(() => {
        dispatch(
          setVideoSync({
            actionHeart: videoSync.heart,
            actionDuration: videoSync.duration,
            actionCurrentTime: videoSync.currentTime,
            actionIsPlaying: true,
            actionLikedArray: videoSync.likedArray,
            actionMirroredArray: videoSync.mirroredArray,
            actionCollectedArray: videoSync.collectedArray,
            actionVideosLoading: videoSync.videosLoading,
          })
        );
      }, 1000);
    }
  }, [fullScreenVideo.value]);

  return {
    streamRef,
    formatTime,
    volume,
    volumeOpen,
    setVolumeOpen,
    handleHeart,
    mirrorLoading,
    collectLoading,
    likeLoading,
    collectVideo,
    mirrorVideo,
    likeVideo,
    profileId,
    handleVolumeChange,
    wrapperRef,
    progressRef,
    handleSeek,
    fullVideoRef,
  };
};

export default useControls;
