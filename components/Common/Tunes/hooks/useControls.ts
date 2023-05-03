import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { UseControlsResults } from "../types/video.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import addReaction from "@/graphql/lens/mutations/react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
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
import ReactPlayer from "react-player";
import { waitForTransaction } from "@wagmi/core";
import { setReactId } from "@/redux/reducers/reactIdSlice";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { setVideoSync } from "@/redux/reducers/videoSyncSlice";

const useControls = (): UseControlsResults => {
  const streamRef = useRef<ReactPlayer>(null);
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
  const { signTypedDataAsync } = useSignTypedData();
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
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

  // useEffect(() => {
  //   if (fullScreen) {
  //     if (!document?.fullscreenElement) {
  //       wrapperRef?.current!?.requestFullscreen();
  //       setFullScreen(false);
  //     }
  //   }
  // }, [fullScreen]);

  const likeVideo = async (): Promise<void> => {
    let react: any;
    setLikeLoading(true);
    dispatch(setReactId(mainVideo.id));
    if (!profileId && !authStatus) {
      setLikeLoading(false);

      return;
    }
    try {
      react = await addReaction({
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
    setMirrorLoading(false);
  };

  const mirrorWrite = async (): Promise<void> => {
    setMirrorLoading(true);
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
      setMirrorLoading(false);
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
      setCollectLoading(false);
      console.error(err.message);
    }
    setCollectLoading(false);
  };

  const collectWrite = async (): Promise<void> => {
    setCollectLoading(true);
    try {
      const tx = await collectWriteAsync?.();
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
      setCollectLoading(false);
    }
    setCollectLoading(false);
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

  const handleSeek = (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => {
    const progressRect = e.currentTarget.getBoundingClientRect();
    const seekPosition = (e.clientX - progressRect.left) / progressRect.width;
    // setCurrentTime(seekPosition * duration);
    streamRef.current?.seekTo(seekPosition, "fraction");
  };

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
  };
};

export default useControls;
