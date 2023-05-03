import { Profile } from "@/components/Home/types/lens.types";
import { NextRouter } from "next/router";

export type UseConnectResults = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  handleRefreshProfile: () => Promise<void>;
  connected: boolean;
};

export type ConnectProps = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  authStatus: boolean;
  profile: Profile | undefined;
  router: NextRouter;
};

export type AuthProps = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  authStatus: boolean;
  profile: Profile | undefined;
  router: NextRouter;
};

export type WalletProps = {
  handleTransaction: () => void;
  isConnected: boolean;
  buttonText: string;
  router: NextRouter;
};

export type ProfileProps = {
  profile: Profile | undefined;
};
