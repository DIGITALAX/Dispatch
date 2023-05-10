import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { setSalesRedux } from "@/redux/reducers/salesSlice";
import getSalesHistory from "@/graphql/subgraph/queries/getSalesHistory";
import { Sales } from "../types/sales.types";

const useSales = () => {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const salesReducer = useSelector(
    (state: RootState) => state.app.salesReducer.value
  );
  const [sales, setSales] = useState<Sales[]>([]);
  const [salesLoading, setSalesLoading] = useState<boolean>(false);
  const indexModal = useSelector(
    (state: RootState) => state.app.indexModalReducer.message
  );

  const getUserHistory = async () => {
    if (!address) return;
    setSalesLoading(true);
    try {
      const res = await getSalesHistory(address);
      if (
        [
          ...res.data.tokensBoughts,
          ...res.data.chromadinMarketplaceNewTokensBoughts,
        ].length > 0
      ) {
        const history = await Promise.all(
          [
            ...res.data.tokensBoughts,
            ...res.data.chromadinMarketplaceNewTokensBoughts,
          ].map(async (history: Sales) => {
            const json = await fetchIPFSJSON(
              (history.uri as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            );
            let defaultProfile;
            defaultProfile = await getDefaultProfile(history.creator);
            if (!defaultProfile?.data?.defaultProfile) {
              defaultProfile = {
                handle: "syntheticfutures.lens",
                picture: {
                  original: {
                    url: "ipfs://Qmd7PdjsVSfVs6j4uFbxZLsHmzkJw2DYQLxbmgX7aDWkb3",
                  },
                },
              };
            } else {
              defaultProfile = defaultProfile?.data?.defaultProfile;
            }
            return {
              ...history,
              uri: json,
              profile: defaultProfile,
            };
          })
        );
        dispatch(setSalesRedux(history));
        setSales(history);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSalesLoading(false);
  };

  useEffect(() => {
    if (salesReducer.length < 1 || !salesReducer) {
      getUserHistory();
    }
  }, [indexModal]);

  return { sales, salesLoading };
};

export default useSales;
