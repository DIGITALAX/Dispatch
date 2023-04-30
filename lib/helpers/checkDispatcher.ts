
import createDispatcherRequest from "@/graphql/lens/mutations/dispatcher";
import { setDispatcher } from "@/redux/reducers/dispatcherSlice";
import { AnyAction, Dispatch } from "redux";

const checkDispatcher = async (
  dispatch: Dispatch<AnyAction>,
  profileId: string,
  relay?: boolean
): Promise<void> => {
  try {
    if (profileId) {
      dispatch(setDispatcher(!relay ? false : relay));
      if (relay) {
        await createDispatcherRequest({
          profileId,
        });
      }
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default checkDispatcher;
