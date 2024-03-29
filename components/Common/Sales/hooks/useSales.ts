import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { setSalesRedux } from "@/redux/reducers/salesSlice";
import getSalesHistory, {
  getSalesHistoryUpdated,
} from "@/graphql/subgraph/queries/getSalesHistory";
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
  const pages = useSelector((state: RootState) => state.app.pageReducer.value);
  const allCollections = useSelector(
    (state: RootState) => state.app.allCollectionsReducer.value
  );

  const getUserHistory = async () => {
    if (!address) return;
    setSalesLoading(true);
    try {
      const res = await getSalesHistory(address);
      const resUpdated = await getSalesHistoryUpdated(address);
      if (
        res.data.tokensBoughts.length > 0 ||
        resUpdated.data.updatedChromadinMarketTokensBoughts.length > 0
      ) {
        const history = await Promise.all(
          [
            ...(res.data.tokensBoughts || []),
            ...(resUpdated.data.updatedChromadinMarketTokensBoughts || []),
          ].map(async (history: Sales) => {
            const json = await fetchIPFSJSON(
              (history.uri as any)?.includes("ipfs://")
                ? (history.uri as any)
                    ?.split("ipfs://")[1]
                    ?.replace(/"/g, "")
                    ?.trim()
                : (history.uri as any)?.trim()
            );

            const defaultProfile = await getDefaultProfile(history.creator);

            return {
              ...history,
              uri: json,
              profile: defaultProfile?.data?.defaultProfile,
            };
          })
        );
        const newHistory: Sales[] = [];
        history.forEach((tokenBought) => {
          const tokenId = tokenBought.tokenIds[0];
          const matchingObject = allCollections.find((collection) => {
            return collection.tokenIds.includes(tokenId);
          });

          if (matchingObject) {
            const index = matchingObject.basePrices.findIndex((value) => {
              return value === tokenBought.totalPrice;
            });
            if (index !== -1) {
              newHistory.push({
                ...tokenBought,
                type: matchingObject.acceptedTokens[index],
              });
            }
          }
        });
        dispatch(setSalesRedux(newHistory));
        setSales(newHistory);
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
  }, [indexModal, pages]);

  return { sales, salesLoading };
};

export default useSales;
