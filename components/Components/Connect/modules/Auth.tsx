import { FunctionComponent } from "react";
import Wallet from "./Wallet";
import Profile from "./Profile";
import { AuthProps } from "../types/connect.types";

const Auth: FunctionComponent<AuthProps> = ({
  connected,
  authStatus,
  handleConnect,
  handleLensSignIn,
  profile,
}): JSX.Element => {
  let action: string;
  const decideStringAction = () => {
    if (authStatus && connected && profile?.handle) {
      action = "profile";
    }
    return action;
  };

  switch (decideStringAction()) {
    case "profile":
      return <Profile profile={profile} />;

    default:
      return (
        <Wallet
          handleTransaction={connected ? handleLensSignIn : handleConnect}
          buttonText={connected ? "SOCIAL" : "CONNECT"}
          isConnected={connected}
        />
      );
  }
};

export default Auth;
