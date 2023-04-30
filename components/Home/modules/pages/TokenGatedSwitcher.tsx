import AllPosts from "@/components/Components/TokenGated/modules/AllPosts";
import { RootState } from "@/redux/store";
import { FunctionComponent } from "react";
import { useSelector } from "react-redux";

const TokenGatedSwitcher: FunctionComponent = (): JSX.Element => {
  const tokenGatedSwitcher = useSelector(
    (state: RootState) => state.app.dropSwitcherReducer.value
  );

  switch (tokenGatedSwitcher) {
    default:
      return <AllPosts />;
  }
};

export default TokenGatedSwitcher;
