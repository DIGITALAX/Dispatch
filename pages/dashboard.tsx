import Page404 from "@/components/Common/404/404";
import useConnect from "@/components/Common/Connect/hooks/useConnect";
import Connect from "@/components/Common/Connect/modules/Connect";
import FetchMoreLoading from "@/components/Common/Loading/FetchMoreLoading";
import Options from "@/components/Home/modules/Options";
import Switcher from "@/components/Home/modules/Switcher";
import { getCreaterToken } from "@/lib/utils";
import { RootState } from "@/redux/store";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const { handleConnect, handleLensSignIn, connected, openAccountModal } =
    useConnect();
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const pages = useSelector((state: RootState) => state.app.pageReducer.value);

  useEffect(() => {
    const data = getCreaterToken();
    if (data === "false" || !data) {
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [isConnected]);

  if (loading) {
    return <FetchMoreLoading size={"4rem"} height={"calc(100vh - 10.5rem)"} />;
  }

  if (!authorized && !loading) {
    return <Page404 router={router} />;
  }

  if (authorized && !loading && address) {
    return (
      <div className="relative w-full h-full flex flex-col overflow-x-hidden selection:bg-ama selection:text-moda bg-black">
        <Head>
          <title>Chromadin Dispatcher</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="relative w-full flex flex-col sm:flex-row items-center justify-start px-8 pt-8 pb-10">
          <div className="relative w-full h-fit flex preG:flex-row items-center justify-start flex-col">
            <div className="relative font-arcade w-fit justify-start items-center h-fit text-white text-lg preG:text-2xl flex py-2 px-3 preG:border-r preG:border-r-white">
              <div
                className="absolute items-center justify-center flex top-px opacity-70 break-words"
                id="dispatcherBack"
              >
                chromadin dispatcher
              </div>
              <div
                className="absolute items-center justify-center flex top-1.5 break-words"
                id="dispatcherBack"
              >
                chromadin dispatcher
              </div>
              <div className="relative items-center justify-center flex top-2 break-words">
                chromadin dispatcher
              </div>
            </div>
            <div className="relative font-arcade w-fit justify-start items-center h-fit py-4 px-3 text-white text-sm preG:text-lg flex flex-col top-1.5">
              <div
                className="absolute w-fit h-fit flex items-center justify-center top-2 opacity-70"
                id="pageBack"
              >
                {pages}
              </div>
              <div
                className="absolute w-fit h-fit flex items-center justify-center top-3"
                id="pageBack"
              >
                {pages}
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                {pages}
              </div>
            </div>
          </div>
          <div className="relative w-fit h-fit justify-start sm:justify-end items-center flex">
            <Connect
              handleConnect={handleConnect}
              handleLensSignIn={handleLensSignIn}
              connected={connected}
              authStatus={authStatus}
              profile={profile}
              router={router}
              openAccountModal={openAccountModal}
            />
          </div>
        </div>
        <div
          className="relative w-full h-full lg:h-210 flex flex-col mid:flex-row items-start justify-start px-8 pb-16 gap-14 "
          style={{
            minHeight:
              typeof window !== "undefined" && window.innerWidth > 768
                ? "calc(100vh - 10.5rem)"
                : "calc(100vh - 12.5rem)",
          }}
        >
          <Options dispatch={dispatch} />
          <div
            style={{ height: "100%", overflowY: "auto" }}
            className="w-full flex"
          >
            <Switcher />
          </div>
        </div>
      </div>
    );
  }
}
