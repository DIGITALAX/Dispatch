import useConnect from "@/components/Components/Connect/hooks/useConnect";
import Connect from "@/components/Components/Connect/modules/Connect";
import Options from "@/components/Home/modules/Options";
import Switcher from "@/components/Home/modules/Switcher";
import { RootState } from "@/redux/store";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { handleConnect, handleLensSignIn, connected } = useConnect();
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const pages = useSelector((state: RootState) => state.app.pageReducer.value);
  return (
    <div className="relative w-full h-full flex flex-col overflow-x-hidden selection:bg-ama selection:text-moda bg-offBlack">
      <Head>
        <title>Chromadin Dispatcher</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative w-full flex flex-row items-center justify-start px-8 pt-8 pb-10">
        <div className="relative w-full h-fit flex flex-row items-center justify-start">
          <div className="relative font-arcade w-fit justify-start items-center h-fit text-white text-2xl flex">
            chromadin dispatcher
          </div>
          <div className="relative font-geom w-fit justify-start items-center h-fit py-4 px-3 text-white text-lg flex">
            | {pages}
          </div>
        </div>
        <div className="relative w-fit h-fit justify-end items-center">
          <Connect
            handleConnect={handleConnect}
            handleLensSignIn={handleLensSignIn}
            connected={connected}
            authStatus={authStatus}
            profile={profile}
            router={router}
          />
        </div>
      </div>
      <div className="relative w-full h-210 flex flex-row items-start justify-start px-8 pb-16 gap-14">
        <Options dispatch={dispatch} />
        <Switcher />
      </div>
    </div>
  );
}
