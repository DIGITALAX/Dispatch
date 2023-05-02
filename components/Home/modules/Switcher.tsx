import { FunctionComponent } from "react";
import DropsSwitcher from "./pages/DropsSwitcher";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import TokenGatedSwitcher from "./pages/TokenGatedSwitcher";
import CollectionsSwitcher from "./pages/CollectionsSwitcher";

const Switcher: FunctionComponent = (): JSX.Element => {
  const pages = useSelector((state: RootState) => state.app.pageReducer.value);

  switch (pages) {
    case "token gated":
      return <TokenGatedSwitcher />;

    case "drops":
      return <DropsSwitcher />;

    default:
      return <CollectionsSwitcher />;
  }
};

export default Switcher;
