import { FunctionComponent } from "react";
import Wallet from "./Wallet";
import Profile from "./Profile";
import { AuthProps } from "../types/connect.types";
import Dashboard from "./Dashboard";

const Auth: FunctionComponent<AuthProps> = ({
  connected,
  authStatus,
  handleConnect,
  handleLensSignIn,
  profile,
  router,
  openAccountModal
}): JSX.Element => {
  let action: string;
  const decideStringAction = () => {
    if (connected) {
      if (router.asPath.includes("dashboard")) {
        if (profile?.handle && authStatus) {
          action = "profile";
        }
      } else {
        action = "dashboard";
      }
    }
    return action;
  };

  switch (decideStringAction()) {
    case "profile":
      return <Profile profile={profile} openAccountModal={openAccountModal} />;

    case "dashboard":
      return <Dashboard router={router} />;

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
        />
      );
  }
};

export default Auth;
