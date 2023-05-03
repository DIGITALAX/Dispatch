import getAllDrops from "@/graphql/subgraph/queries/getAllDrops";
import { setAllDropsRedux } from "@/redux/reducers/allDropsSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

const useAllDrops = () => {
  const dispatch = useDispatch();
  const auth = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const { address } = useAccount();
  const [allDrops, setAllDrops] = useState<any[]>([]);

  const getDropsAll = async (): Promise<void> => {
    try {
      const data = await getAllDrops({
        creator: address,
      });
      setAllDrops(data.data.dropCreateds);
      dispatch(setAllDropsRedux(data.data.dropCreateds));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (auth && allDrops.length < 1) {
      getDropsAll();
    }
  }, []);

  return { allDrops };
};

export default useAllDrops;
