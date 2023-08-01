import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { UseConnectResults } from "../types/connect.types";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddress,
  getAuthenticationToken,
  isAuthExpired,
  refreshAuth,
  removeAuthenticationToken,
  setAddress,
  setAuthenticationToken,
} from "@/lib/lens/utils";
import authenticate from "@/graphql/lens/mutations/authenticate";
import { useEffect, useState } from "react";
import generateChallenge from "@/graphql/lens/queries/generateChallenge";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { CHROMADIN_ACCESS_CONTROLS } from "@/lib/constants";
import { setIsCreator } from "@/redux/reducers/isCreatorSlice";
import { useRouter } from "next/router";
import { setAuthStatus } from "@/redux/reducers/authStatusSlice";
import { setLensProfile } from "@/redux/reducers/lensProfileSlice";
import { setLookAround } from "@/redux/reducers/lookAroundSlice";
import { setCreatorToken } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { setAutographHandle } from "@/redux/reducers/autographHandleSlice";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";

const useConnect = (): UseConnectResults => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const dispatch = useDispatch();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const { address, isConnected } = useAccount();
  const [connected, setConnected] = useState<boolean>(false);
  const router = useRouter();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );

  const getIsCreator = async () => {
    try {
      const data = await publicClient.readContract({
        address: CHROMADIN_ACCESS_CONTROLS,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_writer",
                type: "address",
              },
            ],
            name: "isWriter",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "isWriter",
        args: [address as `0x${string}`],
      });

      if (data && router) {
        dispatch(setIsCreator(data as boolean));
      } else {
        dispatch(setLookAround(true));
      }

      setCreatorToken((data as boolean) ? (data as boolean) : false);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleConnect = (): void => {
    openConnectModal && openConnectModal();
  };

  const handleLensSignIn = async (): Promise<void> => {
    try {
      const challengeResponse = await generateChallenge(address);
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      const signature = await clientWallet.signMessage({
        account: address as `0x${string}`,
        message: challengeResponse.data.challenge.text,
      });
      const accessTokens = await authenticate(
        address as string,
        signature as string
      );
      if (accessTokens) {
        setAuthenticationToken({ token: accessTokens.data.authenticate });
        setAddress(address as string);
        if (!address) return;
        const profile = await getDefaultProfile(address!);
        if (profile?.data?.defaultProfile) {
          dispatch(setLensProfile(profile?.data?.defaultProfile));
          dispatch(setAuthStatus(true));
        }
      }
    } catch (err: any) {
      dispatch(setAuthStatus(false));
      console.error(err.message);
    }
  };

  const handleRefreshProfile = async (): Promise<void> => {
    try {
      if (!address) return;
      const profile = await getDefaultProfile(address!);
      if (profile?.data?.defaultProfile !== null) {
        dispatch(setLensProfile(profile?.data?.defaultProfile));
        dispatch(setAuthStatus(true));
      } else {
        dispatch(setAuthStatus(false));
        removeAuthenticationToken();
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getProfileforAutograph = async () => {
    try {
      if (!address) return;
      const def = await getDefaultProfile(address!);
      if (def?.data?.defaultProfile === null) return;
      dispatch(setAutographHandle(def?.data?.defaultProfile?.handle));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const newAddress = getAddress();
    if (
      (newAddress && newAddress.replace(/^"|"$/g, "") === address) ||
      (!newAddress && address)
    ) {
      const token = getAuthenticationToken();
      setAddress(address as string);
      if (isConnected && !token) {
        dispatch(setLensProfile(undefined));
        removeAuthenticationToken();
      } else if (isConnected && token) {
        if (isAuthExpired(token?.exp)) {
          const refreshedAccessToken = refreshAuth();
          if (!refreshedAccessToken) {
            dispatch(setLensProfile(undefined));
            removeAuthenticationToken();
          }
        }
        handleRefreshProfile();
      }
    } else if (isConnected && address !== newAddress) {
      dispatch(setLensProfile(undefined));
      removeAuthenticationToken();
    }
  }, [isConnected]);

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (!lensProfile && isConnected) {
      getProfileforAutograph();
    }
    getIsCreator();
  }, [isConnected, lensProfile]);

  return {
    handleConnect,
    handleLensSignIn,
    handleRefreshProfile,
    connected,
    openAccountModal,
  };
};

export default useConnect;
