import getAllDrops from "@/graphql/subgraph/queries/getAllDrops";
import { setAllDropsRedux } from "@/redux/reducers/allDropsSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { Drop } from "../types/drops.types";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";

const useAllDrops = () => {
  const dispatch = useDispatch();
  const successModal = useSelector(
    (state: RootState) => state.app.successModalReducer
  );
  const { address } = useAccount();
  const [allDrops, setAllDrops] = useState<any[]>([]);
  const allDropsRedux = useSelector(
    (state: RootState) => state.app.allDropsReducer.value
  );

  const getDropsAll = async (): Promise<void> => {
    try {
      const data = await getAllDrops({
        creator: address,
      });
      const drops = await Promise.all(
        data.data.dropCreateds.map(async (drop: any) => {
          const json = await fetchIPFSJSON(
            (drop.dropURI as any)?.split("ipfs://")[1].replace(/"/g, "").trim()
          );

          return {
            ...drop,
            uri: json,
          };
        })
      );
      setAllDrops(drops);
      dispatch(setAllDropsRedux(drops));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!allDropsRedux || allDropsRedux.length < 1) {
      getDropsAll();
    }
  }, []);

  console.log({ m: successModal.message });

  useEffect(() => {
    if (successModal.message.includes("Drop Live!")) {
      getDropsAll();
    }
  }, [successModal.open]);

  return { allDrops };
};

export default useAllDrops;
