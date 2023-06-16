import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { store } from "./../redux/store";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Provider } from "react-redux";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import Modals from "@/components/Common/Modals/modules/Modals";
import Video from "@/components/Common/Tunes/modules/Video";
import { useEffect, useState } from "react";
import FetchMoreLoading from "@/components/Common/Loading/FetchMoreLoading";
import { useRouter } from "next/router";

const { chains, provider } = configureChains(
  [polygon],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Chromadin Dispatch",
  chains,
  projectId: process.env.WALLET_CONNECT_PROJECT_ID as string,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [routerChangeLoading, setRouterChangeLoading] =
    useState<boolean>(false);
  useEffect(() => {
    const handleStart = () => {
      setRouterChangeLoading(true);
    };

    const handleStop = () => {
      setRouterChangeLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  if (routerChangeLoading) {
    return <FetchMoreLoading size={"4rem"} height={"calc(100vh - 10.5rem)"} />;
  }
  return (
    <Provider store={store}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <div className="relative min-h-screen w-full overflow-x-hidden selection:bg-ama selection:text-moda">
            <Component {...pageProps} />
            <Modals />
            <Video />
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </Provider>
  );
}
