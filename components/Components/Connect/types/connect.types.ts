import { Profile, Publication } from "@/components/Home/types/lens.types";
import { AnyAction, Dispatch } from "redux";

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
};

export type AuthProps = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  authStatus: boolean;
  profile: Profile | undefined;
};

export type WalletProps = {
  handleTransaction: () => void;
  isConnected: boolean;
  buttonText: string;
};

export type ProfileProps = {
  profile: Profile | undefined;
};
