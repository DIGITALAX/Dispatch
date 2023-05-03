import { FunctionComponent } from "react";
import { ConnectProps } from "../types/connect.types";
import Auth from "./Auth";

const Connect: FunctionComponent<ConnectProps> = ({
  handleConnect,
  connected,
  handleLensSignIn,
  authStatus,
  profile,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full py-3 sm:py-8 lg:py-3 px-3 flex flex-col sm:flex-row lg:flex-col items-center gap-4 justify-start sm:justify-center">
      <Auth
        connected={connected}
        handleConnect={handleConnect}
        handleLensSignIn={handleLensSignIn}
        authStatus={authStatus}
        profile={profile}
        router={router}
      />
    </div>
  );
};

export default Connect;
