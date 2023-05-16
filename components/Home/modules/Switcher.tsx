import { FunctionComponent } from "react";
import DropsSwitcher from "./pages/DropsSwitcher";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import TokenGatedSwitcher from "./pages/TokenGatedSwitcher";
import CollectionsSwitcher from "./pages/CollectionsSwitcher";
import SalesSwitcher from "./pages/SalesSwitcher";

const Switcher: FunctionComponent = (): JSX.Element => {
  const pages = useSelector((state: RootState) => state.app.pageReducer.value);

  switch (pages) {
    // case "token gated":
    //   return <TokenGatedSwitcher />;

    case "drops":
      return <DropsSwitcher />;

    case "sales":
      return <SalesSwitcher />;

    default:
      return <CollectionsSwitcher />;
  }
};

export default Switcher;
