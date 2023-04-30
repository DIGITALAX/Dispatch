import useConnect from "@/components/Components/Connect/hooks/useConnect";
import Connect from "@/components/Components/Connect/modules/Connect";
import Marquee from "@/components/Components/Marquee/Marquee";
import useChannels from "@/components/Components/Tunes/hooks/useChannels";
import Channels from "@/components/Components/Tunes/modules/Channels";
import Tunes from "@/components/Components/Tunes/modules/Tunes";
import Options from "@/components/Home/modules/Options";
import Switcher from "@/components/Home/modules/Switcher";
import { RootState } from "@/redux/store";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const { handleConnect, handleLensSignIn, connected } = useConnect();
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const pages = useSelector((state: RootState) => state.app.pageReducer.value);
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const { videos, liked, mirrored, videosLoading, collected, hover, setHover } =
    useChannels();
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
          />
        </div>
      </div>
      <div className="relative w-full h-full flex flex-row items-start justify-start px-8 pb-10 gap-6">
        <Options dispatch={dispatch} />
        <Switcher />
      </div>
      <Channels
        videos={videos}
        dispatch={dispatch}
        liked={liked}
        mirrored={mirrored}
        videosLoading={videosLoading}
        dispatchVideos={dispatchVideos}
        collected={collected}
        hover={hover}
        setHover={setHover}
      />
      <Tunes />
      <Marquee />
    </div>
  );
}
