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
  router,
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
          handleTransaction={
            connected && router.asPath.includes("dashboard")
              ? handleLensSignIn
              : handleConnect
          }
          buttonText={
            connected && router.asPath.includes("dashboard")
              ? "SOCIAL"
              : "CONNECT"
          }
          isConnected={connected}
          router={router}
        />
      );
  }
};

export default Auth;
